# Hey Otis — Launch Readiness

**Status:**
- ✅ Apple Developer Program account: approved (you can now submit apps)
- ⏳ App not yet built for production
- ⏳ Not yet uploaded to App Store Connect
- ⏳ Not yet submitted to App Review
- ⏳ Google Play Console: separate track, not yet started

**Last updated:** 2026-04-30
**Owner:** Samantha Ahhee

> Apple Developer membership is the *door*, not the destination. The app still needs to be built, configured in App Store Connect, uploaded, reviewed, and approved before going live. This file tracks the whole journey.

---

## 1. Where things actually stand

### ✅ Done

- **App architecture & build** — React Native / Expo, builds working in dev
- **Apple Developer Program** — account approved
- **Backend** — Supabase (EU/Frankfurt), edge functions, RLS, audit logging
- **AI integration** — Claude via `claude-proxy` with rate limits + crisis short-circuit
- **Safety layer (5 layers)** — see [GUARDRAILS.md](./GUARDRAILS.md)
- **BreathingOverlay** — required by Apple, shipped
- **Typing delay + pacing**
- **Cross-session safety state** in `profiles.safety_state`
- **Red-team test suite** — 32 cases passing
- **Marketing site live** — heyotis.app
- **Research surveys live** — /research-v2, /research-sc
- **Pitch deck** — `decks/HeyOtis_Pitch_Dutch.pptx`
- **Documentation** — GUARDRAILS, CLINICAL_ADVISOR_AGREEMENT, APP_STORE_REVIEW_NOTES (the last one is what you'll paste into App Review notes when submitting)

### ⏳ Not yet done — the actual App Store path

This is the journey from "have a developer account" to "live in App Store":

1. **Configure Apple Developer account** — App ID, signing certificates, provisioning profiles
2. **Set up App Store Connect listing** — app entry, bundle ID, metadata, screenshots, age rating, privacy nutrition labels
3. **Configure EAS production build** — currently `eas.json` has an empty `"production": {}` block
4. **Build production iOS bundle** via `eas build -p ios`
5. **Upload to App Store Connect** via `eas submit -p ios`
6. **TestFlight beta** with 10–20 hand-picked users (1–2 weeks)
7. **Fix anything TestFlight surfaces**
8. **Submit for App Review**
9. **Respond to reviewer feedback** (24–48hr cycle)
10. **Get approved**
11. **Release** publicly

→ Step-by-step walkthrough: **[APP_STORE_SUBMISSION.md](./APP_STORE_SUBMISSION.md)**

---

## 2. Decisions to make this week

These shape everything that follows.

| Decision | Options | What it depends on |
|---|---|---|
| **Bundle identifier** | Keep `com.tether.app` · change to `com.heyotis.app` | Once registered with Apple, can't easily change. Decide before registering App ID. |
| **App display name** | "Hey Otis" (current) · variation | App Store visibility. "Hey Otis" is fine — the app.json already uses it. |
| **Launch type** | Soft (waitlist only) · Public (open download) · Phased rollout | How much you want to control v1 feedback before scaling |
| **Pricing model** | Free · Free with Plus tier · Subscription from day 1 | Your survey data should answer this |
| **Google Play parallel** | Submit Android in same week · Wait until iOS proves out · Skip Android v1 | Capacity to support 2 platforms |
| **Crisis-event monitoring cadence** | Founder daily · Founder + husband split · Wait until first flag | Single most important operational decision |

**My recommended defaults:**
- **Bundle ID:** change to `com.heyotis.app` for brand alignment (do this BEFORE creating the App ID)
- **Launch type:** soft launch first via TestFlight + waitlist invites, then public release after 2 weeks
- **Pricing:** free at v1, gather data before pricing
- **Google Play:** start the parallel track 2 weeks after iOS submission
- **Monitoring:** founder daily review for first 30 days, non-negotiable

---

## 3. Outstanding items — full punchlist

Ordered by **dependency** (top-down) and **urgency** (sub-grouped). Tick as you go.

### 🔴 Pre-submission (must happen before tapping "Submit for Review")

- [ ] **Sign clinical advisor** — sign [CLINICAL_ADVISOR_AGREEMENT.md](./CLINICAL_ADVISOR_AGREEMENT.md), get GUARDRAILS sign-off
- [ ] **AI lawyer review** — 1-hour memo on EU AI Act + MDR classification
- [ ] **Replace `[TBD]` placeholders** in GUARDRAILS.md Section 17 with real names
- [ ] **Privacy policy live** at heyotis.app/privacy as a public page
- [ ] **Terms of service live** at heyotis.app/terms
- [ ] **Wire safety_state read on app launch** — when `elevated_until` is in the future, surface pinned helpline + check-in (DB-write half done; read-on-launch deferred for husband review)
- [ ] **Decide bundle ID** (`com.tether.app` vs `com.heyotis.app`) and update `app.json` if changing
- [ ] **Configure EAS production build profile** — see APP_STORE_SUBMISSION.md Section 3
- [ ] **Set up App Store Connect listing** — see APP_STORE_SUBMISSION.md Section 4
- [ ] **Upload screenshots** — 6.7" iPhone (mandatory), 6.5" iPhone (mandatory), iPad if `supportsTablet=true` (currently false, so skip)
- [ ] **Privacy nutrition labels** in App Store Connect — see APP_STORE_SUBMISSION.md Section 5
- [ ] **Age rating questionnaire** — 17+ rating
- [ ] **Demo account** — create `apple-review@heyotis.app` with sample data, paste credentials into App Review Information
- [ ] **Paste APP_STORE_REVIEW_NOTES.md content** into App Review Information field

### 🟠 Build + TestFlight (week 1 of submission)

- [ ] **Run red-team test suite end-to-end** — `npx tsx src/utils/__tests__/safetyDetect.test.ts` 32/32 + manually test the 6 scenarios in APP_STORE_REVIEW_NOTES.md
- [ ] **Build production iOS bundle** — `eas build -p ios --profile production`
- [ ] **Upload to App Store Connect** — `eas submit -p ios`
- [ ] **TestFlight beta with 10–20 hand-picked users** for 1–2 weeks — close people, your therapist friend, 2–3 trusted couples
- [ ] **Crash reporting** — install Sentry (free tier, 10 minutes)
- [ ] **Customer support inbox** — `hello@heyotis.app` forwarding configured

### 🟡 During / right after review

- [ ] **Submit for review** in App Store Connect (after TestFlight feedback addressed)
- [ ] **Reviewer questions reply within 24 hours** (have App Store Connect notifications on)
- [ ] **App Store Connect "What's New" v1.0** copy
- [ ] **Daily safety event monitoring** — query `security_events` from last 24h and review

### 🟢 Post-approval, pre-public-release

- [ ] **Set release to "Manual"** in App Store Connect so you control the moment
- [ ] **Final TestFlight push** for any reviewer-feedback fixes
- [ ] **Pricing tier configured** in App Store Connect
- [ ] **Schedule launch-day comms** (Reddit, IG, Substack, waitlist email)

### 🟣 Post-launch (first 30 days)

- [ ] Daily safety event review (08:00)
- [ ] Daily review of every email/comment for first week
- [ ] Weekly: crash reports, AI cost dashboard, retention curve
- [ ] 30-day mark: clinical advisor reviews crisis flag patterns

### 📱 Google Play track (parallel — start 2 weeks after iOS submission)

- [ ] Build Android via `eas build -p android`
- [ ] Upload to Play Console Internal Testing
- [ ] Closed Testing track
- [ ] Health Apps policy declaration
- [ ] Data Safety form
- [ ] Production track submission

### 🟢 Nice-to-have (parallel, not blocking)

- [ ] Analytics — Plausible or PostHog (privacy-friendly, GDPR-clean)
- [ ] Trademark filed at boip.int (€325, 30 minutes)
- [ ] Professional indemnity insurance (~€500-1500/year)
- [ ] Crisis-flag review playbook for husband

---

## 4. The actual launch sequence

Realistic timeline from where you are today.

### Week 1 — Configure + Build

- Day 1–2: bundle-ID decision + Apple Developer + App Store Connect setup
- Day 2–3: EAS production build profile + first production build
- Day 3: upload to App Store Connect via `eas submit`
- Day 4–7: TestFlight invites to first 10 internal testers

### Week 2 — TestFlight Beta

- TestFlight feedback collection
- Crash reporting installed and working
- Privacy + ToS pages live at heyotis.app/privacy + /terms
- App Review notes pasted into App Store Connect
- Demo account verified working

### Week 3 — Submit + Review

- Submit for App Review (via App Store Connect → "Add for Review")
- 24–48hr response from Apple typical
- Respond to any reviewer questions within 24h
- Approved (or revise + resubmit)

### Week 4 — Public release

- Manual release control
- Launch-day comms posted
- Daily safety event monitoring active
- Reply to every review/comment

### Week 6 — Google Play submission

Use the same artifacts; submit to Play Console.

---

## 5. Submission file inventory

Single source of truth.

### Documentation
| Doc | Path | Purpose |
|---|---|---|
| Safety framework | [docs/GUARDRAILS.md](./GUARDRAILS.md) | Binding safety rules + 9 pillars + crisis taxonomy |
| Clinical advisor agreement | [docs/CLINICAL_ADVISOR_AGREEMENT.md](./CLINICAL_ADVISOR_AGREEMENT.md) | Template contract |
| App Store review notes | [docs/APP_STORE_REVIEW_NOTES.md](./APP_STORE_REVIEW_NOTES.md) | Paste into App Review Information field |
| **App Store submission walkthrough** | **[docs/APP_STORE_SUBMISSION.md](./APP_STORE_SUBMISSION.md)** | **Step-by-step guide for first-time submission** |
| Launch readiness (this file) | [docs/LAUNCH_README.md](./LAUNCH_README.md) | Outstanding items + sequence |
| Pre-submit checklist (legacy) | [store-assets/PRE-SUBMIT-CHECKLIST.md](../store-assets/PRE-SUBMIT-CHECKLIST.md) | Older detailed checklist |
| Strategy deck | [decks/HeyOtis_Pitch_Dutch.pptx](../decks/HeyOtis_Pitch_Dutch.pptx) | 16-slide investor / incubator deck |
| TODO (running list) | [TODO.md](../TODO.md) | Day-to-day tasks |

### Code
| Layer | Path | What it does |
|---|---|---|
| Mobile app | `app/` + `src/` | React Native / Expo |
| Marketing + research site | `website/` | Next.js, deployed to Vercel at heyotis.app |
| Edge functions | `supabase/functions/claude-proxy/` + `supabase/functions/research-export/` | Anthropic proxy + dashboard data |
| Migrations | `supabase/migrations/` | DB schema + RLS + RPCs |
| Crisis taxonomy | `src/utils/safetyDetect.ts` | 7-category pattern matcher |
| Crisis responses | `src/utils/crisisResponses.ts` | Country-aware response templates |
| Breathing overlay | `src/components/BreathingOverlay.tsx` | In-product calming UI |
| Red-team tests | `src/utils/__tests__/safetyDetect.test.ts` | 32-case test suite |

### Config
| File | Status |
|---|---|
| `app.json` | ✅ App name, bundle ID, icons configured. **Bundle ID: `com.tether.app` — decide whether to change to `com.heyotis.app` before App ID registration.** |
| `eas.json` | ⚠️ `"production": {}` block is empty — needs configuration before first production build |
| `.env / EAS Secrets` | ✅ Supabase URL, anon key, Anthropic API key configured |

### Operational endpoints
| Resource | Where |
|---|---|
| Marketing site | https://heyotis.app |
| Research surveys | /research-v2, /research-sc |
| Admin dashboards | /admin/research, /admin/research-v2 |
| Supabase project | axlarqthzbmqxzyhbrab (Tether, EU-West) |
| Apple Developer account | https://developer.apple.com |
| App Store Connect | https://appstoreconnect.apple.com (now accessible) |
| Vercel project | website (auto-deploys from main) |

---

## 6. Post-launch operations

This is where most launches fall apart. Routine matters more than ship date.

### Daily (first 30 days)
- **08:00** — read overnight safety events: `select * from security_events where severity in ('warn','error','critical') and created_at > now() - interval '24 hours' order by created_at desc`
- **09:00** — App Store reviews, support emails, IG/Reddit comments
- **17:00** — Anthropic dashboard for cost per user

### Weekly
- **Monday:** retention cohort check
- **Wednesday:** crash report review (anything affecting >1% of users)
- **Friday:** v1.1 priorities

### Monthly
- Clinical advisor review of crisis flag patterns
- Secrets hygiene audit
- Dependabot PR review

### Quarterly
- Full clinical review of GUARDRAILS.md
- Re-run + extend red-team suite
- Insurance + legal review

---

## 7. The honest one-paragraph status

You have an Apple Developer account. The product is built and the safety architecture is real. What's left is the actual **iOS submission journey** (configure → build → TestFlight → review → approve → release), which is roughly **3–4 weeks** of focused work, plus the parallel **legal/clinical sign-off** that runs alongside without blocking. None of this is hard. All of it is procedural and concrete.

---

## 8. What I'd do this week

In order:

1. **Read [APP_STORE_SUBMISSION.md](./APP_STORE_SUBMISSION.md)** end-to-end — it's the step-by-step playbook
2. **Decide on bundle ID** — `com.tether.app` (current) vs `com.heyotis.app` (preferred for brand alignment) — and update `app.json` if changing
3. **Email the clinical advisor candidate** with GUARDRAILS.md + CLINICAL_ADVISOR_AGREEMENT.md (the legal/clinical track runs in parallel and unblocks Section 17 sign-off)
4. **Email the AI lawyer** with all 3 docs and ask for the EU AI Act + MDR memo
5. **Set up App ID + signing in Apple Developer Portal** (or let EAS handle it via `eas credentials`)

Steps 1–2 unblock everything else. Steps 3–5 can run in parallel.

---

*This document is a living artifact. Update the status checkboxes as you go. When in doubt, the top of Section 8 is the next thing to do.*
