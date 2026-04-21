-- ═════════════════════════════════════════════════════════════════════════════
-- Auto-hash any `ip` field in security_events.details
--
-- Applied to prod via Supabase MCP on 2026-04-21.
--
-- Moves the IP-hashing decision from "whoever calls log_security_event has to
-- remember to call hash_ip first" to "log_security_event does it for them,
-- always". Prevents accidental plaintext IP storage in future callers.
-- ═════════════════════════════════════════════════════════════════════════════

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
  v_id         bigint;
  v_details    jsonb := coalesce(p_details, '{}'::jsonb);
  v_raw_ip     text;
  v_hashed_ip  text;
begin
  -- If caller passed a plaintext `ip`, replace it with the hashed version.
  -- Callers SHOULD already be passing hashed IPs, but this belt-and-braces
  -- step guarantees no plaintext IPs leak into the audit log.
  v_raw_ip := v_details->>'ip';
  if v_raw_ip is not null and v_raw_ip != '' then
    v_hashed_ip := public.hash_ip(v_raw_ip);
    v_details := (v_details - 'ip') || jsonb_build_object('ip_hash', v_hashed_ip);
  end if;

  insert into public.security_events (event_type, severity, user_id, source, details)
    values (p_event_type, p_severity, p_user_id, p_source, v_details)
    returning id into v_id;
  return v_id;
exception when others then
  raise warning 'log_security_event failed: %', sqlerrm;
  return -1;
end;
$$;

-- (GRANT/REVOKE already set on the prior version; no change needed here.)
