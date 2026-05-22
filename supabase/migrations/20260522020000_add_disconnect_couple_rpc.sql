-- Self-service partner disconnection. Removes the couples row so both
-- partners can connect to someone new. Each user keeps their own
-- profile, sessions, learnings — disconnection is purely the couple
-- link itself.
--
-- SECURITY DEFINER so we can delete the couples row regardless of which
-- side the caller is on. The auth.uid() check inside enforces that the
-- caller can only break their OWN couple, not someone else's.

create or replace function public.disconnect_couple()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  affected int;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  delete from public.couples
  where user1_id = uid or user2_id = uid;

  get diagnostics affected = row_count;
  if affected = 0 then
    raise exception 'no_couple_to_disconnect' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.disconnect_couple() from public, anon;
grant execute on function public.disconnect_couple() to authenticated;

comment on function public.disconnect_couple() is
  'User-initiated couple disconnection. Removes the couples row where the caller is either user1 or user2. Both users keep their individual profiles + sessions; only the link between them is removed. Either side can connect with a new partner afterwards.';
