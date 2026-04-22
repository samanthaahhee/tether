# Hey Otis — website deploy

The site already lives at Vercel project `website` (`prj_eYTw2wipr2r1Lry6zj0tKHkdvGJF`) — the `.vercel/` folder is linked, so a deploy is one command away.

## One-time setup (10 minutes)

### 1. Add the Supabase env vars in Vercel

The waitlist form writes to Supabase. Until these are set, form submissions will fail silently with "Waitlist is temporarily unavailable."

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) → **website** project → **Settings** → **Environment Variables**
2. Add two variables, applied to **all three environments** (Production / Preview / Development):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://axlarqthzbmqxzyhbrab.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon JWT (Supabase Dashboard → Project Settings → API) |

3. Save.

> Both are public by design — the anon key lives in the client bundle but is bounded by the `waitlist_signups` RLS policy (anon can INSERT only; nobody can SELECT/UPDATE/DELETE via REST). The table is invisible to scraping.

### 2. Custom domain (when you own heyotis.app)

1. Vercel project → **Settings → Domains**
2. Add `heyotis.app` + `www.heyotis.app`
3. Vercel gives you DNS records. Add them at your registrar (Namecheap / Cloudflare / etc.)
4. HTTPS + cert provisioning is automatic — takes 2–30 min once DNS propagates
5. Set `heyotis.app` as the canonical; redirect `www` → apex

## Deploy (30 seconds, every time)

From the repo root, anytime:

```bash
cd website
npx vercel --prod
```

That's it. Vercel builds + deploys + returns the live URL. Preview deploys on every branch push are automatic if the repo is connected.

## Local development

```bash
cd website
cp .env.example .env.local    # fill in the real anon key
npm install
npm run dev                   # http://localhost:3000
```

## Checking waitlist signups

Real submissions land in `public.waitlist_signups`. Read them in the Supabase Dashboard → **SQL Editor** (service role):

```sql
select email, referrer, created_at
  from public.waitlist_signups
 order by created_at desc
 limit 50;
```

Count signups by day:

```sql
select date(created_at) as day, count(*) as signups
  from public.waitlist_signups
 group by day
 order by day desc;
```

Count signups by referrer (Instagram vs direct vs other):

```sql
select referrer, count(*)
  from public.waitlist_signups
 group by referrer
 order by count(*) desc;
```

> To attribute Instagram traffic specifically, use `heyotis.app/?src=ig` as your IG bio URL. The form captures `src` as the referrer when document.referrer is empty.

## If something breaks

| Symptom | Fix |
|---|---|
| Form says "Waitlist is temporarily unavailable" | Env vars missing in Vercel — see step 1 |
| Form says "Something went wrong. Please try again." | Check Supabase logs → API Gateway for the failing POST. Likely an RLS policy regression |
| Form shows "Added ✓" but no row in Supabase | Pro tip: it's probably a duplicate email — form treats 409 as success so we don't leak list membership |
| Build fails with "Type error" | `cd website && npm run build` locally to reproduce |
| Deploy succeeds but site doesn't change | Purge Vercel's edge cache: dashboard → Deployments → Redeploy |

## Architecture notes

- **Framework:** Next.js 15 App Router, static export (`output: 'export'`). No SSR, no API routes on Vercel — everything is prebuilt HTML served from CDN.
- **Data flow:** client → Supabase REST `POST /rest/v1/waitlist_signups`. No backend on Vercel to maintain.
- **Security headers:** set in `vercel.json` (CSP-ready but currently opinionated — HSTS, no-sniff, frame-deny).
- **Bundle size:** 105KB first load (2.5KB page + 102KB shared JS). Well under Vercel's free-tier comfort zone.
