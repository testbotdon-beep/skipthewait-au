import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { createRequest, type MatchRequest } from '@/lib/db'

const REFERRAL_SOURCES = ['TikTok', 'Instagram', 'Facebook', 'Google', 'Reddit', 'Friend', 'Mum group', 'Other'] as const

const REGIONS = [
  'Eastern Sydney',
  'Inner West',
  'Northern Beaches',
  'North Shore',
  'Hills District',
  'Western Sydney',
  'South West Sydney',
  'Sutherland Shire',
  'Sydney CBD',
  'Newcastle / Hunter',
  'Illawarra',
  'Central Coast',
  'Anywhere NSW',
] as const

const Schema = z.object({
  region: z.enum(REGIONS),
  condition_type: z.enum(['adhd', 'autism', 'both']),
  child_age_band: z.enum(['under_5', '5_to_12', '13_to_17']),
  referral_status: z.enum(['have_it', 'need_help', 'not_sure']),
  urgency: z.enum(['within_4_weeks', 'within_3_months', 'flexible']),
  budget_cap: z.enum(['under_1500', '1500_to_2500', '2500_plus']),
  parent_name: z.string().min(1).max(80),
  parent_phone: z.string().min(6).max(24),
  parent_email: z.string().email().max(200),
  notes: z.string().max(500).optional().default(''),
  referral_source: z.enum(REFERRAL_SOURCES),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form data', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data
  const id = randomUUID()
  const now = new Date()
  const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const priceCents = parseInt(process.env.PRICE_AMOUNT_CENTS || '2900', 10)

  const request: MatchRequest = {
    id,
    region: data.region,
    condition_type: data.condition_type,
    child_age_band: data.child_age_band,
    referral_status: data.referral_status,
    urgency: data.urgency,
    budget_cap: data.budget_cap,
    parent_name: data.parent_name,
    parent_phone: data.parent_phone,
    parent_email: data.parent_email,
    notes: data.notes || null,
    referral_source: data.referral_source || null,
    status: 'submitted',
    stripe_payment_intent_id: null,
    amount_cents: priceCents,
    matched_provider_ids: null,
    admin_notes: null,
    created_at: now.toISOString(),
    deadline_at: deadline.toISOString(),
    delivered_at: null,
    voided_at: null,
    captured_at: null,
  }

  try {
    await createRequest(request)
  } catch (e) {
    console.error('[request] DB error:', e)
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, requestId: id })
}
