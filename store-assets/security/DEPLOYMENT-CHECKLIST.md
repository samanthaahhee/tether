# Hey Otis — Secure Deployment Checklist

Every network, secret, and observability control you need in place before the app is exposed to real users. Companion to [`SUPABASE-DASHBOARD-CHECKLIST.md`](SUPABASE-DASHBOARD-CHECKLIST.md) (auth settings) and [`SECRETS.md`](SECRETS.md) (key taxonomy).

**Last updated:** 2026-04-21

---

## 1. HTTPS / TLS posture

All network traffic Hey Otis touches is already HTTPS-only by construction. There are no toggles to flip — this section is documentation so reviewers can see the stance.

| Surface | TLS enforced by | Evidence |
|---|---|---|
| Mobile app → Supabase REST/GraphQL | Supabase platform + iOS ATS + Android Network Security Config (enforced by default in Expo builds) | `src/lib/supabase.ts` uses `https://…supabase.co`; ATS in `app.json` has no exceptions |
| Mobile app → claude-proxy Edge Function | Supabase platform (Deno Deploy, TLS 1.3) | `useClaude.ts` points at `https://<ref>.supabase.co/functions/v1/claude-proxy` |
| Edge Function → Anthropic | `https://api.anthropic.com` | `supabase/functions/claude-proxy/index.ts` line 19 |
| Supabase dashboard / admin | Supabase-enforced HTTPS | n/a |
| Marketing site (heyotis.app) | Automatic via Vercel / Cloudflare (platform-managed certs) | Set `HSTS` in Vercel project settings when the domain is live |

**Operator action:** none at the app layer. When the marketing site goes live at `heyotis.app`:

