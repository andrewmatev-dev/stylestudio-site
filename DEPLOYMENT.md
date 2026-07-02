# Deployment guide

End-to-end checklist to take StyleStudio from this folder to a live, public, installable app. Plan for **2-4 evenings** if it's your first time.

---

## 0. What you need before starting

- A computer with Node.js 18+ installed (`node -v` to check)
- A credit card (for domain + API; everything else has free tiers)
- An email for new accounts (Anthropic, Supabase, Vercel, GitHub)

---

## 1. Local setup (15 min)

```bash
cd stylestudio-app
npm install
cp .env.local.example .env.local
```

Open `.env.local`. You'll fill in the values in step 2 and 3.

---

## 2. Anthropic API key (5 min)

1. Go to https://console.anthropic.com
2. Sign up → Settings → API Keys → Create Key
3. Add billing — start with $20 credit
4. Copy the key into `.env.local` as `ANTHROPIC_API_KEY`

**Cost expectation:** ~$0.02 per item photo analyzed, ~$0.01 per outfit generation. $20 buys roughly 1,000 item adds + 2,000 outfit generations.

---

## 3. Supabase backend (20 min)

1. Go to https://supabase.com → New Project
   - Pick a strong database password and save it
   - Region: pick close to your users
2. Once provisioned, go to **Settings → API**:
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **SQL Editor** → New Query
   - Paste the entire contents of `supabase/schema.sql`
   - Click Run
4. Go to **Storage** → New Bucket
   - Name: `items`
   - Public: **OFF** (keep it private)
5. Inside the `items` bucket → Policies → New Policy
   - Use template "Give users access to own folder"
   - For all operations (SELECT, INSERT, UPDATE, DELETE)
   - Policy definition: `(storage.foldername(name))[1] = auth.uid()::text`
6. **Auth → URL Configuration**
   - Site URL: `http://localhost:3000` for now (update after deploy)
   - Add to redirect URLs: `http://localhost:3000/**`

---

## 4. Populate the main component (10 min)

Open `src/components/StyleStudio.jsx`. Follow the comment block at the top: paste your artifact's component code and apply the 3 documented find-and-replaces.

This swaps `window.storage` for the Supabase-backed adapter and routes Claude API calls through your secure server routes instead of exposing the API key in the browser.

---

## 5. Run it locally (2 min)

```bash
npm run dev
```

Open http://localhost:3000. You should see the auth screen. Enter your email → check inbox → click the magic link → you're in.

Add a few clothing items, generate outfits, post to Inspire. If anything breaks, check the browser console and the terminal for errors.

---

## 6. Deploy to Vercel (15 min)

1. Push your project to a private GitHub repo
   ```bash
   git init && git add . && git commit -m "init"
   gh repo create stylestudio --private --source=. --push
   ```
2. Go to https://vercel.com → New Project → Import the repo
3. **Environment Variables** — paste in everything from `.env.local`:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy — wait ~2 minutes
5. You get a URL like `stylestudio-abc.vercel.app`. Test it.
6. Go back to **Supabase → Auth → URL Configuration** and update Site URL to your Vercel URL + add to redirect URLs

---

## 7. Custom domain (10 min, optional but recommended)

1. Buy a domain at Namecheap or Cloudflare (~$12/yr)
   - Suggestion: `.app` domains feel modern, `.com` is safer for brand
2. In Vercel → Project → Settings → Domains → Add
3. Follow DNS instructions (usually one CNAME or A record)
4. Wait 5-60 min for DNS, then your app is live at your domain
5. Update Supabase Auth URLs again with the new domain

---

## 8. PWA icons (10 min)

Drop two PNG files into `/public/`:
- `icon-192.png` (192×192 pixels)
- `icon-512.png` (512×512 pixels)

Use a tool like https://realfavicongenerator.net to generate them from one source image. Without these, the "Add to Home Screen" install on iOS/Android will look broken.

---

## 9. Privacy policy + Terms (1-3 hours)

You MUST have these before public launch — Apple/Google require them, and Supabase storing user photos creates real legal exposure.

