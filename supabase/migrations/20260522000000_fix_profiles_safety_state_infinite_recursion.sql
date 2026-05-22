-- The previous RLS policy `profiles_no_user_safety_state_write` queried
-- public.profiles from within a policy on public.profiles. Postgres detected
-- that as infinite recursion and rejected every UPDATE on the table —
-- which made every onboarding completion + consent acceptance fail silently
-- (the client-side error logging masked it for weeks).
--
-- Replace with a BEFORE UPDATE trigger that compares OLD.safety_state to
-- NEW.safety_state directly (no SELECT needed, no recursion). The trigger
-- only blocks writes from non-service-role roles, so admin tooling +
-- our own SECURITY DEFINER RPCs can still update safety_state when needed.

drop policy if exists profiles_no_user_safety_state_write on public.profiles;

create or replace function public.profiles_block_user_safety_state_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only enforce for non-privileged roles. service_role + postgres
  -- (used by admin tooling and our SECURITY DEFINER RPCs) can update
  -- safety_state freely.
  if current_setting('request.jwt.claim.role', true) = 'authenticated'
     and old.safety_state is distinct from new.safety_state then
    raise exception 'safety_state cannot be modified by users';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_block_user_safety_state_change_trigger on public.profiles;

create trigger profiles_block_user_safety_state_change_trigger
  before update on public.profiles
  for each row
  execute function public.profiles_block_user_safety_state_change();

comment on function public.profiles_block_user_safety_state_change() is
  'Prevents authenticated users from modifying their own safety_state column. Replaces the old RLS policy of the same name which caused infinite recursion by SELECTing from profiles inside a profiles policy.';
