-- ═════════════════════════════════════════════════════════════════════════════
-- Rate-limit buckets for abuse protection
--
-- Applied to prod via Supabase MCP on 2026-04-21.
--
-- Used by the claude-proxy Edge Function (and any future rate-limited
-- endpoint) to enforce per-user request budgets. Table has NO RLS policies,
-- so it is effectively invisible to clients via PostgREST — the function
-- runs as SECURITY DEFINER and is the only way to touch it.
-- ═════════════════════════════════════════════════════════════════════════════

create table if not exists public.rate_limit_buckets (
  key          text        primary key,
  count        integer     not null default 0,
  window_start timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Enable RLS with no policies → deny all non-admin access. Only service_role
-- and SECURITY DEFINER functions can read or write.
alter table public.rate_limit_buckets enable row level security;

-- Revoke any default PostgREST access just in case.
revoke all on table public.rate_limit_buckets from public, anon, authenticated;

comment on table public.rate_limit_buckets is
  'Per-(user, window) request counters used by Edge Function rate limiting. '
  'Only accessible via check_rate_limit() RPC or service_role.';

-- ── check_rate_limit RPC ────────────────────────────────────────────────────
--
-- Atomic fixed-window rate limiter. Call with:
--   select * from check_rate_limit('claude:minute:<uid>', 20, 60);
--
-- Behaviour:
--   - If this key has never been seen: creates a bucket with count=1.
--   - If the current window has elapsed: resets to count=1, new window_start.
--   - Otherwise: increments count atomically.
--   - Returns allowed = (count <= p_limit).
--
-- Single statement upsert keeps this contention-free under concurrency.

create or replace function public.check_rate_limit(
  p_key             text,
  p_limit           integer,
  p_window_seconds  integer
)
returns table (
  allowed       boolean,
  current_count integer,
  reset_at      timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_interval interval := make_interval(secs => p_window_seconds);
  v_bucket          public.rate_limit_buckets%rowtype;
begin
  insert into public.rate_limit_buckets as b (key, count, window_start, updated_at)
    values (p_key, 1, now(), now())
  on conflict (key) do update set
    count = case
      when b.window_start < now() - v_window_interval then 1
      else b.count + 1
    end,
    window_start = case
      when b.window_start < now() - v_window_interval then now()
      else b.window_start
    end,
    updated_at = now()
  returning * into v_bucket;

  return query select
    (v_bucket.count <= p_limit),
    v_bucket.count,
    (v_bucket.window_start + v_window_interval);
end;
$$;

-- Clients MUST NOT call this directly — that would let a user reset their
-- own bucket or check arbitrary keys. It is only ever invoked server-side
-- by Edge Functions using the service_role key.
revoke all on function public.check_rate_limit(text, integer, integer)
  from public, anon, authenticated;

grant execute on function public.check_rate_limit(text, integer, integer)
  to service_role;

comment on function public.check_rate_limit(text, integer, integer) is
  'Fixed-window rate limiter. service_role only — called from Edge Functions.';

-- ── Housekeeping: prune stale buckets (run daily via pg_cron, or manually) ──

create or replace function public.prune_stale_rate_limit_buckets(
  p_max_age_seconds integer default 604800  -- 7 days
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
    delete from public.rate_limit_buckets
    where window_start < now() - make_interval(secs => p_max_age_seconds)
    returning 1
  )
  select count(*)::integer into v_deleted from del;
  return v_deleted;
end;
$$;

revoke all on function public.prune_stale_rate_limit_buckets(integer)
  from public, anon, authenticated;
grant execute on function public.prune_stale_rate_limit_buckets(integer)
  to service_role;