Options:
- **Cheap:** https://termly.io (~$10/mo) — guided generator, decent quality
- **Free:** Adapt an existing open-source one (search "saas privacy policy template")
- **Safe:** Hire a lawyer ($300-800) for proper review, especially if going to App Store

Host them at `/privacy` and `/terms` (just add two more pages in `src/app/privacy/page.jsx`).

Key things yours needs to address:
- Storing user photos in Supabase + USA jurisdiction
- Anthropic API receives photos for analysis (third-party processor)
- Public community feed and what users see of each other
- Data deletion: how users can wipe their account
- CCPA/GDPR (even if you don't market there, users from those regions can sign up)

---

## 10. Test the install flow

On your iPhone or Android, open the site in Safari/Chrome:

- **iOS:** Share button → Add to Home Screen
- **Android:** Menu → Install app

The app should now look and feel native — full-screen, no browser chrome, own icon on the home screen. This is your "real app" experience without app stores.

---

## 11. After launch

### What to add when you have 50+ users
- **Analytics:** PostHog (free tier) or Plausible — see which features people use
- **Error tracking:** Sentry — catch errors before users complain
- **Image moderation:** AWS Rekognition for the community feed before things get weird

### What to add when you're confident the business works
- **Stripe payments** for premium subscription
- **Native app via Capacitor** to submit to App Store and Google Play
- **Push notifications** via Supabase Realtime + Web Push API

### What to add only when truly needed
- Image background removal
- Outfit virtual try-on (this is hard and expensive)
- Calendar/weather integration

Don't build any of these until users ask for them. You'll burn months on features nobody wanted.

---

## Common gotchas

- **Auth redirect not working after deploy:** You forgot to update Supabase Site URL and redirect URLs from `localhost:3000` to your live domain
- **Image upload fails:** Storage bucket policy isn't set correctly, or the bucket name in `storage.js` doesn't match
- **"Cannot find module @/lib/...":** Make sure `jsconfig.json` exists at the project root
- **API route 500s with "ANTHROPIC_API_KEY undefined":** You added env vars to Vercel but didn't redeploy — every env var change needs a redeploy
- **PWA "Add to Home Screen" missing on iOS:** Must be served over HTTPS (Vercel does this automatically) and have a valid `manifest.json`

---

## When to ask for help

If you spend more than 30 minutes stuck on any one step, post in:
- Supabase Discord (https://discord.supabase.com)
- r/nextjs on Reddit
- Stack Overflow with the exact error message

Don't grind solo for hours — these communities are responsive.

---

## UPDATE — latest feature set included

The app in `src/components/StyleStudio.original.jsx` now includes:
- **Leaf Hanger logo** in the header
- **Profile page** (username, photo, bio, public looks, stats) — opens from the avatar in the top-right
- **Settings** (edit username/bio, public/private default). Change-email and reset-password buttons are stubbed and labeled "on launch" — wire them to Supabase Auth (`supabase.auth.updateUser`, `supabase.auth.resetPasswordForEmail`).
- **Comments on Inspire posts** (stored in the new `comments` table)
- **Wear count** per item (new `items.wear_count` / `items.last_worn` columns)
- **Packing list** generator (uses the same Anthropic API route)
- **Closet search** and **wardrobe breakdown** (client-side only, no backend changes)
- **Outfit "never recommend"** + **saved board** (stored in `user_prefs`)

### What changed in the backend
1. `supabase/schema.sql` now creates two more tables — `comments` and `user_prefs` — plus extra columns on `profiles` and `items`. Run the whole file in the Supabase SQL editor.
2. `src/lib/storage.js` now routes:
   - `cmt:<postId>_<commentId>` → `comments` table
   - any other simple key (profile_bio, profile_photo, default_public, saved_board, rejected_outfits, gender_pref…) → `user_prefs` table
3. **Username on signup:** in `AuthScreen.jsx`, collect a username field and write it to `profiles.display_name` on first sign-in. The app reads it via the `display_name` key.

### Auth wiring checklist (the "on launch" items)
- Email/password + username signup → store username in `profiles.display_name`
- `supabase.auth.resetPasswordForEmail(email)` for the Reset Password button
- `supabase.auth.updateUser({ email })` for Change Email
- Supabase → Authentication → turn on "Confirm email"
