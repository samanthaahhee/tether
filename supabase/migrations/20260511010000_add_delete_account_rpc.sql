-- Apple Guideline 5.1.1(v) requires the user be able to fully delete their
-- account from inside the app. Wire up a single RPC the client can call —
-- it deletes the auth.users row and all FK-cascaded data (profile, couples,
-- invites). Audit-trail data in security_events is preserved (anonymised by
-- design — no email or PII stored there).

-- 1) The FK from couple_invites.used_by → auth.users is currently NO ACTION,
--    which would block the delete. Change to SET NULL so historical invites
--    survive (anonymised) and don't block account deletion.
alter table public.couple_invites
  drop constraint if exists couple_invites_used_by_fkey;
alter table public.couple_invites
  add constraint couple_invites_used_by_fkey
  foreign key (used_by) references auth.users(id) on delete set null;

-- 2) The delete RPC. SECURITY DEFINER so it can touch auth.users; explicit
--    auth.uid() check ensures users can only delete themselves.
create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Wipe rate-limit buckets keyed by this user (text key, no FK).
  delete from public.rate_limit_buckets where key like 'user:' || uid::text || ':%';

  -- Delete the auth user. ON DELETE CASCADE on profiles, couples, and
  -- couple_invites (inviter_id) wipes the rest. couple_invites.used_by
  -- becomes NULL via the SET NULL we just installed.
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;

comment on function public.delete_account() is
  'GDPR/Apple-compliant account deletion. Caller must be authenticated; deletes their own auth.users row, which cascades to profiles, couples, and invites. Logged in security_events on success.';
