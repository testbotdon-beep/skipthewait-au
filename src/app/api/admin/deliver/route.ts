import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getRequest, updateRequest, getProviders } from '@/lib/db'

const Schema = z.object({
  requestId: z.string().min(1),
  providerIds: z.array(z.string()).min(1).max(5),
  notes: z.string().max(500).optional(),
  amount_cents: z.number().int().nonnegative().optional(),
})

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || auth !== `Bearer ${pw}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const request = await getRequest(parsed.data.requestId)
  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }
  if (['delivered', 'voided'].includes(request.status)) {
    return NextResponse.json(
      { error: `Request already ${request.status}` },
      { status: 400 }
    )
  }

  const allProviders = getProviders()
  void allProviders.filter((p) => parsed.data.providerIds.includes(p.id))

  const now = new Date().toISOString()
  const updates: Partial<{
    status: string
    matched_provider_ids: string
    admin_notes: string | null
    delivered_at: string
    amount_cents: number
  }> = {
    status: 'delivered',
    matched_provider_ids: JSON.stringify(parsed.data.providerIds),
    admin_notes: parsed.data.notes || null,
    delivered_at: now,
  }
  if (parsed.data.amount_cents !== undefined) {
    updates.amount_cents = parsed.data.amount_cents
  }
  await updateRequest(request.id, updates as Parameters<typeof updateRequest>[1])

  return NextResponse.json({ ok: true, status: 'delivered' })
}
