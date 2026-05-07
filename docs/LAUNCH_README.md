# Hey Otis — Launch Readiness

**Status:** ✅ Apple App Store: Approved (awaiting release) · ⏳ Google Play Store: not yet submitted
**Last updated:** 2026-04-30
**Owner:** Samantha Ahhee

> Apple approved on first submission. This is the consolidated launch-readiness file: what's done, what's left, and the actual sequence to go live.

---

## 1. Where we are right now

### ✅ Done (the hard parts)

- **App architecture & build** — React Native / Expo, iOS build approved by Apple App Review
- **Backend** — Supabase (EU/Frankfurt), edge functions, RLS, audit logging
- **AI integration** — Claude via `claude-proxy` edge function with rate limits + crisis short-circuit
- **Safety layer (5 layers)** — input pre-filter, system prompt enforcement, output filter, crisis dispatcher with 21-country helplines, audit logging — see [GUARDRAILS.md](./GUARDRAILS.md)
- **Crisis safety state** — cross-session via `profiles.safety_state` jsonb + `record_safety_event` SECURITY DEFINER RPC (Pillar 9)
- **BreathingOverlay** — inline 60-second box breathing + 5-4-3-2-1 grounding, always available in chat header (Apple required this and we shipped it)
- **Typing delay + pacing** — emotional pacing for AI responses
- **Red-team test suite** — 32 cases, all passing, run with `npx tsx src/utils/__tests__/safetyDetect.test.ts`
- **Marketing site** — heyotis.app live, deployed on Vercel, with research surveys and admin dashboards
- **Research surveys** — v2.1 + SurveyCircle variant, both writing to same dashboard
- **Pitch deck** — `decks/HeyOtis_Pitch_Dutch.pptx` (incubator-tuned)
- **Documentation** — GUARDRAILS, CLINICAL_ADVISOR_AGREEMENT, APP_STORE_REVIEW_NOTES (the last one helped you pass review)

### ⏳ Outstanding — see Section 4 for full punchlist

Everything below is something that still needs to happen between now and a real public launch.

---

## 2. Decisions you need to make this week (before launching)

These shape everything that follows. Don't skip them.

| Decision | Options | What it depends on |
|---|---|---|
| **Launch type** | Soft (waitlist only, ~50–200 users) · Public (open download) · Phased rollout | How much you want to control v1 feedback before scaling |
| **Launch date** | Aim 7–14 days out | Time to coordinate the items in Section 5 |
| **Pricing at launch** | Free (collect users + insight first) · Free with paid Plus tier · Trial-then-paid | Your survey data should answer this |
| **Google Play parallel?** | Submit Android now · Wait until iOS proves out · Skip Android v1 | Capacity to support 2 platforms |
| **Crisis-event monitoring** | Founder daily review · Founder-husband split · Wait until first crisis fires | The single most important operational decision |

**My recommended defaults:**
- **Soft launch first** — open to your existing waitlist + IG followers (~50 to start)
- **Launch date 7 days out** — Wednesday is the typical optimal day for app launches (avoid Friday)
- **Free at launch** — gather data before pricing
- **Submit Android within the same week** — same review notes, same approval pattern likely
- **Founder daily safety-event review for first 30 days** — non-negotiable until pattern is proven safe

---

## 3. Outstanding items — the full punchlist

Ordered by **dependency** (top-down) and **urgency** (sub-grouped). Tick as you go.

### 🔴 Must-do before launch (legal, safety, technical foundation)

- [ ] **Sign clinical advisor** — sign [CLINICAL_ADVISOR_AGREEMENT.md](./CLINICAL_ADVISOR_AGREEMENT.md), have advisor review GUARDRAILS.md sections 3, 5, 6, 7
- [ ] **AI lawyer review** — send all 3 docs (GUARDRAILS, CLINICAL_ADVISOR_AGREEMENT, APP_STORE_REVIEW_NOTES); get a 1-hour memo on EU AI Act + MDR classification
- [ ] **Replace `[TBD]` placeholders** in GUARDRAILS.md Section 17 (sign-off block) with the real names
- [ ] **Privacy policy live** at heyotis.app/privacy as a public, indexable page (not just in-app)
- [ ] **Terms of service live** at heyotis.app/terms
- [ ] **Wire safety_state read on app launch** — when a user opens the app and `elevated_until` is in the future, surface the pinned helpline card + a check-in message. (The DB-write half is done; the read-on-launch half deferred so your husband can review the `useAppState` flow.)
- [ ] **Run red-team test suite end-to-end on a real device** — `npx tsx src/utils/__tests__/safetyDetect.test.ts` should show 32/32, plus manually test the 6 scenarios in [APP_STORE_REVIEW_NOTES.md](./APP_STORE_REVIEW_NOTES.md) Section "Crisis handling — reviewer demonstration"
- [ ] **Verify the demo account** still works (the one Apple used for review) — Apple may re-test on subsequent submissions

### 🟠 High priority — complete in the launch week

