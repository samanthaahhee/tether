-- One-partner-per-user enforcement (server-side, defence in depth).
--
-- Before: accept_invite() blocked the ACCEPTOR from being already coupled,
-- but did NOT check the INVITER. So an already-paired user A could
-- generate an invite that a fresh user C could accept, giving A two
-- partners. Closes that hole.
--
-- Also adds a BEFORE INSERT trigger on couple_invites so the database
-- refuses to record an invite from an already-coupled user even if the
-- client-side check is bypassed.

create or replace function public.accept_invite(invite_code text)
returns table (
  status     text,    -- 'ok' | 'invalid' | 'expired' | 'used' | 'self' | 'already_linked' | 'inviter_already_linked'
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
  inviter_existing uuid;
begin
  if caller_id is null then
    return query select 'invalid'::text, 'You must be signed in.'::text, null::uuid;
    return;
  end if;

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

  select id into existing
    from public.couples
   where (user1_id = invite_row.inviter_id and user2_id = caller_id)
      or (user1_id = caller_id and user2_id = invite_row.inviter_id)
   limit 1;

  if existing is not null then
    update public.couple_invites
       set used = true, used_by = caller_id
     where id = invite_row.id and not used;
    return query select 'already_linked'::text,
                        'You are already linked with this person.'::text,
                        existing;
    return;
  end if;

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

  select id into inviter_existing
    from public.couples
   where user1_id = invite_row.inviter_id or user2_id = invite_row.inviter_id
   limit 1;
  if inviter_existing is not null then
    update public.couple_invites
       set used = true, used_by = caller_id
     where id = invite_row.id and not used;
    return query select 'inviter_already_linked'::text,
                        'This invite is no longer valid. The person who sent it is already linked with someone.'::text,
                        null::uuid;
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

revoke all on function public.accept_invite(text) from public;
grant execute on function public.accept_invite(text) to authenticated;

create or replace function public.couple_invites_block_already_coupled()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.couples
    where user1_id = new.inviter_id or user2_id = new.inviter_id
  ) then
    raise exception 'Inviter is already linked with a partner.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists couple_invites_block_already_coupled_trg
  on public.couple_invites;

create trigger couple_invites_block_already_coupled_trg
  before insert on public.couple_invites
  for each row execute function public.couple_invites_block_already_coupled();
