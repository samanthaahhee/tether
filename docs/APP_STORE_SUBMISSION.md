# Hey Otis — App Store Submission Walkthrough

**Status:** Apple Developer account approved. App not yet submitted. This is the playbook to get from here to "Live in App Store."
**Estimated time:** 3–4 weeks (procedural, not technical)
**Last updated:** 2026-04-30

> Follow top-to-bottom. Each section gates the next. If you hit a blocker, fix it before moving on — don't skip ahead.

---

## 1. Bundle identifier ✅ DECIDED

**Bundle ID:** `com.heyotis.app`

Locked into `app.json` (both `ios.bundleIdentifier` and `android.package`). Use this exact string when registering the App ID in Section 2a — they must match precisely.

---

## 2. Apple Developer Portal setup (30 minutes)

Login: https://developer.apple.com/account

### 2a. Create the App ID

1. **Certificates, Identifiers & Profiles** → **Identifiers** → **+**
2. Select **App IDs** → **App**
3. Description: `Hey Otis`
4. Bundle ID: `Explicit`, value matches `app.json` (e.g. `com.heyotis.app`)
5. **Capabilities** to enable:
   - Push Notifications (only if you plan to send any — skip if not)
   - Sign in with Apple (only if you implement it — currently not implemented, skip)
   - In-App Purchase (only if you have paid features at launch — skip if free)
6. Click **Continue** → **Register**

### 2b. Signing certificates + provisioning profiles

You have two options:

**Option A (recommended): Let EAS handle credentials.**
EAS will auto-create signing certificate, distribution certificate, and provisioning profile when you run your first `eas build`. This is the easiest path.

**Option B: Manual.** Create distribution certificate + App Store provisioning profile yourself. Not necessary unless you have a specific reason. Skip.

---

## 3. EAS production build profile (15 minutes)

The `eas.json` file in the repo currently has an empty `"production": {}` block. Configure it before building.

### 3a. Update `eas.json`

Replace the production block with:

```json
{
  "cli": { "version": ">= 18.0.0" },
  "build": {
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "autoIncrement": "buildNumber"
      },
      "android": {
        "autoIncrement": "versionCode"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID_EMAIL",
        "ascAppId": "WILL_FILL_AFTER_APP_STORE_CONNECT_LISTING",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      }
    }
  }
}
```

`appleId`: the email you use to log in to App Store Connect.
`appleTeamId`: find at https://developer.apple.com/account → Membership → Team ID.
`ascAppId`: filled in Section 4 below after creating the App Store Connect listing.

### 3b. Set EAS secrets

The Anthropic API key + Supabase service role key (if any) must be in EAS secrets, not in code.

```bash
eas secret:create --scope project --name SUPABASE_URL --value "https://axlarqthzbmqxzyhbrab.supabase.co"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "<your anon key>"
# Anthropic key lives in the Supabase edge function, not in EAS
```

Verify: `eas secret:list`

---

## 4. App Store Connect — create the listing (45 minutes)

Login: https://appstoreconnect.apple.com

### 4a. Create the app

1. **My Apps** → **+** → **New App**
2. **Platforms:** iOS
3. **Name:** `Hey Otis`
4. **Primary language:** English (U.S.) — recommended
5. **Bundle ID:** select the one you registered in Section 2a
6. **SKU:** `heyotis-ios` (internal identifier, not public)
7. **User access:** Full Access (default)
8. Click **Create**

The numeric `App ID` (under App Information → "Apple ID") is what you'll paste into `eas.json` as `ascAppId`.

### 4b. App Information

Navigate: **App Information** in the left sidebar.

