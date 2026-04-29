import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getRequest, updateRequest } from '@/lib/db'
import { getStripe, PRICE_CENTS, CURRENCY } from '@/lib/stripe'

const Schema = z.object({
  requestId: z.string().min(1),
  providerIds: z.array(z.string()).min(1).max(5),
  notes: z.string().max(500).optional(),
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
  if (request.status !== 'submitted') {
    return NextResponse.json(
      { error: `Request status is "${request.status}", expected "submitted"` },
      { status: 400 }
    )
  }

  let checkoutUrl: string | null = null
  let paymentIntentId: string | null = null

  try {
    const stripe = getStripe()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://skipthewait.uqlabs.co'
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: PRICE_CENTS,
            product_data: {
              name: 'Paediatric Assessment Slot Match',
              description:
                'We have confirmed a NSW practitioner with availability matching your criteria. Pay A$29 and we will send the practitioner details with referral instructions.',
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        capture_method: 'manual',
        description: `SkipTheWait NSW match for ${request.parent_name}`,
        metadata: {
          request_id: request.id,
          parent_name: request.parent_name,
        },
      },
      customer_email: request.parent_email,
      success_url: `${appUrl}/success?id=${request.id}&paid=1`,
      cancel_url: `${appUrl}/`,
      metadata: { request_id: request.id },
    })
    checkoutUrl = session.url
    paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    if (msg.includes('STRIPE_SECRET_KEY not set')) {
      console.warn('[confirm] Stripe not configured, simulating confirmation')
      checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007'}/success?id=${request.id}&paid=1`
    } else {
      console.error('[confirm] Stripe error:', msg)
      return NextResponse.json({ error: 'Payment link creation failed' }, { status: 500 })
    }
  }

  await updateRequest(request.id, {
    status: 'confirmed',
    stripe_payment_intent_id: paymentIntentId,
    matched_provider_ids: JSON.stringify(parsed.data.providerIds),
    admin_notes: parsed.data.notes || null,
  })

  return NextResponse.json({ ok: true, checkoutUrl })
}
