# Hey Otis — Pre-Submission Checklist

Every item that must be done before the first App Store and Google Play submission. Ordered by when it should happen, not by category — work top-down.

**When Samantha asks "what do I need to do before we submit?" in a future session — read this file.**

**Last updated:** 2026-04-21 (after the auth + IDOR + secrets hardening pass)

---

## Phase 1 — Things to do NOW (not blocked by anything)

- [ ] **File Benelux trademark** on "Hey Otis" at [boip.int](https://www.boip.int). €325 for 4 classes (9, 38, 42, 44). Do this first — takes 5 minutes, stops anyone grabbing the name. Details in `store-assets/funding/FUNDRAISING-PLAN.md §4.1`.
- [ ] **Buy domains**: heyotis.com, heyotis.nl, heyotis.io (~€50/yr total) on Namecheap.
- [ ] **Lock social handles** on Instagram, TikTok, X, LinkedIn, YouTube, Threads, Bluesky. Use [Namecheck.com](https://namecheck.com) to audit availability.
- [ ] **Start eHerkenning niveau 3** application at [eherkenning.nl](https://www.eherkenning.nl) — 1-2 week wait, needed for all Dutch government funding applications.

---

## Phase 2 — Supabase production setup (do ~2 weeks before submission)

The app currently uses **one Supabase project** (`Tether`, `axlarqthzbmqxzyhbrab`) for dev + prod. Before submission this must be split.

### 2.1 Create production Supabase project
- [ ] In Supabase dashboard, create new project `Hey Otis Production` (same region, eu-west-1)
- [ ] Apply the two migrations from `supabase/migrations/` in order:
  - [ ] `20260415141158_add_avatar_color_to_profiles`
  - [ ] `20260421102940_harden_invite_and_couple_policies`
- [ ] Copy the `claude-proxy` Edge Function from `supabase/functions/claude-proxy/` to the prod project and deploy

### 2.2 Dashboard settings (from `store-assets/security/SUPABASE-DASHBOARD-CHECKLIST.md`)
Do ALL of these on the PROD project, not dev:
- [ ] **Authentication → Providers → Email**: Confirm email = `ON` (critical — without this the verify-email flow doesn't fire)
- [ ] **Authentication → URL Configuration**: redirect allow-list includes `tether://auth/callback` and `tether://auth/reset-password` (remove any localhost entries)
- [ ] **Authentication → Policies → Password**: min length `12`, require letter + number + symbol
- [ ] **Authentication → Rate Limits**: `/token` 10/hr, `/signup` 10/hr, `/recover` 5/hr
- [ ] **Authentication → Email Templates**: branded "Confirm signup" and "Reset password" emails written
- [ ] **Authentication → SMTP**: custom SMTP configured (Resend/Postmark recommended) with `noreply@heyotis.app` as sender — requires SPF + DKIM DNS records on heyotis.app
- [ ] **Edge Functions → claude-proxy → Secrets**: add `ANTHROPIC_API_KEY` pointing at a NEW production Anthropic key (not the dev one)

### 2.3 Set up Google OAuth for prod
- [ ] Create new OAuth client in Google Cloud Console for the prod bundle IDs
- [ ] Paste client ID + secret into Supabase → Auth → Providers → Google on the prod project

---

## Phase 3 — EAS build setup (do ~1 week before submission)

- [ ] Run `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "<PROD URL>"`
- [ ] Run `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "<PROD ANON KEY>"`
- [ ] Confirm `eas.json` has a `production` profile referencing these secrets
- [ ] Run `eas build --platform ios --profile production` (first iOS build, 20-30 min)
- [ ] Run `eas build --platform android --profile production` (first Android build)
- [ ] Download + install the iOS build via TestFlight on a real device; run through: sign-up → verify email → onboarding → session → sign-out → forgot password → reset. Every flow end-to-end.
- [ ] Same smoke test on an Android device

---

## Phase 4 — Code completeness

- [ ] Fix the remaining pre-existing TypeScript errors flagged during the auth refactor (not from my changes, but they should be clean before submission):
  - `app/(tabs)/learnings.tsx:259,339` — `avatar_color` missing on partner profile type
  - `app/(tabs)/sessions.tsx:1318` — duplicate object key
  - `app/intro.tsx:74` — LinearGradient color prop type
- [ ] Run `npx tsc --noEmit` → must be zero errors
- [ ] Grep for `TODO`, `FIXME`, `XXX` and resolve or silence each
- [ ] Grep for `console.log` and remove any that would leak user data or run in production
- [ ] Remove any dev-only routes (`signInAsGuest` is already gone — confirm no equivalents)
- [ ] Verify `app.json` version + build numbers are bumped
- [ ] Confirm `expo-dev-client` is only a dev dependency, not production
- [ ] Cold-start the app 10 times; no crashes, no hung splash screens

---

## Phase 5 — Apple App Store (iOS)

See `store-assets/app-store/README.md` for the asset list.

### Prerequisites
- [ ] Apple Developer Program membership ($99/yr) **active** — enrollment takes 1-2 days
- [ ] App Store Connect app record created under the correct team ID
- [ ] Bundle identifier reserved (e.g. `app.heyotis.mobile`)

### Assets required
- [ ] **App icon** 1024×1024 PNG, no transparency, no rounded corners
- [ ] **Screenshots (iPhone 6.7")**: 1290×2796, minimum 2, recommend 6-8
- [ ] **Screenshots (iPhone 6.5")**: 1284×2778, minimum 2
- [ ] Copy for all screenshots — already drafted in `store-assets/SCREENSHOT-COPY.md`
- [ ] **App preview video** (optional but recommended): 15-30s, 1290×2796 or 886×1920

### Text content (from `store-assets/app-store/README.md`)
- [ ] App name (≤30 chars) — "Hey Otis"
- [ ] Subtitle (≤30 chars) — "Navigate together, grow closer"
- [ ] Description (≤4000 chars) — drafted in README
- [ ] Keywords (≤100 chars, comma-separated) — drafted
- [ ] Promotional text (≤170 chars)
- [ ] Category: Health & Fitness (primary), Lifestyle (secondary)
- [ ] Age rating questionnaire completed → likely 17+

### Legal / URL
- [ ] Privacy policy live at `https://heyotis.app/privacy` and reachable publicly
- [ ] Support URL (`https://heyotis.app` or `https://heyotis.app/support`)
- [ ] Contact email (`privacy@heyotis.app`) actually receives mail — test it

### Submission
- [ ] Upload production iOS build via EAS Submit or manually
- [ ] Fill in App Review notes (test account credentials + special instructions)
- [ ] Submit for review — typically 24-48 hours to first response

---

## Phase 6 — Google Play Store (Android)

See `store-assets/google-play/README.md` for the asset list.

### Prerequisites
- [ ] Google Play Developer account ($25 one-time) active — Samantha has already started this
- [ ] Play Console app record created
- [ ] Package name reserved

### Assets required
- [ ] **App icon** 512×512 PNG with alpha
- [ ] **Feature graphic** 1024×500 (header banner on store listing) — brief in `SCREENSHOT-COPY.md`
- [ ] **Screenshots (phone)**: 1080×1920, minimum 2, recommend 6-8
- [ ] Promo video (optional) — YouTube URL only

### Text content
- [ ] App name (≤30 chars) — "Hey Otis"
- [ ] Short description (≤80 chars) — "Navigate conflict together. From rupture to repair, guided by science."
- [ ] Full description (≤4000 chars)
- [ ] Category: Health & Fitness
- [ ] 5 tags

### Compliance
- [ ] **Data Safety form** completed (what data you collect, how it's used, whether it's shared). Maps directly to your privacy policy.
- [ ] **Content rating questionnaire** completed → likely Mature 17+
- [ ] **Target audience** declaration (18+)
- [ ] Privacy policy URL matches Apple submission

### Submission
- [ ] Upload AAB file to Play Console
- [ ] Configure country distribution (English-first markets initially)
- [ ] Set pricing model (Free for launch; subscription tier comes later)
- [ ] Submit for review — typically 1-7 days

---

## Phase 7 — Business / legal

- [ ] Holding BV + Operating BV structure set up via notary (~€1,000) if planning to raise funding
- [ ] KVK (Chamber of Commerce) registration: €82 one-time
- [ ] Business bank account (needed for App Store / Play Store payments) — Wise Business / bunq both work
- [ ] App Store Small Business Program enrollment (15% fee vs 30% under $1M revenue) — do this BEFORE first sale
- [ ] Tax info (VAT number, W-8BEN-E for Apple) entered in both consoles

---

## Phase 8 — Post-submission

Once both stores are live:
- [ ] Clear the Supabase dev project's test data
- [ ] Monitor Supabase logs for first 48 hours (any RLS denials, auth errors, Edge Function errors)
- [ ] Monitor Anthropic API usage dashboard — confirm spend is within expected per-user envelope
- [ ] Monitor App Store Connect / Play Console for crash reports
- [ ] Respond to any reviewer questions within 24 hours

---

## The "do not ship without" list (condensed)

If you only have one afternoon to check everything, these are the show-stoppers:

1. **Two Supabase projects** (dev + prod) with prod having all dashboard security settings from §2.2 — otherwise email verification / password reset / rate limits don't work
2. **Custom SMTP configured** on prod — otherwise verify-email and reset-password emails don't deliver to real users
3. **Trademark filed** — otherwise a squatter can grab the name
4. **Privacy policy live** at heyotis.app/privacy — otherwise both stores auto-reject
5. **`npx tsc --noEmit` clean** — otherwise surprise runtime bugs under real traffic
6. **End-to-end smoke test on a real iOS + Android device** — otherwise you don't know if anything actually works

Everything else is polish, monetisation, or post-launch.
