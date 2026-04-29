import { Redis } from '@upstash/redis'
import { readFileSync } from 'fs'
import path from 'path'

let _redis: Redis | null = null

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set')
    }
    _redis = new Redis({ url, token })
  }
  return _redis
}

let _providers: Provider[] | null = null

export function getProviders(): Provider[] {
  if (!_providers) {
    const jsonPath = path.join(process.cwd(), 'data', 'nsw-paediatricians.json')
    const raw = JSON.parse(readFileSync(jsonPath, 'utf-8')) as RawProvider[]
    _providers = raw.map((p) => ({
      ...p,
      id: slugify(p.region, p.specialty, p.name),
      is_active: 1,
    }))
  }
  return _providers
}

function slugify(region: string, specialty: string, name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const regionSlug = region.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return `${regionSlug}-${specialty}-${slug}`
}

interface RawProvider {
  name: string
  practice: string
  phone: string
  email: string
  region: string
  suburb: string
  specialty: 'paediatrician' | 'child_psychiatrist' | 'clinical_psychologist'
  treats_adhd: boolean
  treats_autism: boolean
  typical_fee_aud: number
  requires_referral: boolean
  notes: string
}

export interface Provider extends RawProvider {
  id: string
  is_active: number
}

export type RequestStatus =
  | 'submitted'
  | 'confirmed'
  | 'pending'
  | 'delivered'
  | 'failed'
  | 'voided'
  | 'captured'

export type ConditionType = 'adhd' | 'autism' | 'both'
export type AgeBand = 'under_5' | '5_to_12' | '13_to_17'
export type ReferralStatus = 'have_it' | 'need_help' | 'not_sure'
export type Urgency = 'within_4_weeks' | 'within_3_months' | 'flexible'
export type BudgetCap = 'under_1500' | '1500_to_2500' | '2500_plus'

export interface MatchRequest {
  id: string
  region: string
  condition_type: ConditionType
  child_age_band: AgeBand
  referral_status: ReferralStatus
  urgency: Urgency
  budget_cap: BudgetCap
  parent_name: string
  parent_phone: string
  parent_email: string
  notes: string | null
  referral_source: string | null
  status: RequestStatus
  stripe_payment_intent_id: string | null
  amount_cents: number
  matched_provider_ids: string | null
  admin_notes: string | null
  created_at: string
  deadline_at: string
  delivered_at: string | null
  voided_at: string | null
  captured_at: string | null
}

const REQUEST_PREFIX = 'skipthewait:au:req:'
const REQUEST_LIST_KEY = 'skipthewait:au:requests'

export async function createRequest(req: MatchRequest): Promise<void> {
  const redis = getRedis()
  await redis.hset(`${REQUEST_PREFIX}${req.id}`, req as unknown as Record<string, unknown>)
  await redis.lpush(REQUEST_LIST_KEY, req.id)
}

export async function getRequest(id: string): Promise<MatchRequest | null> {
  const redis = getRedis()
  const data = await redis.hgetall(`${REQUEST_PREFIX}${id}`)
  if (!data || Object.keys(data).length === 0) return null
  return data as unknown as MatchRequest
}

export async function updateRequest(id: string, fields: Partial<MatchRequest>): Promise<void> {
  const redis = getRedis()
  await redis.hset(`${REQUEST_PREFIX}${id}`, fields as unknown as Record<string, unknown>)
}

export async function listRequests(limit = 200): Promise<MatchRequest[]> {
  const redis = getRedis()
  const ids = await redis.lrange(REQUEST_LIST_KEY, 0, limit - 1)
  if (!ids || ids.length === 0) return []

  const pipeline = redis.pipeline()
  for (const id of ids) {
    pipeline.hgetall(`${REQUEST_PREFIX}${id}`)
  }
  const results = await pipeline.exec()
  return (results as unknown[])
    .filter((r): r is Record<string, unknown> => r !== null && typeof r === 'object' && Object.keys(r as object).length > 0)
    .map((r) => r as unknown as MatchRequest)
}

export async function listRequestsByStatus(status: string): Promise<MatchRequest[]> {
  const all = await listRequests()
  return all.filter((r) => r.status === status)
}
