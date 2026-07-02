# StyleStudio — production scaffold

This is the bridge from your prototype to a real, deployable app.

## What's in the box

```
stylestudio-app/
├── README.md                    ← this file
├── DEPLOYMENT.md                ← step-by-step launch checklist
├── package.json                 ← dependencies
├── .env.local.example           ← env vars you'll need
├── next.config.mjs              ← Next.js config (PWA-ready)
├── supabase/
│   └── schema.sql               ← database tables (run this in Supabase)
├── public/
│   └── manifest.json            ← PWA manifest (installable to home screen)
└── src/
    ├── app/
    │   ├── layout.jsx           ← root layout
    │   ├── page.jsx             ← entry point
    │   ├── globals.css          ← tailwind
    │   └── api/
    │       ├── analyze/route.js ← server-side Claude vision (hides API key)
    │       └── outfits/route.js ← server-side outfit generation
    ├── components/
    │   └── StyleStudio.jsx      ← your existing component (drop in)
    └── lib/
        ├── supabase.js          ← Supabase client
        └── storage.js           ← drop-in replacement for window.storage
```

## Tech stack (chosen for fast launch + reasonable cost)

- **Frontend:** Next.js 14 (React) + Tailwind
- **Backend:** Next.js API routes — Claude API key stays server-side
- **Database / Auth / File Storage:** Supabase (Postgres + auth + S3)
- **Hosting:** Vercel (free tier covers early users)
- **Mobile install:** PWA → installable to home screen on iOS and Android with no app store
- **Native app later:** Capacitor wraps the PWA for App Store / Google Play when you're ready

## What you need to do (the unavoidable parts)

1. **Get an Anthropic API key** — console.anthropic.com → add $20-50 to start
2. **Create a Supabase project** — supabase.com → free tier
3. **Buy a domain** — Namecheap or Cloudflare, $10-15/yr
4. **Deploy to Vercel** — connect GitHub, free
5. **Write a privacy policy + terms** — termly.io has decent generators, or use a lawyer ($300-800)

See `DEPLOYMENT.md` for exact steps.

## Cost to operate at launch

| Item | Cost |
|---|---|
| Domain | ~$12/yr |
| Vercel (hosting) | $0 (free tier) |
| Supabase | $0 (free tier good to ~500 MAU) |
| Anthropic API | ~$0.02 per item analyzed, ~$0.01 per outfit generation |
| **Estimated monthly at 100 active users** | **$30-80** |
| Apple Developer (if launching to App Store) | $99/yr |
| Google Play (one-time) | $25 |

## Recommended launch path

**Week 1-2** — Set up infrastructure (Supabase, Vercel, domain), deploy PWA, share with 5-10 friends

**Week 3-4** — Fix what breaks, ship to 50-100 beta testers via TestFlight-style PWA install

**Week 5-8** — Get to 500 users via TikTok/IG content if traction looks real; if not, kill it (this is the hard truth — most consumer apps die here)

**Week 9+** — If you have organic retention (people coming back 3+ times in 30 days), wrap with Capacitor and submit to app stores. If not, don't pay $99 to Apple yet.

## What this scaffold does NOT include

- Push notifications (add via Supabase realtime + service workers later)
- Stripe/payments (not needed until you have engaged users)
- Image moderation for the community feed (add when feed gets active)
- Analytics (add PostHog or Plausible day one)
- Email transactional (add Resend when needed)
- Native camera optimizations (PWA camera is fine; Capacitor gives full native access)

Build these only when you have actual users asking for them.

## A note on this market

You already know the AI wardrobe space is brutally crowded (Whering: 9M users, Acloset: 4M, etc.). This scaffold lets you ship and validate fast — but the technical build is the *easy* part. The hard part is distribution and finding a niche where you can actually win. Don't spend 6 months perfecting features before you have 100 users.
