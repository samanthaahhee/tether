-- Cross-session safety state for Hey Otis (Pillar 9 of GUARDRAILS.md).
--
-- When the client-side or server-side crisis detector fires, we update a
-- per-user safety_state JSONB on profiles. The app reads this on launch
-- so a crisis cannot be reset simply by closing and reopening the app.
--
-- Shape:
--   {
--     "last_crisis_at":   "2026-04-30T12:00:00Z",
--     "last_category":    "suicide",
--     "elevated_until":   "2026-05-07T12:00:00Z",
--     "history_count":    3
--   }
--
-- Users CANNOT delete this state from inside the app (audit requirement),
-- but it is included in the GDPR Right to Erasure flow handled
-- out-of-band by the data-protection officer.

alter table public.profiles
  add column if not exists safety_state jsonb not null default '{}'::jsonb;

comment on column public.profiles.safety_state is
  'Cross-session safety markers for the user. Updated by the
   record_safety_event RPC. Read on app launch to surface persistent
   helpline cards and check-in prompts after a crisis.';

create or replace function public.record_safety_event(
  p_category text
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_existing jsonb;
  v_history_count int;
begin
  if v_uid is null then
    raise exception 'unauthenticated';
  end if;
  if p_category is null or btrim(p_category) = '' then
    raise exception 'category is required';
  end if;

  select safety_state into v_existing
  from public.profiles
  where id = v_uid;

  v_history_count := coalesce((v_existing->>'history_count')::int, 0) + 1;

  update public.profiles set
    safety_state = jsonb_build_object(
      'last_crisis_at', to_jsonb(v_now),
      'last_category',  to_jsonb(p_category),
      'elevated_until', to_jsonb(v_now + interval '7 days'),
      'history_count',  to_jsonb(v_history_count)
    )
  where id = v_uid;

  perform public.log_security_event(
    'crisis.state_updated',
    'critical',
    v_uid,
    'record_safety_event',
    jsonb_build_object('category', p_category, 'history_count', v_history_count)
  );
exception when others then
  raise warning 'record_safety_event failed: %', sqlerrm;
end;
$$;

revoke all on function public.record_safety_event(text) from public;
grant execute on function public.record_safety_event(text) to authenticated;

do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'profiles_no_user_safety_state_write'
  ) then
    drop policy profiles_no_user_safety_state_write on public.profiles;
  end if;
end$$;

create policy profiles_no_user_safety_state_write
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and safety_state is not distinct from (
    select safety_state from public.profiles where id = auth.uid()
  )
);
