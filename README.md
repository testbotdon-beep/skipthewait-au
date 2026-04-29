# SkipTheWait NSW

Concierge matching for NSW paediatric ADHD and autism assessments. A$29 flat. No match, no charge.

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind v4
- Upstash Redis (production data)
- Stripe (manual capture / auth-hold)
- Vercel deploy

## How the money flow works

Stripe manual capture (auth-hold). No money moves until we deliver:

1. Parent fills form (free, no card required)
2. We call NSW practitioners until we find one with a confirmed slot
3. We send a Stripe Checkout link by SMS/WhatsApp once we have a match
4. Parent pays A$29, Stripe places auth-hold
5. We mark delivered, hold is captured, money moves
6. If we cannot match within 7 days, no link is sent and parent pays nothing

## Running locally

```bash
npm install
npm run dev         # http://localhost:3007
```

## Environment

Copy `.env.example` to `.env.local`:
- Stripe test keys from https://dashboard.stripe.com/test/apikeys
- Upstash Redis (reuse from Drive Finder if same account)
- Admin password
- Cron secret

## Admin

- Dashboard: http://localhost:3007/admin
- Password: whatever you set in `ADMIN_PASSWORD`

## Routes

- `/` — parent-facing landing + form
- `/success?id=X` — post-submission confirmation
- `/admin` — operator dashboard
- `/terms`, `/privacy` — legal

## API

- `POST /api/request` — submit a request
- `GET /api/admin/list` — list requests + providers
- `POST /api/admin/confirm` — confirm match, generate Stripe link
- `POST /api/admin/deliver` — mark paid + delivered
- `POST /api/admin/fail` — void hold, mark failed
- `POST /api/admin/reopen` — reopen a closed request
- `GET /api/cron/void-stale` — auto-void requests older than 7 days

## Deploy

Push to GitHub, import to Vercel, set env vars, alias domain. See `HANDOFF.md` for full launch checklist.