- [ ] **TestFlight beta with 10–20 hand-picked users** — close people, your therapist friend, 2–3 trusted couples. Use TestFlight's built-in feedback feature.
- [ ] **Crash reporting** — install Sentry or Bugsnag (Sentry has a free tier, 10 minutes to wire up). Without this, you're blind to client-side crashes.
- [ ] **Set up customer support inbox** — `hello@heyotis.app` forwards to your inbox (or a Front/Help Scout account). Add the address to the app Settings → Support page.
- [ ] **Create a "What's New" v1.0 entry** in App Store Connect — the public-facing release note
- [ ] **Set up daily safety-event email** — query `security_events` where `severity in ('warn','error','critical')` from the last 24h, email it to yourself. Critical for the first 30 days.
- [ ] **Pricing tier decision** — even if launching free, configure the App Store Connect pricing tier so you don't have to do it under launch pressure
- [ ] **App Store screenshots & preview video** — confirm uploaded versions are final (the submitted ones are likely fine, but check)

### 🟡 Nice-to-have — can ship without, but better with

- [ ] **Analytics** — install Plausible or PostHog for activation/retention tracking. Privacy-friendly, GDPR-clean.
- [ ] **Error monitoring** for the edge functions — Supabase logs are good but Sentry covers all surface area
- [ ] **Crisis-flag review playbook** — short doc for your husband: how to read `security_events`, what counts as a real flag, when to escalate to clinical advisor
- [ ] **Trademark filed** — Hey Otis at boip.int (€325, 30 minutes — long shot anyone takes the name in the next 6 weeks but worth it)
- [ ] **Insurance** — professional indemnity + cyber liability policy (~€500-1500/year). Covers the Hey Otis indemnity to the clinical advisor (Section 5.3 of the agreement).

### 🟢 Post-launch — first 30 days

- [ ] **Daily**: review safety events
- [ ] **Daily for first week**: read every email/comment that comes in (early users are gold)
- [ ] **Weekly**: review crash reports, AI cost dashboard, retention curve
- [ ] **2-week mark**: short retro with your husband — what's working, what's breaking, what's the v1.1
- [ ] **30-day mark**: clinical advisor reviews crisis flag patterns
- [ ] **30-day mark**: decide on Google Play submission timeline if not already submitted

### 📱 Google Play track (parallel)

If you do Android in parallel:

- [ ] **Build Android version** via EAS (`eas build -p android`)
- [ ] **Upload to Play Console** Internal Testing track first
- [ ] **Submit for Closed Testing** with same demo account
- [ ] **Health Apps policy declaration** — same content as Apple's
- [ ] **Data Safety form** in Play Console
- [ ] **Submit to Production track** once Internal + Closed pass

Use [APP_STORE_REVIEW_NOTES.md](./APP_STORE_REVIEW_NOTES.md) as your starting point — most of the content transfers directly to Play.

---

## 4. The actual launch-day runbook

A concrete sequence of actions for the day you push "Release."

### T–7 days

- [ ] Final TestFlight push to 10–20 users; collect feedback for 3 days
- [ ] Privacy policy + ToS published at heyotis.app/privacy + /terms
- [ ] Safety-event daily email cron set up
- [ ] Customer support inbox routing tested (send yourself a test email)
- [ ] Crash reporting verified (cause an intentional test crash, confirm it shows up)

### T–3 days

- [ ] Soft-freeze: no new commits to main except critical fixes
- [ ] Email waitlist users with a "launching in 3 days" preview
- [ ] Schedule the launch announcement posts (Reddit, IG, LinkedIn, Substack) for T–0
- [ ] Confirm clinical advisor + lawyer sign-off documents are filed

### T–1 day (the day before)

- [ ] In App Store Connect, set release to "Manual" (not automatic) so you control the moment
- [ ] Final test run-through on your own iPhone
- [ ] Run `npx tsx src/utils/__tests__/safetyDetect.test.ts` one more time
- [ ] Quick chat with husband + clinical advisor that you're going live tomorrow

### T–0 (launch day)

