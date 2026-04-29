import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/db'

const KEY = 'skipthewait:au:provider-notes'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || auth !== `Bearer ${pw}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const redis = getRedis()
  const data = await redis.hgetall(KEY)
  return NextResponse.json({ notes: data || {} })
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || auth !== `Bearer ${pw}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body?.providerId) {
    return NextResponse.json({ error: 'Missing providerId' }, { status: 400 })
  }
  const redis = getRedis()
  const note = String(body.note || '').trim()
  if (note === '') {
    await redis.hdel(KEY, body.providerId)
  } else {
    await redis.hset(KEY, { [body.providerId]: note })
  }
  return NextResponse.json({ ok: true })
}
