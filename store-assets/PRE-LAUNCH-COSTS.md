# Hey Otis — Pre-Launch Subscriptions & Costs

Everything you need to pay for before launching the app.

---

## 1. Anthropic API (Claude AI) — CRITICAL

**What it does:** Powers ALL the AI conversations in the app. Every time a user types a message in Vent, Understand, Prepare, or Nurture, it hits the Anthropic API. Also powers session summaries, memory updates, and reflection generation.

**How it works in the app:**
- Your app calls `https://api.anthropic.com/v1/messages` directly from the client using an API key stored in your `.env` file (`EXPO_PUBLIC_ANTHROPIC_API_KEY`)
- Currently uses the model `claude-haiku-4-5-20251001` (Claude Haiku 4.5) — the fastest and cheapest Claude model
- Every user message triggers 1 API call. Session summaries and memory updates trigger additional calls in the background.

**Pricing:** Pay-as-you-go (no monthly subscription)
- **Input tokens**: $0.80 per million tokens
- **Output tokens**: $4.00 per million tokens
- A typical session message exchange (user + AI response) uses ~1,000-2,000 tokens
- **Estimated cost per user session** (10-20 messages): ~$0.02-0.05
- **Estimated cost per 1,000 monthly active users**: ~$50-150/month

**Setup:**
1. Go to https://console.anthropic.com
2. Create an account and add a payment method
3. Generate an API key
4. Add it to your `.env` file: `EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...`

**⚠️ IMPORTANT SECURITY NOTE:**
Your API key is currently exposed in the client-side code (`EXPO_PUBLIC_` prefix makes it visible in the app bundle). Before production launch, you should move the API call to a backend/edge function so the key isn't exposed. Options:
- Supabase Edge Function (free on current plan) — acts as a proxy between app and Anthropic
- Vercel serverless function
This prevents users from extracting your API key and running up charges.

**Monthly estimate**: $0 (pre-launch) → $50-300/month at launch depending on usage

---

## 2. Supabase — Database & Auth

**What it does:** Stores user accounts, profiles, couple links, invites. Handles Google OAuth authentication.

**How it works:**
- Auth: Google sign-in, email/password sign-up
- Database: User profiles (attachment style, love language, etc.), couple relationships, invite codes
- Secure token storage via `expo-secure-store`

**Current plan:** Free tier
- 500MB database
- 50,000 monthly active users
- 5GB bandwidth
- 1GB file storage
- 500K Edge Function invocations

**When you'll need to upgrade:**
- Pro plan ($25/month) when you exceed free limits or need daily backups, email support

**Monthly estimate**: $0 (free tier covers launch) → $25/month when scaling

---

## 3. Apple Developer Program — iOS App Store

**What it does:** Required to publish on the App Store.

**Cost:** $99/year (USD)

**Setup:** https://developer.apple.com/programs/enroll/

---

## 4. Google Play Developer — Google Play Store

**What it does:** Required to publish on Google Play.

**Cost:** $25 one-time (USD)

**Setup:** https://play.google.com/console — already started

---

## 5. Expo / EAS (Expo Application Services)

**What it does:** Builds your iOS and Android app binaries in the cloud. No need for Xcode or Android Studio locally.

**Current plan:** Free tier
- 30 builds per month
- OTA updates
- Basic support

**When you'll need to upgrade:**
- Production plan ($99/month) for priority builds, more build minutes, team features

**Monthly estimate**: $0 (free tier covers launch) → $99/month if needed

---

## 6. Vercel — Website Hosting

**What it does:** Hosts heyotis.app (the promotional landing page).

**Current plan:** Free (Hobby)
- 100GB bandwidth
- Automatic HTTPS
- Custom domain support

**When you'll need to upgrade:**
- Pro plan ($20/month) for team features, more bandwidth, analytics

**Monthly estimate**: $0 (free tier covers launch)

---

## 7. Domain Name — heyotis.app

**What it does:** Your website and email domain.

**Cost:** ~$12-20/year for a `.app` domain

**Setup:** Purchase through Google Domains, Namecheap, or Cloudflare. Then connect to Vercel for hosting and set up email (privacy@heyotis.app).

**Annual estimate**: ~$15/year

---

## 8. Google Cloud Platform — Google OAuth

**What it does:** Powers the "Continue with Google" sign-in button.

**Current plan:** Free tier (OAuth is free)
- No cost for OAuth client credentials
- No per-auth-call charges

**Monthly estimate**: $0

---

## Summary: Pre-Launch Costs

| Service | Type | Cost | When to Pay |
|---------|------|------|-------------|
| Anthropic API Key | Pay-as-you-go | $0 until users start using | Before launch |
| Supabase | Free tier | $0 | Already active |
| Apple Developer | Annual | $99/year | Before iOS submission |
| Google Play Developer | One-time | $25 | Before Android submission |
| Expo / EAS | Free tier | $0 | Already active |
| Vercel | Free tier | $0 | Already active |
| Domain (heyotis.app) | Annual | ~$15/year | Before launch |
| Google Cloud (OAuth) | Free | $0 | Already active |

### Total to launch: ~$139 upfront + API usage costs

---

## Monthly Running Costs (Post-Launch Estimates)

| Users (MAU) | Anthropic API | Supabase | Other | Total |
|-------------|---------------|----------|-------|-------|
| 100 | ~$5-15 | $0 (free) | $0 | ~$5-15/mo |
| 1,000 | ~$50-150 | $0 (free) | $0 | ~$50-150/mo |
| 5,000 | ~$250-750 | $25 (pro) | $0 | ~$275-775/mo |
| 10,000 | ~$500-1,500 | $25 (pro) | $99 (Expo) | ~$624-1,624/mo |

---

## Action Items Before Launch

1. **[ ] Get Anthropic API key** — https://console.anthropic.com — add to `.env`
2. **[ ] Move API key to backend** — Create Supabase Edge Function as proxy (security)
3. **[ ] Purchase domain** — heyotis.app
4. **[ ] Apple Developer enrollment** — $99/year
5. **[ ] Google Play enrollment** — $25 (already started)
6. **[ ] Connect custom domain to Vercel** — In Vercel dashboard
7. **[ ] Set up email** — privacy@heyotis.app (use Zoho free or Google Workspace)
8. **[ ] Build iOS app** — `eas build --platform ios`
9. **[ ] Build Android app** — `eas build --platform android`
10. **[ ] Submit to both stores**
