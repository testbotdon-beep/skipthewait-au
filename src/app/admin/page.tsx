'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { formatAUD, formatPhone } from '@/lib/utils'

type Provider = {
  id: string
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

type Request = {
  id: string
  region: string
  condition_type: 'adhd' | 'autism' | 'both'
  child_age_band: 'under_5' | '5_to_12' | '13_to_17'
  referral_status: 'have_it' | 'need_help' | 'not_sure'
  urgency: 'within_4_weeks' | 'within_3_months' | 'flexible'
  budget_cap: 'under_1500' | '1500_to_2500' | '2500_plus'
  parent_name: string
  parent_phone: string | number
  parent_email: string
  notes: string | null
  referral_source: string | null
  status: string
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

const REGION_LABEL: Record<string, string> = {
  'Eastern Sydney': 'Eastern',
  'Inner West': 'Inner West',
  'Northern Beaches': 'Beaches',
  'North Shore': 'North',
  'Hills District': 'Hills',
  'Western Sydney': 'West',
  'South West Sydney': 'SW',
  'Sutherland Shire': 'Shire',
  'Sydney CBD': 'CBD',
  'Newcastle / Hunter': 'Newcastle',
  'Illawarra': 'Illawarra',
  'Central Coast': 'Coast',
  'Anywhere NSW': 'Anywhere',
}

const SPECIALTY_LABEL: Record<string, string> = {
  paediatrician: 'Paediatrician',
  child_psychiatrist: 'Child Psychiatrist',
  clinical_psychologist: 'Clinical Psychologist',
}

const CONDITION_LABEL: Record<string, string> = {
  adhd: 'ADHD',
  autism: 'Autism',
  both: 'ADHD + Autism',
}

const AGE_LABEL: Record<string, string> = {
  under_5: 'Under 5',
  '5_to_12': '5-12',
  '13_to_17': '13-17',
}

const REFERRAL_LABEL: Record<string, string> = {
  have_it: 'Has GP referral',
  need_help: 'Needs help with referral',
  not_sure: 'Skipping referral',
}

const URGENCY_LABEL: Record<string, string> = {
  within_4_weeks: 'Within 4 weeks',
  within_3_months: 'Within 3 months',
  flexible: 'Flexible',
}

const BUDGET_LABEL: Record<string, string> = {
  under_1500: 'Under A$1,500',
  '1500_to_2500': 'A$1,500 to A$2,500',
  '2500_plus': 'A$2,500+',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('skipthewait_au_admin_pw')
    if (stored) {
      setPassword(stored)
      setAuthenticated(true)
    }
  }, [])

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0a1628] grid place-items-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sessionStorage.setItem('skipthewait_au_admin_pw', password)
            setAuthenticated(true)
          }}
          className="bg-[#111d32] border border-white/10 rounded-2xl p-8 shadow-lg shadow-black/20 w-full max-w-sm space-y-4"
        >
          <h1 className="text-xl font-bold text-white">SkipTheWait NSW · Admin</h1>
          <input
            type="password"
            required
            className="w-full px-4 py-3 bg-[#0a1628] border border-white/10 rounded-xl text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-cta w-full">Enter</button>
        </form>
      </main>
    )
  }

  return <Dashboard password={password} onLogout={() => { sessionStorage.removeItem('skipthewait_au_admin_pw'); setAuthenticated(false) }} />
}

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [requests, setRequests] = useState<Request[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'requests' | 'providers'>('requests')
  const [filter, setFilter] = useState<'active' | 'confirmed' | 'completed' | 'all'>('active')
  const [regionFilter, setRegionFilter] = useState<string>('ALL')
  const [contactStatus, setContactStatus] = useState<Record<string, string>>({})
  const [contactDates, setContactDates] = useState<Record<string, string>>({})
  const [providerNotes, setProviderNotes] = useState<Record<string, string>>({})

  const loadStatuses = useCallback(async () => {
    try {
      const [statusRes, notesRes] = await Promise.all([
        fetch('/api/admin/contact-status', { headers: { Authorization: `Bearer ${password}` } }),
        fetch('/api/admin/provider-notes', { headers: { Authorization: `Bearer ${password}` } }),
      ])
      const statusData = await statusRes.json()
      const notesData = await notesRes.json()
      setContactStatus(statusData.statuses || {})
      setContactDates(statusData.dates || {})
      setProviderNotes(notesData.notes || {})
    } catch {}
  }, [password])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/list', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (res.status === 401) { onLogout(); return }
      const data = await res.json()
      setRequests(data.requests || [])
      setProviders(data.providers || [])
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }, [password, onLogout])

  useEffect(() => {
    load()
    loadStatuses()
    const interval = setInterval(() => { load(); loadStatuses() }, 30000)
    return () => clearInterval(interval)
  }, [load, loadStatuses])

  async function updateProviderNote(providerId: string, note: string) {
    const next = { ...providerNotes }
    if (note.trim() === '') delete next[providerId]
    else next[providerId] = note
    setProviderNotes(next)
    fetch('/api/admin/provider-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      body: JSON.stringify({ providerId, note }),
    }).catch(() => {})
  }

  async function updateContactStatus(providerId: string, status: string) {
    const next = { ...contactStatus }
    const nextDates = { ...contactDates }
    if (status === '') {
      delete next[providerId]
      delete nextDates[providerId]
    } else {
      next[providerId] = status
      nextDates[providerId] = new Date().toISOString()
    }
    setContactStatus(next)
    setContactDates(nextDates)
    fetch('/api/admin/contact-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      body: JSON.stringify({ providerId, status }),
    }).catch(() => {})
  }

  const filteredRequests = useMemo(() => {
    const activeStatuses = ['submitted', 'pending']
    const confirmedStatuses = ['confirmed']
    const completedStatuses = ['captured', 'delivered', 'voided']
    let list = requests
    if (filter === 'active') list = list.filter((r) => activeStatuses.includes(r.status))
    if (filter === 'confirmed') list = list.filter((r) => confirmedStatuses.includes(r.status))
    if (filter === 'completed') list = list.filter((r) => completedStatuses.includes(r.status))
    if (regionFilter !== 'ALL') list = list.filter((r) => r.region === regionFilter)
    return list
  }, [requests, filter, regionFilter])

  const earnings = useMemo(() => {
    return requests
      .filter((r) => r.status === 'delivered' || r.status === 'captured')
      .filter((r) => !r.admin_notes || !r.admin_notes.toLowerCase().includes('closed without match'))
      .reduce((sum, r) => sum + (Number(r.amount_cents) || 2900), 0)
  }, [requests])

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">SkipTheWait NSW · Admin</h1>
            <div className="text-xs text-slate-400 mt-0.5">
              Earned: <span className="font-semibold text-emerald-400">{formatAUD(earnings)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { load(); loadStatuses() }} className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">Refresh</button>
            <button onClick={onLogout} className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">Sign out</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
          <TabButton active={tab === 'requests'} onClick={() => setTab('requests')}>
            Requests <span className="ml-1.5 text-[10px] text-slate-400">({requests.length})</span>
          </TabButton>
          <TabButton active={tab === 'providers'} onClick={() => setTab('providers')}>
            Providers <span className="ml-1.5 text-[10px] text-slate-400">({providers.length})</span>
          </TabButton>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading && <div className="text-slate-500 text-sm">Loading...</div>}
        {!loading && tab === 'requests' && (
          <RequestsView
            requests={filteredRequests}
            providers={providers}
            password={password}
            filter={filter}
            setFilter={setFilter}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            allRequests={requests}
            contactStatus={contactStatus}
            updateContactStatus={updateContactStatus}
            providerNotes={providerNotes}
            onActionComplete={load}
          />
        )}
        {!loading && tab === 'providers' && (
          <ProvidersView
            providers={providers}
            contactStatus={contactStatus}
            contactDates={contactDates}
            providerNotes={providerNotes}
            updateContactStatus={updateContactStatus}
            updateProviderNote={updateProviderNote}
          />
        )}
      </div>
    </main>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-emerald-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function RequestsView({
  requests,
  providers,
  password,
  filter,
  setFilter,
  regionFilter,
  setRegionFilter,
  allRequests,
  contactStatus,
  updateContactStatus,
  providerNotes,
  onActionComplete,
}: {
  requests: Request[]
  providers: Provider[]
  password: string
  filter: 'active' | 'confirmed' | 'completed' | 'all'
  setFilter: (f: 'active' | 'confirmed' | 'completed' | 'all') => void
  regionFilter: string
  setRegionFilter: (r: string) => void
  allRequests: Request[]
  contactStatus: Record<string, string>
  updateContactStatus: (id: string, status: string) => void
  providerNotes: Record<string, string>
  onActionComplete: () => void
}) {
  const regions = useMemo(() => Array.from(new Set(allRequests.map((r) => r.region))).sort(), [allRequests])

  const counts = useMemo(() => ({
    active: allRequests.filter((r) => ['submitted', 'pending'].includes(r.status)).length,
    confirmed: allRequests.filter((r) => r.status === 'confirmed').length,
    completed: allRequests.filter((r) => ['captured', 'delivered', 'voided'].includes(r.status)).length,
    all: allRequests.length,
  }), [allRequests])

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <FilterPill active={filter === 'active'} onClick={() => setFilter('active')}>Active <span className="ml-1.5 text-[10px] opacity-60">{counts.active}</span></FilterPill>
        <FilterPill active={filter === 'confirmed'} onClick={() => setFilter('confirmed')}>Confirmed <span className="ml-1.5 text-[10px] opacity-60">{counts.confirmed}</span></FilterPill>
        <FilterPill active={filter === 'completed'} onClick={() => setFilter('completed')}>Completed <span className="ml-1.5 text-[10px] opacity-60">{counts.completed}</span></FilterPill>
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>All <span className="ml-1.5 text-[10px] opacity-60">{counts.all}</span></FilterPill>
        <div className="flex-1" />
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white"
        >
          <option value="ALL">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {requests.length === 0 ? (
        <div className="text-slate-500 text-sm py-12 text-center bg-white/[0.02] rounded-xl border border-white/5">
          No requests in this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              providers={providers}
              password={password}
              contactStatus={contactStatus}
              updateContactStatus={updateContactStatus}
              providerNotes={providerNotes}
              onActionComplete={onActionComplete}
            />
          ))}
        </div>
      )}
    </>
  )
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
        active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}

