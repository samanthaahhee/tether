-- ═════════════════════════════════════════════════════════════════════════════
-- Security event log — append-only audit trail for application-level events
--
-- Applied to prod via Supabase MCP on 2026-04-21.
--
-- Supabase already captures auth events (sign-in, sign-up, reset, etc.) in its
-- internal auth logs. This table is for events the platform does NOT capture:
--   - Rate-limit rejections from our Edge Functions
--   - Unauthorized requests that made it past JWT verification (edge case)
--   - Upstream errors from third-party APIs (Anthropic, etc.)
--   - Any future suspicious-pattern signals we choose to emit
--
-- RLS is enabled with zero policies → invisible to all clients. Only
-- service_role and SECURITY DEFINER functions can read/write.
-- ═════════════════════════════════════════════════════════════════════════════

create table if not exists public.security_events (
  id          bigserial   primary key,
  created_at  timestamptz not null default now(),
  event_type  text        not null,
  severity    text        not null default 'info'
              check (severity in ('info','warn','error','critical')),
  user_id     uuid        null,
  source      text        not null default 'server',
  details     jsonb       not null default '{}'::jsonb
);

create index if not exists security_events_created_at_idx
  on public.security_events (created_at desc);
create index if not exists security_events_event_type_idx
  on public.security_events (event_type, created_at desc);
create index if not exists security_events_user_id_idx
  on public.security_events (user_id, created_at desc)
  where user_id is not null;

alter table public.security_events enable row level security;
revoke all on table public.security_events from public, anon, authenticated;

comment on table public.security_events is
  'Append-only audit trail for application-level security events. '
  'Populated by Edge Functions + SECURITY DEFINER RPCs. '
  'Invisible to clients via PostgREST.';

create or replace function public.log_security_event(
  p_event_type text,
  p_severity   text default 'info',
  p_user_id    uuid default null,
  p_source     text default 'server',
  p_details    jsonb default '{}'::jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
begin
  insert into public.security_events (event_type, severity, user_id, source, details)
    values (p_event_type, p_severity, p_user_id, p_source, p_details)
    returning id into v_id;
  return v_id;
exception when others then
  raise warning 'log_security_event failed: %', sqlerrm;
  return -1;
end;
$$;

revoke all on function public.log_security_event(text, text, uuid, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.log_security_event(text, text, uuid, text, jsonb)
  to service_role;

comment on function public.log_security_event(text, text, uuid, text, jsonb) is
  'Append a row to security_events. service_role only.';

create or replace view public.recent_security_events as
  select
    created_at,
    severity,
    event_type,
    source,
    user_id,
    details
  from public.security_events
  where created_at > now() - interval '7 days'
  order by created_at desc;

revoke all on public.recent_security_events from public, anon, authenticated;
grant select on public.recent_security_events to service_role;

comment on view public.recent_security_events is
  'Last 7 days of security events. service_role only.';

create or replace function public.prune_old_security_events(
  p_max_age_days integer default 90
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  with del as (
    delete from public.security_events
    where created_at < now() - make_interval(days => p_max_age_days)
    returning 1
  )
  select count(*)::integer into v_deleted from del;
  return v_deleted;
end;
$$;

revoke all on function public.prune_old_security_events(integer)
  from public, anon, authenticated;
grant execute on function public.prune_old_security_events(integer) to service_role;
