# SkipTheWait NSW — Launch Handoff

Don — both AU + NZ apps are built, deployed, and serving. Here's everything you need to know.

## Live URLs (current)

| | URL | Notes |
|---|---|---|
| **AU production** | https://skipthewait-au.vercel.app | Live, serving HTML |
| **NZ production** | https://skipthewait-nz.vercel.app | Live, serving HTML |
| **AU GitHub** | https://github.com/testbotdon-beep/skipthewait-au | Public, `main` + `deploy` branches |
| **NZ GitHub** | https://github.com/testbotdon-beep/skipthewait-nz | Public, `main` + `deploy` branches |
| **AU Vercel project** | testbotdon-7704s-projects/skipthewait-au | All env vars set (LIVE Stripe keys reused from Drive Finder) |
| **NZ Vercel project** | testbotdon-7704s-projects/skipthewait-nz | All env vars set |

When you give the domain (`skipthewait.uqlabs.co` / `skipthewait-nz.uqlabs.co` recommended), I alias them via `vercel alias set <deploy-url> <domain>`. The DNS for `uqlabs.co` is already pointing to Vercel based on Drive Finder pattern, so adding a CNAME for the new subdomain in your DNS panel should do it.

## What it does

Same DNA as Drive Finder SG. Different vertical, different geo:

- Parent fills 30-second form (free) — area, child age, ADHD or autism, GP referral status, urgency, budget, contact
- You see request in admin dashboard, pick 2–3 verified paediatricians / child psychiatrists / clinical psychologists matching the criteria
- Click "WhatsApp" on each candidate, message goes pre-filled with parent's request context
- Mark contact status (Sent / Yes / No / No reply)
- When one says yes, click "Confirm match → Stripe link"
- Stripe Checkout link copied to clipboard, you send it to parent via SMS / WhatsApp
- Parent pays A$29 (or NZ$29) — auth-hold only, no money moves yet
- You click "Mark paid + delivered" → captures the hold, hands off practitioner details
- If no match in 7 days, click "No match found" → voids hold, parent pays nothing

Stripe **manual capture** = same risk-free model as Drive Finder. No money moves until you say so.

## Admin access

- AU: `https://skipthewait-au.vercel.app/admin` · password: `skipthewait-au-2026`
- NZ: `https://skipthewait-nz.vercel.app/admin` · password: `skipthewait-nz-2026`

(Change in Vercel env vars if you want — `ADMIN_PASSWORD` per project.)

## Pricing

- A$29 (AU) / NZ$29 (NZ) per matched assessment slot
- Pay only on match
- 7-day deadline → auto-void via daily Vercel cron at midnight UTC

## Provider data (seed)

22 NSW practitioners pre-loaded in `data/nsw-paediatricians.json`. 18 NZ practitioners in `data/nz-paediatricians.json`.

These are starter contact lists from public clinic websites — verify each one against AHPRA (AU) / MCNZ (NZ) before first message. Add more by editing the JSON file and pushing to `deploy` branch + redeploying.

**Add a provider**: open the JSON file, append an entry following the same shape, commit, push to `deploy`, run `vercel deploy --prod --yes`.

## Tech stack

- Next.js 16 + React 19 + TypeScript (same as Drive Finder)
- Tailwind v4
- Upstash Redis (reused from Drive Finder — same instance, different key prefixes: `skipthewait:au:` and `skipthewait:nz:`)
- Stripe (LIVE keys reused from Drive Finder, same Stripe account)
- Vercel hobby tier (daily cron limit fine for void-stale)
- Auth-hold / manual capture model (no money moves until delivered)

## Distribution channels (FB groups + TikTok)

### NSW / AU — primary push

**Facebook groups (gold mine)**:
- ADHD Aussie Mums (40k+ members)
- Autism Australia Support
- Sydney Mums (100k+)
- Northern Beaches Mums
- Inner West Mums
- North Shore Mums
- Eastern Suburbs Mums
- Hills District Mums
- Western Sydney Mums
- Blue Mountains Mums
- Newcastle Mums
- ADHD Parents Australia
- Autism Spectrum Parents NSW
- ND Kids Australia
- Twice Exceptional Parents Australia

**TikTok hashtags**:
- #adhdmum
- #autismmum
- #aussiemum
- #neurodivergentkid
- #sydneymum
- #adhdkid
- #autismparenting
- #adhdcrisis
- #aussieparenting
- #ndmum

