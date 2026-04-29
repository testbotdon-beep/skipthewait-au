'use client'

import { useState } from 'react'
import { toast } from 'sonner'

type FormState = {
  region: string
  condition_type: string
  child_age_band: string
  referral_status: string
  urgency: string
  budget_cap: string
  parent_name: string
  parent_phone: string
  parent_email: string
  notes: string
  referral_source: string
}

const INITIAL: FormState = {
  region: '',
  condition_type: '',
  child_age_band: '',
  referral_status: '',
  urgency: '',
  budget_cap: '',
  parent_name: '',
  parent_phone: '',
  parent_email: '',
  notes: '',
  referral_source: '',
}

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
]

const REFERRAL_OPTIONS = [
  'TikTok',
  'Instagram',
  'Facebook',
  'Google',
  'Reddit',
  'Friend',
  'Mum group',
  'Other',
]

export function RequestForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (!agreed) {
      toast.error('Please agree to the Terms of Service and Privacy Policy first.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      window.location.href = `/success?id=${data.requestId}`
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 20px 60px -12px rgba(10,22,40,0.08)' }}
    >
      <div className="p-6 md:p-8 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Your area" required>
            <select
              required
              className="input-field"
              value={form.region}
              onChange={(e) => update('region', e.target.value)}
            >
              <option value="">Choose an area</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>

          <Field label="Assessment needed" required>
            <select
              required
              className="input-field"
              value={form.condition_type}
              onChange={(e) => update('condition_type', e.target.value)}
            >
              <option value="">Choose</option>
              <option value="adhd">ADHD assessment</option>
              <option value="autism">Autism assessment</option>
              <option value="both">ADHD and autism</option>
            </select>
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Your child's age" required>
            <select
              required
              className="input-field"
              value={form.child_age_band}
              onChange={(e) => update('child_age_band', e.target.value)}
            >
              <option value="">Choose</option>
              <option value="under_5">Under 5</option>
              <option value="5_to_12">5 to 12</option>
              <option value="13_to_17">13 to 17</option>
            </select>
          </Field>

          <Field label="GP referral?" required>
            <select
              required
              className="input-field"
              value={form.referral_status}
              onChange={(e) => update('referral_status', e.target.value)}
            >
              <option value="">Choose</option>
              <option value="have_it">I have one</option>
              <option value="need_help">I need help getting one</option>
              <option value="not_sure">Not sure / want to skip it</option>
            </select>
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="How soon?" required>
            <select
              required
              className="input-field"
              value={form.urgency}
              onChange={(e) => update('urgency', e.target.value)}
            >
              <option value="">Choose</option>
              <option value="within_4_weeks">Within 4 weeks</option>
              <option value="within_3_months">Within 3 months</option>
              <option value="flexible">Flexible</option>
            </select>
          </Field>

          <Field label="Budget per session" required>
            <select
              required
              className="input-field"
              value={form.budget_cap}
              onChange={(e) => update('budget_cap', e.target.value)}
            >
              <option value="">Choose</option>
              <option value="under_1500">Under A$1,500</option>
              <option value="1500_to_2500">A$1,500 to A$2,500</option>
              <option value="2500_plus">A$2,500+</option>
            </select>
          </Field>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Your name" required>
            <input
              required
              type="text"
              className="input-field"
              placeholder="Sarah"
              value={form.parent_name}
              onChange={(e) => update('parent_name', e.target.value)}
            />
          </Field>

          <Field label="Your mobile" required>
            <input
              required
              type="tel"
              className="input-field"
              placeholder="0412 345 678"
              value={form.parent_phone}
              onChange={(e) => update('parent_phone', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Email" required>
          <input
            required
            type="email"
            className="input-field"
            placeholder="you@email.com"
            value={form.parent_email}
            onChange={(e) => update('parent_email', e.target.value)}
          />
        </Field>

        <Field label="How did you hear about us?" required>
          <select
            required
            className="input-field"
            value={form.referral_source}
            onChange={(e) => update('referral_source', e.target.value)}
          >
            <option value="" disabled>Select one</option>
            {REFERRAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </Field>

        <Field label="Anything else? (optional)">
          <textarea
            className="input-field min-h-[80px] resize-none"
            placeholder="School concerns, prior diagnoses, gender preference for the practitioner, accessibility needs, anything that helps us match better."
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
          <p className="text-[11px] text-slate-400 mt-1">
            We'll do our best to accommodate your preferences but can't guarantee every request. Our matching is based on area, condition, age and availability.
          </p>
        </Field>
      </div>

      <div className="bg-slate-50/80 border-t border-slate-100 px-6 md:px-8 py-5 space-y-4">
        <label className="flex items-start gap-2.5 text-[13px] text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
          />
          <span>
            I agree to the{' '}
            <a href="/terms" target="_blank" className="text-emerald-700 font-medium hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" target="_blank" className="text-emerald-700 font-medium hover:underline">Privacy Policy</a>.
          </span>
        </label>
        <button
          type="submit"
          disabled={loading || !agreed}
          className="btn-primary btn-cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Submitting...
            </span>
          ) : (
            'Find My Child a Slot (free to submit)'
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
          <span>No payment required to submit</span>
          <span>We respond within 7 days</span>
          <span>Privacy first</span>
        </div>
      </div>
    </form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-emerald-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