- **Subtitle:** `A private guide for couples` (max 30 chars)
- **Bundle ID:** verify
- **Primary category:** **Health & Fitness** (recommended) or **Lifestyle**
- **Secondary category:** Lifestyle (or leave blank)
- **Content Rights:** *"Does your app contain, show, or access third-party content?"* → **No** (your AI generates responses; doesn't display third-party content)
- **Age rating:** Tap **Edit** → fill the questionnaire (all "None" except possibly "Infrequent/Mild Mature/Suggestive Themes" depending on whether AI may discuss intimacy in relationships). Will result in **17+**.

### 4c. Pricing and Availability

- **Price:** Free (or your chosen tier)
- **Availability:** select countries — at minimum: NL, GB, US, DE, FR, AU, CA, IE, ZA. Add more later.

### 4d. App Privacy

This is the **Privacy Nutrition Labels**. Important — get this right or App Review will reject.

Click **Get Started** under App Privacy → tap **Edit** for each section.

**Data Used to Track You:** None (you don't track across apps/sites).

**Data Collected:**

| Data type | Linked to user? | Used for tracking? | Purpose |
|---|---|---|---|
| **Email Address** (when user signs up) | Yes (linked) | No | App Functionality |
| **Health & Fitness → Other Health Data** (relationship/conflict-related text — broad interpretation) | Yes (linked) | No | App Functionality, Analytics (if you add it) |
| **User Content → Other User Content** (chat messages) | Yes (linked) | No | App Functionality |
| **Device ID** (none collected) | — | — | — |
| **Crash data** (if you add Sentry) | No (not linked) | No | App Functionality |

**Important — what NOT to claim:**
- Do NOT claim you don't collect any data (Apple checks)
- Do NOT claim Health Data → Health Records (that's HIPAA-territory clinical data; you're not that)
- Do NOT claim "Sensitive Info" unless required (Apple's "Sensitive Info" category triggers extra scrutiny)

### 4e. Version 1.0 — the actual store listing

In the left sidebar, under **iOS App** → **1.0 Prepare for Submission**.

Fill in:

- **Promotional Text** (170 chars, can update without resubmission):
  > A private space for couples. Otis helps you find the words your partner can actually hear — in the moments that matter most.

- **Description** (4000 chars max):
  Use the long-form description from `store-assets/app-store/README.md` if it exists, otherwise:

  > Hey Otis is a private, in-the-moment guide for couples in conflict.
  >
  > Open it after a fight. Walk through four steps: vent what you're feeling, understand what's really going on underneath, prepare the right words, and nurture the actual conversation.
  >
  > Built on the same evidence-based frameworks therapists use — Gottman, attachment theory, Nonviolent Communication. Validated by a licensed clinical advisor. Available 24/7. Use it solo, or sync with your partner.
  >
  > Private by design. EU-built. We never train AI models on your conversations and never sell your data.
  >
  > Hey Otis supports — but does not replace — professional therapy. If you are in crisis, please contact a qualified helpline.

- **Keywords** (100 chars total, comma-separated): `couples,relationships,communication,conflict,attachment,gottman,therapy,marriage,couple,wellness`

- **Support URL:** `https://heyotis.app/support` (or `mailto:hello@heyotis.app` if no /support page)
- **Marketing URL:** `https://heyotis.app`
- **Privacy Policy URL:** `https://heyotis.app/privacy` (must be live and indexable before submission)

- **Build:** will appear after you upload (Section 6)

- **Screenshots:** upload 6.7" (mandatory) + 6.5" (mandatory) iPhone screenshots
  - 6.7": 1290×2796 px, PNG, 6–8 images
  - 6.5": 1284×2778 px, PNG, 6–8 images
  - Reference: `store-assets/SCREENSHOT-COPY.md` for what to put on each

- **App Preview Video:** optional but boosts conversion ~25% per Apple's data. Skip for v1 if you don't have one ready.

- **App Review Information** — *most important field*. Paste the **entire content** of [APP_STORE_REVIEW_NOTES.md](./APP_STORE_REVIEW_NOTES.md) here. This is what passes you through review.

  - **Sign-in required:** Yes
  - **Demo Account:**
    - Username: `apple-review@heyotis.app`
    - Password: (generate a strong one and keep it noted)
  - **Notes:** paste APP_STORE_REVIEW_NOTES.md content
  - **Contact Information:**
    - First name: Samantha
    - Last name: Ahhee
    - Phone: your number with country code
    - Email: samantha.ahhee@gmail.com

- **Version Release:**
  - Select **"Manually release this version"** so you control the moment

---

## 5. Pre-build verification (15 minutes)

Before triggering a production build, verify:

### 5a. Code state

```bash
# Run the safety test suite — must pass 32/32
npx tsx src/utils/__tests__/safetyDetect.test.ts

# Quick TypeScript check (ignore pre-existing errors)
npx tsc --noEmit 2>&1 | grep -E "^(src/utils/safetyDetect|src/utils/crisisResponses|src/components/BreathingOverlay|src/hooks/useClaude)" | head
```

Both must pass.

### 5b. Manual smoke test on device

Plug in your iPhone, run `expo start --tunnel`, scan QR code in Expo Go. Then:

1. **Sign up** with a new email — confirm verification email arrives
2. **Onboarding** — complete the 5 assessments
3. **Vent** — send a normal message, verify Otis replies after typing delay
4. **Vent** — send "I want to kill myself" — verify the suicide template appears, NOT a Claude response
5. **Vent** — send "akak" — verify the "tell me more" prompt
6. **Tap the wind icon** in the chat header — breathing overlay opens, animates, closes cleanly
7. **Background and reopen the app** — session resumes correctly

If any of those fail, fix before building. The build process is slow (~20 minutes per build) and you don't want to discover bugs after submission.

### 5c. Privacy + ToS pages live

Open in browser:
- https://heyotis.app/privacy — must load with full privacy policy
- https://heyotis.app/terms — must load with full terms of service

If either is missing, **stop**. App Review will reject without these. Add them as static pages in `website/app/privacy/page.tsx` and `website/app/terms/page.tsx`, deploy, verify.

---

## 6. Build + upload (1 hour total — 20 min build + 40 min waiting)

### 6a. Build

```bash
cd /Users/samanthaahhee/tether
eas build -p ios --profile production
```

EAS will:
1. Walk you through Apple credentials interactively (first time only)
2. Build on EAS servers (~15–20 min)
3. Output a `.ipa` file URL

If EAS asks about credentials and you have Option A from Section 2b, accept the default ("Let Expo handle this").

### 6b. Upload to App Store Connect

```bash
eas submit -p ios --latest
```

This uploads the `.ipa` to App Store Connect. Takes ~5 minutes. You'll see "Build uploaded" and Apple will start "Processing" the build (~15–30 min).

### 6c. Verify in App Store Connect

Refresh App Store Connect → Your app → **TestFlight** tab → **Builds**. After processing, the build will appear with a green dot.

If status shows red or "Missing Compliance," click into the build → **Manage** → answer the export compliance questions:
- "Does your app use encryption?" → **Yes** (HTTPS counts)
- "Does it qualify for any exemption?" → **Yes** (the standard "uses encryption only for HTTPS" exemption applies)
- That's it.

---

## 7. TestFlight beta (1–2 weeks)

### 7a. Internal Testing (immediate, no review)

Add up to 100 internal testers — anyone in your Apple Developer team:

1. App Store Connect → **TestFlight** → **Internal Testing**
2. Click the **+** next to "Testers"
3. Add yourself, your husband, anyone who already has access to the App Store Connect account

They'll get a TestFlight invite email immediately. Install TestFlight on iPhone, accept the invite, install Hey Otis.

### 7b. External Testing (requires "Beta App Review" — separate from full App Review)

For users outside your team (waitlist, friends, therapist), use **External Testing**:

1. App Store Connect → **TestFlight** → **External Testing** → **Add Group**
2. Group name: `Internal beta`
3. Add up to 10,000 testers by email
4. Submit the build for **Beta App Review** (lighter than full review — usually ~24h)
5. Once Beta App Review passes, testers get the invite

### 7c. Collect feedback

TestFlight has a built-in feedback feature. Send testers a one-line ask:

> *Once you've used it, hit the screenshot button in TestFlight and tell us what felt off. One sentence is fine.*

You'll get gold. Iterate based on feedback. Each fix = new build = `eas build` → `eas submit` → testers auto-update.

---

## 8. Submit for App Review (the moment of truth)

When TestFlight feedback is addressed and you're confident:

1. App Store Connect → Your app → **iOS App** → **1.0 Prepare for Submission**
2. Verify all fields are complete (red exclamation marks indicate missing items)
3. Verify the build under **Build** is the latest
4. Click **Add for Review** at the top right
5. Apple will run their pre-submission checks → if they pass, status becomes **Waiting for Review**

### Typical timeline
- **Waiting for Review:** 0–24 hours
- **In Review:** 1–4 hours
- **Approved** (or **Rejected with feedback**): notification by email

### If approved

Status becomes **Pending Developer Release** (because you set release to manual).

### If rejected

Apple sends specific feedback. Common rejection reasons for mental-health-adjacent apps:

| Rejection reason | Fix |
|---|---|
| 1.4.1 (Medical) — "appears to provide medical advice" | Tighten copy; reference Pillar 1 of GUARDRAILS.md |
| 5.1.1 (Privacy) — privacy policy issue | Verify privacy policy is live and matches app behavior |
| 4.5 (Push notifications) — using push for marketing | Don't, or clearly disclose |
| 2.1 (Performance) — crashes during reviewer testing | Reproduce locally and fix |
| 4.0 (Design) — concerning UX | Address specific issue raised |

For mental-health-related rejections, your **APP_STORE_REVIEW_NOTES.md** is your defense. Reference specific sections in your reply.

Reply to rejections within 24 hours via the **Resolution Center** in App Store Connect. Don't argue — address each point with concrete change.

---

## 9. Public release

### 9a. Right before release

- [ ] Privacy policy + ToS still live and current
- [ ] Customer support inbox active (`hello@heyotis.app`)
- [ ] Crash reporting live (Sentry or equivalent)
- [ ] Daily safety event email cron set up
- [ ] On-call coverage agreed with husband

### 9b. Release

1. App Store Connect → Your app → **App Store** tab
2. Status should say **Pending Developer Release**
3. Click **Release This Version**
4. Within 1 hour, the app becomes searchable on App Store

### 9c. The first 24 hours

- Reply to every review (positive or negative)
- Watch crash reports
- Watch Anthropic spend
- Watch security_events
- Reply to every email/comment
- Don't push code unless something is on fire

---

## 10. After launch

Follow [LAUNCH_README.md](./LAUNCH_README.md) Sections 6 (post-launch operations) and 4 (week-by-week post-launch).

For Google Play, this same playbook largely applies — see [LAUNCH_README.md](./LAUNCH_README.md) Section 3 (📱 Google Play track).

---

## Appendix A — Quick command reference

```bash
# Build for App Store
eas build -p ios --profile production

# Upload latest build
eas submit -p ios --latest

# Build for Google Play
eas build -p android --profile production

# Upload Android
eas submit -p android --latest

# Run safety tests
npx tsx src/utils/__tests__/safetyDetect.test.ts

# Check EAS secrets
eas secret:list

# Update an EAS secret
eas secret:create --scope project --name NAME --value "VALUE" --force
```

---

## Appendix B — Common gotchas

1. **Bundle ID can't change after registration** — decide before Section 2a
2. **Privacy policy URL must be live** — Apple visits it during review
3. **Demo account must work** — log in fresh in a private tab to verify
4. **App Review Information is the most important text** — that's where the safety architecture is explained
5. **Auto-increment build number** in `eas.json` so you don't have to bump it manually
6. **Export compliance** appears as red blocker if not answered — it's almost always "Yes, uses HTTPS, qualifies for exemption"
7. **Screenshots must match the actual app** — Apple rejects mismatched screenshots
8. **Don't include features in the description that aren't in the app**
9. **17+ rating is fine** — don't downgrade to skip the warning, Apple sees through it
10. **TestFlight builds expire after 90 days** — re-upload before then if still in beta

---

## Appendix C — If you get stuck

| Problem | Where to look |
|---|---|
| EAS build fails | `eas build:list` then click the failed build → see logs |
| App Store Connect won't accept upload | Check the "Activity" tab → see the email Apple sent |
| Reviewer rejection | Resolution Center in App Store Connect |
| Demo account broken | Log in via private browser, fix locally, build new version |
| Crash in TestFlight | Check Sentry; reproduce locally; fix; new build |
| Stuck for 4+ hours | Slack the EAS Discord or post in r/expo |

---

*This document is a living artifact. Update as Apple changes their processes (which they do quarterly). When in doubt, the top of Section 1 is the next thing to do.*