**TikTok content angle**: parent-pain UGC. "I cold-called 11 paeds, all closed books. Then I found this $29 service that calls for me." Tag location = Sydney for AU.

### NZ — passive launch

**Facebook groups**:
- ADHD NZ Parents
- Autism NZ
- Auckland Mums
- Wellington Mums
- Christchurch Mums
- Mums of New Zealand (general)
- ND Whānau (Māori inclusive ND parents)

**TikTok hashtags**:
- #nzmum
- #adhdnz
- #autismnz
- #kiwimum
- #neurodivergentkidsnz

## Build + deploy workflow

```bash
# Local dev (AU)
cd ~/skipthewait-au
npm run dev   # http://localhost:3007

# Local dev (NZ)
cd ~/skipthewait-nz
npm run dev   # http://localhost:3008

# Deploy (from project root)
vercel deploy --prod --yes
```

Git: push to `deploy` branch (not `main` directly — main is locked). Vercel CLI deploys from local files (no GitHub auto-deploy connected, same as Drive Finder pattern).

## Env vars (all set on Vercel)

| Var | AU value | NZ value |
|---|---|---|
| STRIPE_SECRET_KEY | (live, reused from Drive Finder) | same |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | (live, reused) | same |
| UPSTASH_REDIS_REST_URL | (reused from Drive Finder) | same |
| UPSTASH_REDIS_REST_TOKEN | (reused) | same |
| ADMIN_PASSWORD | skipthewait-au-2026 | skipthewait-nz-2026 |
| CRON_SECRET | (reused random hex) | same |
| PRICE_AMOUNT_CENTS | 2900 | 2900 |
| PRICE_CURRENCY | aud | nzd |
| NEXT_PUBLIC_APP_URL | https://skipthewait.uqlabs.co | https://skipthewait-nz.uqlabs.co |
| STRIPE_WEBHOOK_SECRET | placeholder (set after Stripe dashboard webhook config) | placeholder |

## Pre-launch checklist (when you're ready)

1. **Domain**: tell me the final subdomain. I run `vercel alias set <deploy-url> <domain>` for both. Add CNAME in DNS if not already wildcard.
2. **Provider list**: cross-check the seed data against AHPRA (NSW) and MCNZ (NZ). Public sites I scraped from may have outdated phone numbers — verify before messaging anyone. Add more as you go.
3. **Stripe webhook (optional)**: only needed if you want auto-capture on payment. Current flow is manual ("Mark paid + delivered" button). For MVP, skip.
4. **Test the form end to end**: submit a test request from each site, see it appear in admin, run through confirm → Stripe link → simulated payment.
5. **First post**: pick the strongest FB group per market, contribute genuinely for 2-3 days, then drop a user-voice mention.

## Differences from Drive Finder SG

- Stripe currency: AUD / NZD (Drive Finder is SGD)
- Admin storage key: `skipthewait_au_admin_pw` / `skipthewait_nz_admin_pw` (so you can be logged into multiple admins from same browser)
- Redis key prefix: `skipthewait:au:` / `skipthewait:nz:` (data is namespaced — Drive Finder data untouched)
- Daily cron (hobby tier limit) vs Drive Finder hourly (was on Pro?)
- 7-day deadline (vs Drive Finder 48h) — paediatric matching takes longer than driving instructor matching
- Form fields: parent / child / area / condition / GP referral / urgency / budget (vs Drive Finder: learner / test centre / transmission)

## Known gaps (deferred to v2)

- No Resend email integration. Drive Finder sends emails on confirm/deliver — SkipTheWait MVP relies on you sending SMS/WhatsApp manually with the matched details. If you want auto-email on delivery, I add it in 30 min.
- No social image generation routes (Drive Finder has Lemon8 / TikTok auto-generators) — SkipTheWait can use static OG image only for now.
- Provider list is hand-curated 22 + 18 entries. Real production needs 80–150 per market for robust matching. Easy to add — JSON file edit + redeploy.
- No NDIS provider matching (different supply pool, different funding model). Defer to v2.
- No dyslexia / speech / OT matching (different specialties). Defer to v2.

## Cost so far

**$0**. Reusing Drive Finder's:
- Stripe account
- Upstash Redis instance
- Vercel hobby tier
- GitHub free tier

The only future cost is custom domain DNS (already paid via uqlabs.co) and any Stripe transaction fees on actual matched payments (1.7% + 30c per A$29 = ~A$0.79 fee, you keep ~A$28.21 per match).

— Built end to end in one session.
