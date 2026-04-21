# Hey Otis — TODO

A single flat list of what to do next, in priority order. Tick the box on the left as you go. Detail docs are linked where needed.

**Last updated:** 2026-04-21

---

## 🔴 This week — non-blocking foundations

These cost under €500 and take under 4 hours combined. Do them while other things are in motion.

- [ ] **File Benelux trademark** on "Hey Otis" (word + mascot) at [boip.int](https://www.boip.int) · ~€325 · 30 min · [why](store-assets/funding/FUNDRAISING-PLAN.md#41-trademark--file-this-week)
- [ ] **Buy domains**: heyotis.com, heyotis.nl, heyotis.io · ~€50/yr · 10 min
- [ ] **Lock social handles** @heyotis on IG, TikTok, X, LinkedIn, YouTube, Threads, Bluesky · use [namecheck.com](https://namecheck.com) · 20 min
- [ ] **Start eHerkenning niveau 3** at [eherkenning.nl](https://www.eherkenning.nl) · 10 min (then 1–2 week wait) · required for all Dutch funding applications

---

## 🟡 This month — funding foundations

These unlock €200–400k+ of non-dilutive money. Each takes a few hours of focused work.

- [ ] **Set up Holding BV + Operating BV** via notary (only if raising equity soon) · ~€1,000 · [why](store-assets/funding/FUNDRAISING-PLAN.md#51-entity-structure)
- [ ] **Submit WBSO application** via mijn.rvo.nl (once eHerkenning arrives) · returns ~€20k+/yr in payroll tax credit · [how](store-assets/funding/FUNDRAISING-PLAN.md#21-wbso--rd-tax-credit-do-this-monday)
- [ ] **Request VFF positive-advice letter** from Invest-NL or regional ROM · free · 2-4 wk wait
- [ ] **Submit VFF application** after positive advice · up to €350k success-based loan · [how](store-assets/funding/FUNDRAISING-PLAN.md#22-vroegefasefinanciering-vff--pre-revenue-loan)
- [ ] **Check MIT Feasibility window** on your province's RVO page · up to €20k
- [ ] **Apply to Antler Amsterdam** autumn 2026 cohort at [antler.co/location/amsterdam](https://www.antler.co/location/amsterdam)
- [ ] **Apply to Rockstart** (Impact or AI & Emerging Tech track)
- [ ] **Apply to TechLeap Rise** at [techleap.nl/programmes/rise](https://www.techleap.nl/programmes/rise) · free · unlocks Dutch angel network

---

## 🟢 Product + app readiness (ongoing)

- [ ] **Fix pre-existing TypeScript errors** (not from the security pass, predate it):
  - [ ] `app/(tabs)/learnings.tsx:259,339` — `avatar_color` missing on partner profile type
  - [ ] `app/(tabs)/sessions.tsx:1318` — duplicate object key
  - [ ] `app/intro.tsx:74` — LinearGradient color prop type
- [ ] **Sweep TODO/FIXME comments** — `grep -rn "TODO\|FIXME" src/ app/`
- [ ] **Bump app.json version + build numbers** before first real build
- [ ] **Run a 10× cold-start stress test** — no crashes, no hung splash

---

## 🔵 Supabase production setup (~2 weeks before App Store submission)

- [ ] **Create second Supabase project** `Hey Otis Production`, same region
- [ ] **Apply migrations** from `supabase/migrations/` in order
- [ ] **Deploy `claude-proxy` Edge Function** (source in `supabase/functions/claude-proxy/`)
- [ ] **Flip all dashboard security settings** from [SUPABASE-DASHBOARD-CHECKLIST.md](store-assets/security/SUPABASE-DASHBOARD-CHECKLIST.md):
  - [ ] Confirm email = ON
  - [ ] Redirect URLs: `tether://auth/callback` + `tether://auth/reset-password`
  - [ ] Password policy: min 12, letter+number+symbol
  - [ ] Rate limits: /token 10/hr, /signup 10/hr, /recover 5/hr
- [ ] **Configure custom SMTP** (Resend / Postmark) with `noreply@heyotis.app` + SPF/DKIM DNS records
- [ ] **Set up production Google OAuth** in Google Cloud Console, paste client ID + secret into Supabase → Auth → Providers
- [ ] **Add `ANTHROPIC_API_KEY`** as Edge Function secret (new prod key, not dev)

---

## 🟣 EAS build + store submission (~1 week before launch)

- [ ] **Create EAS secrets** for prod keys: `eas secret:create` for `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **Configure `eas.json` production profile**
- [ ] **Run `eas build --platform ios --profile production`**
- [ ] **Run `eas build --platform android --profile production`**
- [ ] **Full device smoke test** on real iOS + Android: sign-up → verify email → onboarding → session → sign-out → forgot password → reset
- [ ] **Enroll in Apple Developer Program** ($99/yr) if not already
- [ ] **Enroll in Google Play Developer** ($25 one-time) if not already
- [ ] **Enroll in App Store Small Business Program** (15% vs 30% under $1M) — do BEFORE first sale
- [ ] **Create app records** in App Store Connect + Play Console

---

## ⚫ Store assets (can be done in parallel with above)

All headlines + copy are already drafted in `store-assets/SCREENSHOT-COPY.md`. What's left is producing the images.

- [ ] **App icon** 1024×1024 PNG, no transparency (iOS) and 512×512 (Android)
- [ ] **Feature graphic** 1024×500 (Google Play)
- [ ] **iPhone 6.7" screenshots** 1290×2796 · 6–8 images · copy is done
- [ ] **iPhone 6.5" screenshots** 1284×2778 · 6–8 images
- [ ] **Android phone screenshots** 1080×1920 · 6–8 images
- [ ] **App description + keywords** copy-paste from `store-assets/app-store/README.md` + `store-assets/google-play/README.md`
- [ ] **Privacy policy published** at `https://heyotis.app/privacy` (content is ready in `app/privacy.tsx` — needs a static version at that URL)
- [ ] **Complete Data Safety form** (Google) and **age rating questionnaire** (Apple)

---

## ⚪ Submission + launch day

- [ ] **Submit iOS build** via App Store Connect · reviewer usually responds in 24–48 hrs
- [ ] **Submit Android build** via Play Console · reviewer usually responds in 1–7 days
- [ ] **Respond to reviewer questions within 24 hrs**
- [ ] **Clear Supabase dev project's test data** the day before launch
- [ ] **Monitor for 48 hrs post-launch**: Supabase logs, Anthropic spend, App Store / Play crash reports

---

## Rules for using this list

- **The top of the list is always next.** If an item is blocked, skip it and pick the next one — don't let one blocker stop everything.
- **Tick the box inline and commit** (`git commit -am "✓ filed trademark"`) so the list reflects real state.
- When you finish a whole section, move the done items to a `## ✅ Done` block at the bottom so the live list stays short.
- When a new session asks "what's next?" — the top unchecked item is the answer.

---

## Reference docs (don't scan these daily, link in as needed)

| Need | Doc |
|---|---|
| Full detail on pre-launch steps | [store-assets/PRE-SUBMIT-CHECKLIST.md](store-assets/PRE-SUBMIT-CHECKLIST.md) |
| Raising money in NL | [store-assets/funding/FUNDRAISING-PLAN.md](store-assets/funding/FUNDRAISING-PLAN.md) |
| What fundraising even means | [store-assets/funding/FUNDRAISING-EXPLAINED.md](store-assets/funding/FUNDRAISING-EXPLAINED.md) |
| Supabase dashboard settings | [store-assets/security/SUPABASE-DASHBOARD-CHECKLIST.md](store-assets/security/SUPABASE-DASHBOARD-CHECKLIST.md) |
| Which secrets live where | [store-assets/security/SECRETS.md](store-assets/security/SECRETS.md) |
| Store screenshot copy | [store-assets/SCREENSHOT-COPY.md](store-assets/SCREENSHOT-COPY.md) |
| Pre-launch infra costs | [store-assets/PRE-LAUNCH-COSTS.md](store-assets/PRE-LAUNCH-COSTS.md) |
| Strategy deck | [store-assets/deck/HeyOtis-Strategy-Deck.pptx](store-assets/deck/HeyOtis-Strategy-Deck.pptx) |

---

## ✅ Done

*(move completed sections here — keep the top clean)*