- [ ] **Morning (08:00 CET):** in App Store Connect, click **"Release this version"**
- [ ] **+30 min:** confirm the app is publicly searchable in App Store
- [ ] **+1 hour:** post the launch announcement on:
  - Your existing waitlist email list
  - r/Marriage, r/datingoverthirty (Reddit posts you've drafted)
  - Your IG feed (couch confession video — you have the format)
  - Your LinkedIn (founder-mode post)
  - Your Substack if you have one
- [ ] **Throughout day:** reply to every comment, every DM, every email
- [ ] **End of day:** check `security_events`, crash reports, App Store reviews, install count, Anthropic spend

### T+1 to T+7

- [ ] Daily safety event review (first thing in the morning)
- [ ] Reply to every review on App Store within 24 hours
- [ ] Watch Anthropic spend per active user — should track ~$0.21 per user per active month
- [ ] Patch any crash that affects >1% of users immediately

---

## 5. Submission file inventory

Single source of truth for where everything lives.

### Documentation
| Doc | Path | Purpose |
|---|---|---|
| Safety framework | [docs/GUARDRAILS.md](./GUARDRAILS.md) | Binding safety rules + 9 pillars + crisis taxonomy |
| Clinical advisor agreement | [docs/CLINICAL_ADVISOR_AGREEMENT.md](./CLINICAL_ADVISOR_AGREEMENT.md) | Template contract for clinical advisor |
| App Store review notes | [docs/APP_STORE_REVIEW_NOTES.md](./APP_STORE_REVIEW_NOTES.md) | What to paste into App Review submission notes |
| Launch readiness (this file) | [docs/LAUNCH_README.md](./LAUNCH_README.md) | Outstanding items + launch sequence |
| Strategy deck | [decks/HeyOtis_Pitch_Dutch.pptx](../decks/HeyOtis_Pitch_Dutch.pptx) | 16-slide investor / incubator deck |
| Pre-submit checklist (legacy) | [store-assets/PRE-SUBMIT-CHECKLIST.md](../store-assets/PRE-SUBMIT-CHECKLIST.md) | Older detailed checklist — superseded by this file for launch |
| TODO (running list) | [TODO.md](../TODO.md) | Day-to-day task list |

### Code
| Layer | Path | What it does |
|---|---|---|
| Mobile app | `app/` + `src/` | React Native / Expo |
| Marketing + research site | `website/` | Next.js, deployed to Vercel at heyotis.app |
| Edge functions | `supabase/functions/claude-proxy/` + `supabase/functions/research-export/` | Anthropic proxy with safety, dashboard data export |
| Migrations | `supabase/migrations/` | Database schema + RLS + RPCs |
| Crisis taxonomy | `src/utils/safetyDetect.ts` | 7-category pattern matcher |
| Crisis responses | `src/utils/crisisResponses.ts` | Country-aware response templates |
| Breathing overlay | `src/components/BreathingOverlay.tsx` | In-product calming UI |
| Red-team tests | `src/utils/__tests__/safetyDetect.test.ts` | 32-case test suite |

### App Store assets
| Asset | Path / location | Status |
|---|---|---|
| Screenshots (iPhone 6.7") | App Store Connect | ✅ Submitted |
| Screenshots (iPhone 6.5") | App Store Connect | ✅ Submitted |
| App description | App Store Connect | ✅ Submitted |
| Keywords | App Store Connect | ✅ Submitted |
| Privacy policy URL | heyotis.app/privacy | ⏳ Verify it's live |
| Support URL | heyotis.app/support OR mailto:hello@heyotis.app | ⏳ Verify it's live |
| Demo credentials | App Store Connect notes | ✅ Submitted (verify still working) |

### Operational endpoints
| Resource | Where |
|---|---|
| Marketing site | https://heyotis.app |
| Research surveys | /research-v2, /research-sc |
| Admin dashboards | /admin/research, /admin/research-v2 |
| Supabase project | axlarqthzbmqxzyhbrab (Tether, EU-West) |
| Apple App Store Connect | https://appstoreconnect.apple.com |
| Vercel project | website (auto-deploys from main) |

---

## 6. Post-launch operations — the things that need running daily/weekly

This is where most launches fall apart. The app shipping is the easy part; running it safely takes routine.

### Daily (first 30 days)
- **08:00** — read overnight safety events: `select * from security_events where severity in ('warn','error','critical') and created_at > now() - interval '24 hours' order by created_at desc`
- **09:00** — read all overnight: App Store reviews, support emails, IG/Reddit comments
- **17:00** — check Anthropic dashboard for cost per user and total daily spend

### Weekly
- **Monday:** retention cohort check — what % of week-1 users came back week 2
- **Wednesday:** crash report review — anything affecting >1% of users
- **Friday:** decide v1.1 priorities based on the week's signal

### Monthly
- Clinical advisor review of crisis flag patterns (Section 14 of GUARDRAILS)
- Run secrets hygiene audit (see TODO.md ongoing section)
- Dependabot PR review

### Quarterly
- Full clinical review of GUARDRAILS.md
- Re-run red-team test suite, expand based on real-world cases
- Insurance + legal review

---

## 7. The honest one-paragraph status

You're 90% to public launch. Apple is approved. The safety architecture is built and audited. The marketing site, surveys, dashboards, and pitch deck are live. What's left is mostly **operational** (daily monitoring setup, customer support inbox, crash reporting) and **legal/clinical sign-off** (advisor + lawyer signing the docs that already exist as templates). None of it is hard. All of it must happen before pressing the public release button.

---

## 8. What I'd do tomorrow if I were you

In order:

1. **Email the clinical advisor candidate** with GUARDRAILS.md + CLINICAL_ADVISOR_AGREEMENT.md and the question: *"Will you commit to this for €X/hour and ~20 hours/year?"*
2. **Email the AI lawyer** with all 3 docs and the question: *"Can you give me a 1-hour memo on EU AI Act classification + MDR classification?"*
3. **Set up Sentry** (10 min) — install on the React Native app, smoke-test with one intentional crash
4. **Set up the daily safety-event email** — this is your single most important operational protection
5. **Schedule the launch date** with your husband — whatever week works for both of you to be on call

Everything else can happen in parallel, but those five unblock the public release moment.

---

*This document is a living artifact. Update the status checkboxes as you go. When in doubt, the top of Section 8 is the next thing to do.*
