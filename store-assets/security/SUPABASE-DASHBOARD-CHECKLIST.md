# Supabase Dashboard — Auth Settings Checklist

The code-side of the auth hardening is done. This checklist covers the settings you must flip in the Supabase dashboard for the code changes to take full effect. Every item here is one the app depends on — skipping any will leave a gap.

> **Project:** Hey Otis (prod)
> **Run before shipping the next release.**

---

## 🔴 Critical — must be done before the next production release

### 1. Turn on email verification

**Path:** Authentication → Providers → Email → *Confirm email*

- Toggle **Confirm email** = `ON`
- This is what makes `signUp()` return a `needsVerification` signal, which the app uses to route new users to the verify-email screen.

> ⚠️ **Migration note:** existing signed-in users who never verified will be routed to the verify-email screen on their next app open. They can use the "Resend link" button — but there may be a spike in support tickets. Post an in-app notice or email users ahead of time if the cohort is large.

### 2. Add the app's redirect URLs to the allow-list

**Path:** Authentication → URL Configuration → *Redirect URLs*

Add:

- `tether://auth/callback`
- `tether://auth/reset-password`

Remove:

- Any `http://localhost:*` entries (dev leftovers)
- Any domains that no longer belong to Hey Otis

PKCE OAuth and the password-reset email link will both fail silently if these URLs aren't on the allow-list.

### 3. Set the password policy

**Path:** Authentication → Policies → *Password requirements*

- **Minimum length:** `12`
- **Require:** lowercase, uppercase, digit, special character
- (Optional — recommended) **Check against leaked passwords:** enable the HaveIBeenPwned integration

The client-side `src/utils/passwordPolicy.ts` mirrors these rules. Keep them in sync.

### 4. Tighten rate limits

**Path:** Authentication → Rate Limits

- **`/token` (sign-in):** default is typically 30 / hour / IP — lower to **10 / hour / IP**
- **`/signup`:** 10 / hour / IP
- **`/otp`:** leave at default 30 / hour (email verification)
- **`/recover` (password reset):** 5 / hour / IP

These protect against brute force on sign-in and abuse on password-reset email sends. No code change needed — Supabase enforces at the gateway.

---

## 🟡 Strong recommendation

### 5. Enable hCaptcha on auth endpoints

**Path:** Authentication → Attack Protection → *Captcha*

- Provider: `hCaptcha` (free)
- Sign up for a site at [hcaptcha.com](https://www.hcaptcha.com), paste the site key + secret.
- Enabling this requires a small client change — Supabase docs: [Enabling CAPTCHA protection](https://supabase.com/docs/guides/auth/auth-captcha). Defer this until abuse appears in logs — the IP-level rate limits from §4 + per-user rate limits on the AI proxy (see §12 below) cover the expected threat model at launch.

### 6. Customise auth email templates

**Path:** Authentication → Email Templates

- **Confirm signup**: replace default copy with Hey Otis brand voice. Link button text: "Verify your email".
- **Reset password**: link button text: "Reset your password". Include expiry note: "This link expires in 1 hour."
- **Magic link**: not used — can be disabled.
- **Sender name:** `Hey Otis`
- **Sender email:** requires custom SMTP (see #7) or Supabase's default `noreply@mail.app.supabase.io`.

### 7. Configure custom SMTP (if not done)

**Path:** Authentication → SMTP Settings

Supabase's built-in email sender is rate-limited (~3 emails/hour) and the sender address looks suspicious. For production:

- Provider: **Resend** (easy, free tier 100/day), **Postmark**, or **SendGrid**
- Sender: `noreply@heyotis.app` or `hello@heyotis.app`
- You'll need SPF + DKIM DNS records configured on `heyotis.app`

Without this, real users will complain that "verify email" and "reset password" messages never arrive or land in spam.

### 8. Session expiry

**Path:** Authentication → Sessions

- **JWT expiry:** `3600` seconds (1 hour) — default, keep
- **Refresh token reuse interval:** `10` seconds — default, keep
- **Inactivity timeout:** consider setting to `30 days` — signs users out after 30 days of inactivity, a reasonable posture for a mental-health app

---

## 🟢 Good hygiene (can be deferred)

### 9. Enable leaked-password check

**Path:** Authentication → Policies → *Leaked password protection*

- Enable HaveIBeenPwned integration — rejects passwords that have appeared in known breaches.

### 10. Audit log retention

**Path:** Authentication → Logs

- Confirm log retention is at the Pro plan's default 7 days, or upgrade if longer audit trails are required for compliance.

### 12. AI endpoint per-user rate limits (already deployed — verify)

**Path:** Edge Functions → claude-proxy → Logs; Database → Tables → rate_limit_buckets

Not a toggle — this is enforced by the deployed `claude-proxy` Edge Function (see `supabase/functions/claude-proxy/index.ts`) and the `check_rate_limit` RPC (see `supabase/migrations/20260421130000_add_rate_limit_buckets.sql`). Current limits per user:

- **Burst:** 20 requests / minute → returns 429 with `Retry-After`
- **Daily:** 200 requests / day → returns 429, shown to user as "come back tomorrow"

**Operator actions:**
- [ ] Verify the `rate_limit_buckets` table exists and has **no** RLS policies (intentional — only service_role may touch it)
- [ ] Confirm the Edge Function has access to `SUPABASE_SERVICE_ROLE_KEY` in its env (Supabase auto-injects this — should be present by default)
- [ ] Watch the function logs for rate-limit rejections; if legitimate users are hitting limits, raise them in `supabase/functions/claude-proxy/index.ts` → `RL_*` constants and redeploy

### 11. Confirm RLS on all tables

**Path:** Database → Tables

For each table (`profiles`, `couples`, `couple_invites`, and any session tables):

- ✅ Verify RLS is **enabled** (not just policies defined — the switch must be ON)
- ✅ Verify policies are scoped by `auth.uid()`, not `true`
- ✅ The `couple_invites` table's `select` policy uses `true` (allows enumeration by code). This is acceptable because invite codes are 8-char random + expire in 7 days, but keep it on the radar.

---

## Verification after flipping switches

Once you've done #1–#4, run through these flows:

- [ ] **Sign up with a fresh email** → app routes to the verify-email screen (not `/intro`)
- [ ] **Confirm in the sent email** → next app open lands on `/intro`
- [ ] **Sign up with a weak password ("password")** → Supabase rejects server-side with a clear error
- [ ] **Attempt 11 sign-in retries in one hour from the same IP** → Supabase returns 429 after the 10th
- [ ] **Forgot password flow** → email arrives within 30s, link opens the app to reset-password screen
- [ ] **Wait 65 minutes, click the password-reset link** → rejected with "link expired"
- [ ] **Google sign-in** → skips verify-email (OAuth users are pre-verified)

---

## After you've done this

Delete this checklist from the repo (or move to a private Notion) if you don't want the hardening steps visible in a public repo. The contents are not secret but they give a clear map of what a competitor would need to exploit if anything regresses.

**Last updated:** 2026-04-19
