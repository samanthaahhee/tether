-- ═════════════════════════════════════════════════════════════════════════════
-- Data minimisation + retention
--
-- Applied to prod via Supabase MCP on 2026-04-21.
--
-- Three things in one migration:
--   1. Minimisation — hash client IPs before they're written to security_events.
--      The raw IP reveals identity / geolocation; the HMAC is sufficient to
--      count "how many attempts from the same origin" without exposing it.
--   2. Retention — schedule existing prune_* functions via pg_cron so data
--      auto-ages-out instead of accumulating. Adds prune_stale_invites().
--   3. Deliberately NOT doing: column-level encryption of profiles.context.
--      The real sensitive user data (vent messages) is currently client-local,
--      not in the DB. When (if) session content moves server-side, that's
--      when column encryption infrastructure gets installed — applied to the
--      sensitive fields from day 1 rather than retrofitted to a single
--      onboarding field today.
-- ═════════════════════════════════════════════════════════════════════════════

-- ── 1. IP hashing infrastructure ────────────────────────────────────────────

do $$
declare
  v_existing uuid;
begin
  select id into v_existing from vault.secrets where name = 'ip_hmac_secret';
  if v_existing is null then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'ip_hmac_secret',
      'HMAC key for hashing client IPs before storing in security_events. Never rotate without planning a hash gap.'
    );
  end if;
end $$;

create or replace function public.hash_ip(p_ip text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_secret text;
begin
  if p_ip is null or p_ip = '' then return null; end if;

  select decrypted_secret into v_secret
    from vault.decrypted_secrets
   where name = 'ip_hmac_secret'
   limit 1;

  if v_secret is null then
    raise warning 'hash_ip: ip_hmac_secret not found in vault';
    return null;
  end if;

  return encode(extensions.hmac(p_ip, v_secret, 'sha256'), 'hex');
end;
$$;

revoke all on function public.hash_ip(text) from public, anon, authenticated;
grant execute on function public.hash_ip(text) to service_role;

comment on function public.hash_ip(text) is
  'HMAC-SHA256 hash of a client IP using a Vault-stored secret. '
  'service_role only. Returns null for null/empty input or missing secret.';

-- ── 2. Add prune_stale_invites — drop used/expired invites > 30 days old ────

create or replace function public.prune_stale_invites(
  p_max_age_days integer default 30
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
    delete from public.couple_invites
     where (used = true or expires_at < now())
       and coalesce(created_at, now()) < now() - make_interval(days => p_max_age_days)
    returning 1
  )
  select count(*)::integer into v_deleted from del;
  return v_deleted;
end;
$$;

revoke all on function public.prune_stale_invites(integer)
  from public, anon, authenticated;
grant execute on function public.prune_stale_invites(integer) to service_role;

comment on function public.prune_stale_invites(integer) is
  'Delete used or expired invites older than p_max_age_days. service_role only.';

-- ── 3. Enable pg_cron and schedule the three retention jobs ─────────────────

create extension if not exists pg_cron with schema extensions;

do $$
declare
  job_name text;
begin
  for job_name in
    select jobname from cron.job
     where jobname in ('hey-otis-prune-security-events',
                       'hey-otis-prune-rate-limit-buckets',
                       'hey-otis-prune-stale-invites')
  loop
    perform cron.unschedule(job_name);
  end loop;
end $$;

select cron.schedule(
  'hey-otis-prune-security-events',
  '15 3 * * *',
  $cmd$ select public.prune_old_security_events(90); $cmd$
);

select cron.schedule(
  'hey-otis-prune-rate-limit-buckets',
  '30 3 * * *',
  $cmd$ select public.prune_stale_rate_limit_buckets(604800); $cmd$
);

select cron.schedule(
  'hey-otis-prune-stale-invites',
  '45 3 * * *',
  $cmd$ select public.prune_stale_invites(30); $cmd$
);