function RequestCard({
  request,
  providers,
  password,
  contactStatus,
  updateContactStatus,
  providerNotes,
  onActionComplete,
}: {
  request: Request
  providers: Provider[]
  password: string
  contactStatus: Record<string, string>
  updateContactStatus: (id: string, status: string) => void
  providerNotes: Record<string, string>
  onActionComplete: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState(false)

  const matched = useMemo(() => {
    if (request.matched_provider_ids) {
      try {
        const ids = JSON.parse(request.matched_provider_ids) as string[]
        return providers.filter((p) => ids.includes(p.id))
      } catch { return [] }
    }
    return []
  }, [request.matched_provider_ids, providers])

  const candidates = useMemo(() => {
    return providers.filter((p) => {
      if (request.region !== 'Anywhere NSW' && p.region !== request.region) return false
      if (request.condition_type === 'adhd' && !p.treats_adhd) return false
      if (request.condition_type === 'autism' && !p.treats_autism) return false
      if (request.condition_type === 'both' && !(p.treats_adhd && p.treats_autism)) return false
      const budgetMax = request.budget_cap === 'under_1500' ? 1500 : request.budget_cap === '1500_to_2500' ? 2500 : 99999
      if (p.typical_fee_aud > budgetMax) return false
      if (request.referral_status === 'not_sure' && p.requires_referral) return false
      return true
    })
  }, [providers, request])

  const submittedAt = new Date(request.created_at)
  const ageMs = Date.now() - submittedAt.getTime()
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60))
  const ageLabel = ageHours < 24 ? `${ageHours}h ago` : `${Math.floor(ageHours / 24)}d ago`

  const statusColor = {
    submitted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    confirmed: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    delivered: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    captured: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    voided: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  }[request.status] || 'bg-slate-500/20 text-slate-300 border-slate-500/30'

  async function confirmMatch() {
    if (selectedProviderIds.length === 0) {
      toast.error('Pick at least one provider first')
      return
    }
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify({ requestId: request.id, providerIds: selectedProviderIds }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      if (data.checkoutUrl) {
        await navigator.clipboard.writeText(data.checkoutUrl)
        toast.success('Stripe link copied. Send to parent via SMS or WhatsApp.')
      } else {
        toast.success('Confirmed (Stripe not configured, simulated).')
      }
      onActionComplete()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function markDelivered() {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify({ requestId: request.id, providerIds: matched.map((p) => p.id) }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Marked delivered.')
      onActionComplete()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function markVoided() {
    if (!confirm('Mark as no match found / cancel? Stripe hold (if any) will be voided.')) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify({ requestId: request.id }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Voided.')
      onActionComplete()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function reopen() {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/reopen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify({ requestId: request.id }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Reopened.')
      onActionComplete()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(false)
    }
  }

  const isActive = ['submitted', 'pending'].includes(request.status)
  const isConfirmed = request.status === 'confirmed'

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border ${statusColor}`}>
              {request.status}
            </span>
            <span className="text-[11px] text-slate-500">{ageLabel}</span>
            <span className="text-[11px] text-slate-500">via {request.referral_source || 'unknown'}</span>
          </div>
          <h3 className="text-base font-semibold text-white">
            {request.parent_name} <span className="text-slate-500 text-sm font-normal">· {formatPhone(request.parent_phone)}</span>
          </h3>
          <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-3 gap-y-1">
            <span>{REGION_LABEL[request.region] || request.region}</span>
            <span>{CONDITION_LABEL[request.condition_type]}</span>
            <span>Age {AGE_LABEL[request.child_age_band]}</span>
            <span>{URGENCY_LABEL[request.urgency]}</span>
            <span>{BUDGET_LABEL[request.budget_cap]}</span>
            <span>{REFERRAL_LABEL[request.referral_status]}</span>
          </div>
          {request.notes && (
            <div className="mt-2 text-xs text-slate-300 bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
              <span className="text-slate-500 font-medium uppercase text-[10px] tracking-wider mr-2">Note</span>
              {request.notes}
            </div>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 shrink-0"
        >
          {expanded ? 'Collapse' : `Match (${candidates.length})`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-white/5 p-4 bg-black/20">
          {isActive && (
            <>
              <div className="text-xs text-slate-400 mb-3 font-medium">
                Candidates matching this request — pick 2 or 3 to message:
              </div>
              <div className="space-y-2 mb-4">
                {candidates.length === 0 && (
                  <div className="text-sm text-slate-500 italic">No providers in this region match the criteria. Suggest expanding to Anywhere NSW or higher budget.</div>
                )}
                {candidates.map((p) => {
                  const status = contactStatus[p.id] || ''
                  const selected = selectedProviderIds.includes(p.id)
                  const waMessage = encodeURIComponent(
                    `Hi ${p.name}, I'm reaching out from SkipTheWait NSW on behalf of a parent looking for an ${CONDITION_LABEL[request.condition_type].toLowerCase()} assessment for their ${AGE_LABEL[request.child_age_band].toLowerCase()} year old in ${request.region}. Are you taking new patients within the next ${request.urgency === 'within_4_weeks' ? '4 weeks' : request.urgency === 'within_3_months' ? '3 months' : 'few months'}? If yes, can I pass them your contact?`
                  )
                  const waLink = `https://wa.me/${p.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`
                  return (
                    <div key={p.id} className={`p-3 rounded-lg border ${selected ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {
                            setSelectedProviderIds((prev) =>
                              prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
                            )
                          }}
                          className="mt-1 h-4 w-4 accent-emerald-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">{p.name}</span>
                            <span className="text-xs text-slate-500">· {p.practice}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                            <span>{SPECIALTY_LABEL[p.specialty]}</span>
                            <span>{p.suburb}</span>
                            <span>~A${p.typical_fee_aud}</span>
                            {p.requires_referral && <span className="text-amber-300">GP referral required</span>}
                          </div>
                          {p.notes && <div className="text-[11px] text-slate-500 mt-1.5">{p.notes}</div>}
                          {providerNotes[p.id] && (
                            <div className="text-[11px] text-emerald-300 mt-1.5">Note: {providerNotes[p.id]}</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener"
                            className="px-2.5 py-1 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300"
                          >
                            WhatsApp
                          </a>
                          <select
                            value={status}
                            onChange={(e) => updateContactStatus(p.id, e.target.value)}
                            className="px-2 py-1 text-[10px] rounded bg-white/5 border border-white/10 text-white"
                          >
                            <option value="">Status</option>
                            <option value="sent">Sent</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="no_reply">No reply</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={confirmMatch}
                  disabled={actionLoading || selectedProviderIds.length === 0}
                  className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm match, get Stripe link ({selectedProviderIds.length})
                </button>
                <button
                  onClick={markVoided}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
                >
                  No match found
                </button>
              </div>
            </>
          )}

          {isConfirmed && (
            <>
              <div className="text-xs text-slate-400 mb-3 font-medium">Awaiting parent payment. Matched providers:</div>
              <div className="space-y-2 mb-4">
                {matched.map((p) => (
                  <ProviderRow key={p.id} provider={p} />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={markDelivered}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Mark paid + delivered
                </button>
                <button
                  onClick={markVoided}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
                >
                  Cancel match
                </button>
              </div>
            </>
          )}

          {!isActive && !isConfirmed && (
            <>
              <div className="text-xs text-slate-400 mb-3 font-medium">Final status. Matched providers:</div>
              <div className="space-y-2 mb-4">
                {matched.length === 0 && <div className="text-sm text-slate-500 italic">No providers were matched.</div>}
                {matched.map((p) => (
                  <ProviderRow key={p.id} provider={p} />
                ))}
              </div>
              {request.admin_notes && (
                <div className="text-xs text-slate-400 mb-3 italic">Note: {request.admin_notes}</div>
              )}
              <button
                onClick={reopen}
                disabled={actionLoading}
                className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
              >
                Reopen
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ProviderRow({ provider }: { provider: Provider }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
      <div className="font-semibold text-white text-sm">{provider.name}</div>
      <div className="text-xs text-slate-400 mt-0.5">
        {SPECIALTY_LABEL[provider.specialty]} · {provider.practice} · {provider.suburb} · {formatPhone(provider.phone)} · ~A${provider.typical_fee_aud}
      </div>
    </div>
  )
}

function ProvidersView({
  providers,
  contactStatus,
  contactDates,
  providerNotes,
  updateContactStatus,
  updateProviderNote,
}: {
  providers: Provider[]
  contactStatus: Record<string, string>
  contactDates: Record<string, string>
  providerNotes: Record<string, string>
  updateContactStatus: (id: string, status: string) => void
  updateProviderNote: (id: string, note: string) => void
}) {
  const [region, setRegion] = useState<string>('ALL')
  const [specialty, setSpecialty] = useState<string>('ALL')

  const regions = useMemo(() => Array.from(new Set(providers.map((p) => p.region))).sort(), [providers])
  const specialties = useMemo(() => Array.from(new Set(providers.map((p) => p.specialty))).sort(), [providers])

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      if (region !== 'ALL' && p.region !== region) return false
      if (specialty !== 'ALL' && p.specialty !== specialty) return false
      return true
    })
  }, [providers, region, specialty])

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-5">
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white">
          <option value="ALL">All regions</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white">
          <option value="ALL">All specialties</option>
          {specialties.map((s) => <option key={s} value={s}>{SPECIALTY_LABEL[s]}</option>)}
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((p) => {
          const status = contactStatus[p.id] || ''
          const dateStr = contactDates[p.id] ? new Date(contactDates[p.id]).toLocaleDateString('en-AU') : ''
          return (
            <div key={p.id} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {SPECIALTY_LABEL[p.specialty]} · {p.practice}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {p.suburb} ({p.region}) · {formatPhone(p.phone)} · ~A${p.typical_fee_aud}
                  </div>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {p.treats_adhd && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">ADHD</span>}
                    {p.treats_autism && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">Autism</span>}
                    {p.requires_referral && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">GP referral</span>}
                  </div>
                  {p.notes && <div className="text-[11px] text-slate-500 mt-2">{p.notes}</div>}
                </div>
                <select
                  value={status}
                  onChange={(e) => updateContactStatus(p.id, e.target.value)}
                  className="px-2 py-1 text-[10px] rounded bg-white/5 border border-white/10 text-white shrink-0"
                >
                  <option value="">Status</option>
                  <option value="sent">Sent</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="no_reply">No reply</option>
                </select>
              </div>
              {dateStr && <div className="text-[10px] text-slate-600 mt-1">Last contacted {dateStr}</div>}
              <div className="mt-2">
                <input
                  type="text"
                  defaultValue={providerNotes[p.id] || ''}
                  onBlur={(e) => updateProviderNote(p.id, e.target.value)}
                  placeholder="Internal note (optional)"
                  className="w-full text-[11px] px-2 py-1.5 rounded bg-white/[0.02] border border-white/5 text-slate-300 placeholder-slate-600 outline-none focus:border-white/20"
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
