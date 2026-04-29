import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/db'

const KEY = 'skipthewait:au:provider-status'
const DATE_KEY = 'skipthewait:au:provider-status-date'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || auth !== `Bearer ${pw}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const redis = getRedis()
  const [statuses, dates] = await Promise.all([
    redis.hgetall(KEY),
    redis.hgetall(DATE_KEY),
  ])
  return NextResponse.json({ statuses: statuses || {}, dates: dates || {} })
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || auth !== `Bearer ${pw}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.providerId || body?.status === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const redis = getRedis()
  if (body.status === '') {
    await Promise.all([
      redis.hdel(KEY, body.providerId),
      redis.hdel(DATE_KEY, body.providerId),
    ])
  } else {
    const date = typeof body.updated_at === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(body.updated_at)
      ? body.updated_at
      : new Date().toISOString()
    await Promise.all([
      redis.hset(KEY, { [body.providerId]: body.status }),
      redis.hset(DATE_KEY, { [body.providerId]: date }),
    ])
  }
  return NextResponse.json({ ok: true })
}