- [ ] Verify HTTPS is enforced (auto on Vercel) and HSTS header is set with `max-age=31536000; includeSubDomains; preload`
- [ ] Submit `heyotis.app` to the [HSTS preload list](https://hstspreload.org) once confirmed

---

## 2. Secrets storage (summary; detail in [SECRETS.md](SECRETS.md))

| Secret | Where | Client-exposed? |
|---|---|---|
| Supabase `service_role` key | Supabase dashboard + auto-injected into Edge Function env | ❌ Never |
| Anthropic API key | `Deno.env.get('ANTHROPIC_API_KEY')` in claude-proxy | ❌ Never |
| Google OAuth client secret | Supabase → Auth → Providers → Google | ❌ Never |
| SMTP password (when configured) | Supabase → Auth → SMTP | ❌ Never |
| Supabase URL + anon JWT | `EXPO_PUBLIC_*` → client bundle | ✅ Public by design (anon role + RLS enforces access) |
| Google OAuth client ID | `app.json` / `google-services.json` | ✅ Public by design |

**Verification:** `git log --all -p -S "sk-ant-"` returns nothing; `git log --all -p -S "service_role"` returns nothing.

---

## 3. Database network restrictions

Two different surfaces — both matter:

### 3a. PostgREST / GraphQL endpoint (must stay public)

`https://<ref>.supabase.co/rest/v1/*` is intentionally public. The app talks to it. Security comes from:

- JWT verification on every request
- Row-level security policies on every table
- The rate-limit surface defined in `SUPABASE-DASHBOARD-CHECKLIST.md §4`

**Do not attempt to IP-restrict this endpoint.** Doing so breaks the mobile app entirely — user IPs are unbounded.

### 3b. Raw Postgres port 5432 (restrict NOW)

This is the direct database connection — used for migrations, psql, and admin tools. Exposing it publicly was the source of several high-profile breaches in 2024–2025.

- [ ] **Supabase dashboard → Project Settings → Database → Network Restrictions**
  - Enable the allow-list
  - Add only:
    - Your home/office IP (one entry per machine you use)
    - Your CI/CD runner's egress IP (if you use GitHub Actions with Supabase, use its documented IP range)
  - After enabling, confirm `psql postgres://...supabase.co:5432/postgres` fails from an unlisted IP
- [ ] If you use the Supabase SQL editor, it connects via the service role over HTTPS — unaffected

> Free tier: network restrictions may require the Pro plan depending on your project's age. Check the dashboard. If unavailable, rotate the database password often (quarterly) and never share it.

---

## 4. Roles & permissions hygiene

- [ ] Confirm no table grants `all` to `public`, `anon`, or `authenticated` — only the explicit columns/operations you intend
  ```sql
  select grantee, table_name, privilege_type
    from information_schema.role_table_grants
   where table_schema = 'public'
     and grantee in ('anon','authenticated','public');
  ```
  Expected output: only SELECT/INSERT/UPDATE/DELETE on tables that your RLS policies explicitly gate. If you see `public` as a grantee anywhere, revoke it.

- [ ] Confirm no SECURITY DEFINER function is executable by `public`:
  ```sql
  select p.proname, r.rolname
    from pg_proc p
    join pg_roles r on true
   where pronamespace = 'public'::regnamespace
     and has_function_privilege(r.oid, p.oid, 'EXECUTE')
     and r.rolname in ('public','anon','authenticated')
     and p.prosecdef;
  ```
  Current SECURITY DEFINER functions: `accept_invite` (authenticated only — correct), `check_rate_limit` (service_role only), `log_security_event` (service_role only), `prune_*` (service_role only). Nothing should leak to `public`.

---

## 5. Logging & observability

Three layers of telemetry cover the observable surface:

### 5a. Supabase native logs (platform-managed)

Already capturing all of these — nothing to configure:

| Log | Dashboard path | Retention |
|---|---|---|
| Auth events (sign-in / sign-up / reset / verify) | Logs → Auth Logs | Free: 1 day · Pro: 7 days · Team: 28 days |
| Postgres queries + errors | Logs → Postgres Logs | Same as above |
| Edge Function invocations (stdout / stderr) | Edge Functions → claude-proxy → Logs | Same as above |
| API Gateway (PostgREST) | Logs → API Gateway | Same as above |
| Storage access | Logs → Storage | Same as above |

- [ ] **Upgrade to Supabase Pro before launch** for 7-day log retention — the Free-tier 1-day window is too short for incident response
- [ ] Familiarise yourself with each log view (dashboard → Logs)

### 5b. Application-level security log (this session — now deployed)

`public.security_events` — appended by our own Edge Functions for events Supabase doesn't capture:

| Event type | Severity | Emitted when |
|---|---|---|
| `auth.missing_bearer` | warn | claude-proxy hit with no `Authorization` header |
| `auth.invalid_jwt` | warn | JWT failed verification |
| `rate_limit.burst` | warn | 20 requests/min exceeded for a user |
| `rate_limit.daily` | warn | 200 requests/day exceeded for a user |
| `rate_limit.rpc_error` | error | `check_rate_limit` RPC itself failed |
| `rate_limit.exception` | error | Unexpected exception in rate-limit path |
| `upstream.non_2xx` | warn/error | Anthropic returned a non-2xx status |
| `upstream.exception` | error | Fetch to Anthropic threw |

### 5c. Query recipes

Run these in Supabase SQL editor (which has service_role context) for ad-hoc monitoring:

```sql
-- Last 7 days of security events, newest first
select * from public.recent_security_events;

-- Rate-limit hits by user in the last 24 hours
select user_id, event_type, count(*) as hits, max(created_at) as last_seen
  from public.security_events
 where created_at > now() - interval '24 hours'
   and event_type like 'rate_limit.%'
 group by user_id, event_type
 order by hits desc
 limit 20;

-- Upstream Anthropic errors in the last hour (early-warning for service issues)
select * from public.security_events
 where created_at > now() - interval '1 hour'
   and event_type like 'upstream.%'
 order by created_at desc;

-- Anonymous callers probing the Edge Function
select count(*) as attempts, details->>'ip' as ip
  from public.security_events
 where event_type in ('auth.missing_bearer','auth.invalid_jwt')
   and created_at > now() - interval '1 hour'
 group by details->>'ip'
 order by attempts desc
 limit 20;
```

### 5d. Alerting (optional for v1)

Two realistic paths when launch traffic justifies alerts:

1. **pg_cron + email** — a scheduled SQL job that emails you if any of the above queries return suspicious counts. Supabase has a simple `pg_net` integration for HTTP webhooks. Example:
   ```sql
   select cron.schedule('security-hourly', '0 * * * *', $$
     select pg_notify('security_alerts', row_to_json(r)::text)
       from (
         select 'burst_spike' as alert, count(*) as count
           from security_events
          where event_type = 'rate_limit.burst'
            and created_at > now() - interval '1 hour'
         having count(*) > 50
       ) r;
   $$);
   ```
2. **Log drain to a SIEM** (Datadog, Better Stack, Axiom) — Supabase Pro+ supports log drains. Set up only if you're getting real traffic volume.

**At launch:** neither is required. Query the view manually once a day for the first 2 weeks. If you see patterns, automate then.

---

## 6. Abuse-response runbook

When the monitoring above surfaces something, here's the default response:

| Signal | Immediate action |
|---|---|
| Single user hitting daily limit for 3+ days | Not abuse — engaged power user. Consider raising `RL_DAILY_LIMIT` |
| Single IP spamming `auth.missing_bearer` | Not a threat (no valid sessions) but note the IP; enable hCaptcha (`SUPABASE-DASHBOARD-CHECKLIST.md §5`) if it persists |
| Sudden spike in `rate_limit.burst` across many users | Likely viral growth or a bug — check Anthropic status + front-end retry logic |
| Sustained `upstream.non_2xx` with status 401 | Anthropic API key has been revoked / rotated upstream — rotate in Edge Function secrets immediately |
| Sustained `upstream.non_2xx` with status 429 | You've hit Anthropic's own rate limits. Throttle new-user onboarding or request a quota increase |
| `rate_limit.rpc_error` | The rate-limit RPC is broken — check the migration applied cleanly; Edge Function fails closed, so service will return 503 until fixed |

---

## 7. Final pre-production verification

Ten minutes, end-to-end, on the prod project:

- [ ] `curl -X POST https://<ref>.supabase.co/functions/v1/claude-proxy -H 'Content-Type: application/json' -d '{}'` returns 401 (no JWT)
- [ ] Same request with an expired JWT: returns 401, `security_events` has a row with `event_type = 'auth.invalid_jwt'`
- [ ] Same request with a valid JWT and 25 bodies in quick succession: the 21st returns 429 with `Retry-After` header, `security_events` has `rate_limit.burst`
- [ ] `select count(*) from security_events` is queryable from SQL editor; returns nothing when called from a signed-in client via `supabase.from('security_events').select('*')` (RLS blocks it)
- [ ] `psql "postgres://postgres:<password>@db.<ref>.supabase.co:5432/postgres"` from an unlisted IP fails with connection refused (if network restrictions are enabled)
- [ ] iOS app loads over ATS without `NSExceptionDomains` exceptions in `app.json`
