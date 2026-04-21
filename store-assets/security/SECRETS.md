# Hey Otis — Secrets Taxonomy

Every key, token, or credential the project touches, classified by who's allowed to see it and where it actually lives. This is the single source of truth — if a secret isn't in this doc, someone added it incorrectly.

> **Golden rules.**
> 1. Anything prefixed `EXPO_PUBLIC_` is **bundled into the client JS**. Anyone who downloads the app can extract it. Only put values here that are public by design.
> 2. Real secrets (Anthropic API key, Supabase service-role key) live server-side only — in Supabase Edge Function secrets or Supabase dashboard settings. They are **never** set on the client, and never committed to git.
> 3. `.env` is gitignored and contains local-dev values only. `.env.example` contains placeholders, never real values.

---

## Public by design — safe to ship in the client

| Key | Where set | Why it's OK to expose |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | `.env` (local), EAS secrets (production builds) | Project URL is public metadata. Knowing the URL grants no access. |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `.env` (local), EAS secrets (production builds) | Supabase anon JWT with `role: anon`. Access is constrained by RLS policies at the database layer — the key by itself lets you do nothing. |
| Google OAuth **Client ID** (iOS + Android + Web) | `app.json` / `google-services.json` / `GoogleService-Info.plist` | Client IDs are public. The **client secret** is held by Supabase Auth server-side and must never be in the client. |

**Verification:** you can decode any JWT at [jwt.io](https://jwt.io) — the Supabase anon key's payload must have `"role": "anon"`. If you see `"role": "service_role"` anywhere near client code, **rotate the key immediately** and move it to a server secret.

---

## Server-only — never on the client, never in git

| Key | Where it lives | How a user rotates it |
|---|---|---|
| **Anthropic API key** (`ANTHROPIC_API_KEY`) | Supabase → Edge Functions → Secrets | Anthropic Console → API keys → generate new → paste into Supabase → revoke old |
| **Supabase service-role key** | Supabase → Project Settings → API | Supabase Dashboard → Project Settings → API → "Reset service role key" |
| **Google OAuth Client Secret** | Supabase → Auth → Providers → Google | Google Cloud Console → APIs & Services → Credentials → rotate → paste into Supabase |
| **SMTP password** (when custom SMTP is enabled) | Supabase → Auth → SMTP Settings | Rotate in your SMTP provider (Resend/Postmark/SendGrid), paste into Supabase |
| **hCaptcha secret** (if CAPTCHA enabled later) | Supabase → Auth → Attack Protection → CAPTCHA | hCaptcha dashboard → regenerate → paste into Supabase |

**The Anthropic key in particular:** it is read by the `claude-proxy` Edge Function via `Deno.env.get('ANTHROPIC_API_KEY')` and injected into the `x-api-key` header of every call to Anthropic. The client never sees this key. The Edge Function's `verify_jwt: true` setting means only signed-in Hey Otis users can reach the proxy in the first place.

---

## Local development

1. Copy `.env.example` → `.env`
2. Paste your real Supabase URL + anon key into `.env` (get them from Supabase Dashboard → Project Settings → API)
3. **Do not** add an `ANTHROPIC_API_KEY` to `.env` — it won't do anything, and if you inherit an older `.env` that has one, delete the line
4. `.env` is in `.gitignore` in two places (`.env` and `.env*.local`) — it will never be committed

---

## Production builds (EAS)

For iOS / Android production builds the env vars are read from EAS secrets, not the local `.env`:

```bash
# One-time setup:
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://axlarqthzbmqxzyhbrab.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "<paste anon key>"

# To list:
eas secret:list

# To rotate:
eas secret:delete --scope project --id <secret-id>
eas secret:create --scope project --name <name> --value "<new value>"
```

---

## Web build (Vercel, for the marketing site in `marketing/`)

If the marketing subpackage is deployed to Vercel, its env vars are set in the Vercel dashboard, never committed. The marketing site does **not** need any Supabase or Anthropic keys — it's a static promotional page.

---

## Git hygiene audit (run monthly)

```bash
# Confirm .env is gitignored and never tracked
git log --all -- .env .env.local .env.production
# expected output: nothing

# Scan history for any Anthropic key that might have leaked
git log --all -p -S "sk-ant-"
# expected output: nothing

# Scan for any JWT strings in source files
grep -rE "eyJ[A-Za-z0-9_-]{10,}" src/ app/ --exclude-dir=node_modules
# expected output: nothing
```

If any of those return hits, rotate the implicated key **before** doing anything else.

---

## If a secret leaks

1. **Rotate the key immediately** at the provider (Anthropic / Supabase / Google / etc.).
2. Update the Edge Function or EAS secrets with the new value.
3. Verify the app still works with the new key.
4. **Do not** rely on `git filter-repo` or `BFG` to "remove the secret from history" — once a key is public, treat it as compromised permanently. Rewriting history is a patch, not a fix.
5. Check Supabase logs / Anthropic usage dashboard for any anomalous calls during the exposure window.

---

## Last audit

**Date:** 2026-04-21
**Scope:** full working tree + git history + deployed Edge Functions + `.env*` files
**Result:** no live secrets committed; Anthropic key correctly server-side; anon key correctly public; Edge Function tightened to not echo upstream errors.
