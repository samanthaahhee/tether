-- ═════════════════════════════════════════════════════════════════════════════
-- Harden invite + couple policies and add atomic accept_invite RPC
--
-- Applied to prod via Supabase MCP on 2026-04-21 (version 20260421102940).
-- Keep this file in sync with the live policies.
--
-- Before this migration:
--   * couple_invites SELECT policy was `using (true)` — anyone could read any
--     invite row by code, enabling enumeration.
--   * couple_invites UPDATE policy was `using (true)` — any authenticated user
--     could mark ANY invite as used, poison used_by, or change expires_at.
--     This is a real IDOR.
--   * No DELETE policy on couples — partners could not unlink without deleting
--     their whole account.
--   * Invite acceptance was a 3-step client dance (SELECT → INSERT couple →
--     UPDATE invite) with no atomicity; racing accepts could duplicate rows.
--
-- After:
--   * All invite mutations are funneled through the accept_invite() RPC, which
--     runs as SECURITY DEFINER in a single transaction and re-verifies
--     ownership using auth.uid() at every step.
--   * Direct SELECT/UPDATE/DELETE on couple_invites is scoped to the inviter
--     only — accepters never read the table directly.
--   * Either partner can delete their couple record.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── 1. Replace the wide-open invite policies ────────────────────────────────

drop policy if exists "Anyone can look up an invite by code" on public.couple_invites;
drop policy if exists "Users can mark invite as used"       on public.couple_invites;

create policy "Inviters can view their own invites"
  on public.couple_invites for select
  using (inviter_id = auth.uid());

create policy "Inviters can update their own invites"
  on public.couple_invites for update
  using (inviter_id = auth.uid());

create policy "Inviters can delete their own invites"
  on public.couple_invites for delete
  using (inviter_id = auth.uid());

-- ── 2. Allow either partner to delete their couple link ─────────────────────

drop policy if exists "Partners can unlink their couple" on public.couples;

create policy "Partners can unlink their couple"
  on public.couples for delete
  using (user1_id = auth.uid() or user2_id = auth.uid());

-- ── 3. Atomic accept_invite RPC ─────────────────────────────────────────────
--
-- SECURITY DEFINER runs with the function owner's privileges (postgres), so it
-- bypasses RLS. That makes the auth.uid() check inside the function the only
-- gate — hence the explicit whoami check at the top.
--
-- Returns a single-row result set with { status, message, couple_id } so the
-- client can branch cleanly on well-defined codes.

create or replace function public.accept_invite(invite_code text)
returns table (
  status     text,    -- 'ok' | 'invalid' | 'expired' | 'used' | 'self' | 'already_linked'
  message    text,
  couple_id  uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_id  uuid := auth.uid();
  invite_row public.couple_invites%rowtype;
  new_couple uuid;
  existing   uuid;
begin
  -- A missing caller means an anon client tried to RPC — refuse.
  if caller_id is null then
    return query select 'invalid'::text, 'You must be signed in.'::text, null::uuid;
    return;
  end if;

  -- Atomically lock the invite row so concurrent acceptances serialise.
  select * into invite_row
    from public.couple_invites
   where code = upper(trim(invite_code))
   for update;

  if not found then
    return query select 'invalid'::text, 'Invalid or expired invite code.'::text, null::uuid;
    return;
  end if;

  if invite_row.used then
    return query select 'used'::text, 'This invite has already been used.'::text, null::uuid;
    return;
  end if;

  if invite_row.expires_at is not null and invite_row.expires_at < now() then
    return query select 'expired'::text, 'This invite has expired.'::text, null::uuid;
    return;
  end if;

  if invite_row.inviter_id = caller_id then
    return query select 'self'::text, 'You cannot accept your own invite.'::text, null::uuid;
    return;
  end if;

  -- If a couple row already exists for this pair (in either direction), don't
  -- create another — idempotent.
  select id into existing
    from public.couples
   where (user1_id = invite_row.inviter_id and user2_id = caller_id)
      or (user1_id = caller_id and user2_id = invite_row.inviter_id)
   limit 1;

  if existing is not null then
    -- Still mark the invite used so it can't be reused against a new partner.
    update public.couple_invites
       set used = true, used_by = caller_id
     where id = invite_row.id
       and not used;
    return query select 'already_linked'::text,
                        'You are already linked with this person.'::text,
                        existing;
    return;
  end if;

  -- Belt-and-braces: refuse to link a caller who is already in ANY couple.
  -- The app assumes one partner per user; callers who already have a partner
  -- must unlink first.
  select id into existing
    from public.couples
   where user1_id = caller_id or user2_id = caller_id
   limit 1;
  if existing is not null then
    return query select 'already_linked'::text,
                        'You are already linked with a partner. Unlink first to connect with someone new.'::text,
                        existing;
    return;
  end if;

  insert into public.couples (user1_id, user2_id)
       values (invite_row.inviter_id, caller_id)
    returning id into new_couple;

  update public.couple_invites
     set used = true, used_by = caller_id
   where id = invite_row.id;

  return query select 'ok'::text, 'Linked.'::text, new_couple;
end;
$$;

-- Only authenticated callers may invoke it. (Anon has no auth.uid().)
revoke all on function public.accept_invite(text) from public;
grant execute on function public.accept_invite(text) to authenticated;

-- ── 4. Helpful comment for future maintainers ──────────────────────────────

comment on function public.accept_invite(text) is
  'Atomic invite acceptance. SECURITY DEFINER — only callable by authenticated users. '
  'Returns { status, message, couple_id } where status is one of: '
  'ok, invalid, expired, used, self, already_linked.';
