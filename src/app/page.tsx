import { RequestForm } from '@/components/RequestForm'
import { LogoFull } from '@/components/Logo'
import { UniqAttribution } from '@/components/UniqAttribution'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <DataBadge />
      <HowItWorks />
      <ProblemSection />
      <FormSection />
      <TrustStrip />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100/80">
      <div className="container-page flex items-center justify-between h-16">
        <Link href="/">
          <LogoFull region="NSW" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-500">
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          <a href="#get-started" className="btn-primary text-[13px] py-2.5 px-5">
            Find a slot
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28 relative overflow-hidden bg-[#0a1628]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.1),transparent_70%)]" />

      <div className="container-page relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Matching NSW parents with paediatricians right now
          </div>

          <h1 className="heading-display text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] text-white mb-6 text-balance leading-[1.08]">
            Skip the 18 month
            <br className="hidden sm:block" />
            wait for an assessment.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Tell us your area, your child&apos;s age, and what you need.
            We personally call paediatricians, child psychiatrists and clinical psychologists across NSW
            and find one with a free assessment slot.
          </p>

          <a href="#get-started" className="btn-cta text-base inline-flex">
            Find My Child a Slot
          </a>

          <div className="flex items-center justify-center gap-6 mt-8 text-[13px] text-slate-500 font-medium">
            <span>Free to submit</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>Pay only if we match you</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function DataBadge() {
  return (
    <section className="py-5 border-b border-slate-100">
      <div className="container-page flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          <span>AHPRA verified providers</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>NSW only, all regions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span>ADHD and autism focus</span>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="section-label justify-center mb-4">How it works</div>
          <h2 className="heading-section text-3xl md:text-[2.5rem] text-slate-900 text-balance">
            Three steps. No risk.
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5 mb-16">
          <StepCard
            n="01"
            title="You tell us what you need"
            desc="30 seconds. Your area, your child's age, ADHD or autism, GP referral status, your timeline. Free to submit."
            accent="from-emerald-500/10 to-emerald-500/0"
          />
          <StepCard
            n="02"
            title="We do the calling"
            desc="We work through verified NSW paediatricians, child psychiatrists and clinical psychologists. We message and call until we find one with a real opening that fits your criteria."
            accent="from-blue-500/10 to-blue-500/0"
          />
          <StepCard
            n="03"
            title="You pay, we hand off"
            desc="When we have a confirmed match, we send a A$29 payment link by SMS. You pay, we send their name, practice, contact details and any GP referral instructions. You book direct."
            accent="from-violet-500/10 to-violet-500/0"
          />
        </div>

        <div className="max-w-2xl mx-auto relative p-6 md:p-8 rounded-2xl bg-white border border-emerald-100 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl" />
          <div className="flex items-start gap-5 pl-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 grid place-items-center shrink-0">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1.5">What if you can&apos;t find anyone?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Then you don&apos;t pay. The A$29 payment link only goes out after we have a confirmed match.
                If we cannot find one within 7 days, we tell you and <strong className="text-slate-700">you spend nothing</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({ n, title, desc, accent }: { n: string; title: string; desc: string; accent: string }) {
  return (
    <div className="relative">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${accent}`} />
      <div className="relative p-7 rounded-2xl bg-white border border-slate-200/60 h-full">
        <span className="text-xs font-mono font-bold text-emerald-600 tracking-wider">{n}</span>
        <h3 className="font-bold text-slate-900 mt-3 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function ProblemSection() {
  const problems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: 'Most have closed books',
      desc: 'Around a third of NSW paediatricians have closed their lists. The good ones are full. The ones taking new patients often have a 6 month waitlist of their own.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Public wait is 12 to 18 months',
      desc: 'NSW has roughly 7 paediatricians per 100,000 people. The public system is a year and a half deep, and the press has called it a "crisis point."',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v4H3zM3 11h18v4H3zM3 19h18v2H3z" />
        </svg>
      ),
      title: 'Nobody publishes their availability',
      desc: 'AHPRA tells you who is registered. It does not tell you who has a free slot in 4 weeks. That phone call is the actual job, and it takes a Saturday.',
    },
  ]
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="section-label justify-center mb-4">Why it&apos;s hard</div>
          <h2 className="heading-section text-3xl md:text-[2.5rem] text-slate-900 mb-5 text-balance">
            This is why you&apos;ve been cold-calling for weeks.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {problems.map((p) => (
            <div
              key={p.title}
              className="group p-7 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-400 grid place-items-center mb-5 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
                {p.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FormSection() {
  return (
    <section id="get-started" className="py-24">
      <div className="container-page">
        <div className="max-w-xl mx-auto text-center mb-12">
          <div className="section-label justify-center mb-4">Get matched</div>
          <h2 className="heading-section text-3xl md:text-[2.5rem] text-slate-900 mb-4">
            Tell us about your child
          </h2>
          <p className="text-slate-500 text-lg">
            30 seconds. Free to submit. We respond within 7 days.
          </p>
        </div>
        <RequestForm />
      </div>
    </section>
  )
}

function TrustStrip() {
  return (
    <section className="py-16 bg-slate-900">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <TrustStat value="A$29" label="Only after we match you" color="emerald" />
          <TrustStat value="7 days" label="Response time" color="white" />
          <TrustStat value="A$0" label="If we can&apos;t match you" color="white" />
          <TrustStat value="NSW" label="All regions covered" color="emerald" />
        </div>
      </div>
    </section>
  )
}

function TrustStat({ value, label, color }: { value: string; label: string; color: 'emerald' | 'white' }) {
  return (
    <div className="text-center">
      <div className={`text-3xl md:text-4xl font-extrabold tracking-tight ${color === 'emerald' ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-sm text-slate-400 mt-1.5 font-medium">{label}</div>
    </div>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: 'When exactly do I pay?',
      a: 'Not when you submit. You pay only after we have a confirmed match. We send a A$29 payment link by SMS or WhatsApp once a paediatrician, child psychiatrist or clinical psychologist has said yes to your timeline. If we cannot find one in 7 days, you pay nothing.',
    },
    {
      q: 'How do I get the match details?',
      a: 'After payment, we send the practitioner\'s name, practice address, phone number, typical fee, and any specific instructions for the GP referral. You book direct from there.',
    },
    {
      q: 'What if I do not like the match?',
      a: 'The A$29 covers the calls and matching work. If you genuinely feel we sent a poor match (wrong specialty, wrong area, wrong condition focus), reach out within 7 days and we will run a second round at no extra cost.',
    },
    {
      q: 'Do you cover the whole of NSW?',
      a: 'Yes. We cover Greater Sydney plus Newcastle, the Hunter, the Central Coast, the Illawarra and Wollongong. If you are anywhere else in NSW and want a regional referral, write it in the notes and we will check.',
    },
    {
      q: 'What conditions do you cover?',
      a: 'Paediatric ADHD and autism assessments. We focus here because the wait list crisis is sharpest in these two. We do not currently match for dyslexia, learning difficulties, or speech / OT (different supply pool).',
    },
    {
      q: 'Do I need a GP referral?',
      a: 'For paediatricians and psychiatrists, yes. For clinical psychologists, no. If you do not have one, we can still match you to a clinical psychologist for the assessment, and we will tell you what to ask your GP for if Medicare rebates matter.',
    },
    {
      q: 'How is this different from Healthengine or HotDoc?',
      a: 'Those are booking apps for clinics that have already published their availability. The problem is that most NSW paediatricians and psychiatrists have closed lists or do not publish. We pick up the phone, ask, and only match you when someone has actually said yes.',
    },
    {
      q: 'Is my child\'s data safe?',
      a: 'We only share your first name and contact number with the matched practitioner so they can confirm the booking. We never sell data, never spam, and delete records on request. Privacy first.',
    },
  ]
  return (
    <section id="faq" className="py-24 bg-slate-50/50">
      <div className="container-page max-w-3xl">
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-4">FAQ</div>
          <h2 className="heading-section text-3xl md:text-[2.5rem] text-slate-900">
            Questions, answered
          </h2>
        </div>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-xl bg-white border border-slate-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer select-none hover:bg-slate-50 transition-colors">
                <span className="font-semibold text-slate-900 text-[15px] pr-4">{f.q}</span>
                <span className="shrink-0 h-6 w-6 rounded-full border border-slate-200 grid place-items-center text-slate-400 group-open:bg-slate-900 group-open:border-slate-900 group-open:text-white transition-all duration-200">
                  <svg className="w-3 h-3 group-open:rotate-45 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 12 12">
                    <line x1="6" y1="2" x2="6" y2="10" />
                    <line x1="2" y1="6" x2="10" y2="6" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm text-slate-500 leading-relaxed">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-section text-3xl md:text-[2.5rem] text-slate-900 mb-5 text-balance">
            Stop spending Saturday on hold.
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">
            We do the calling. You get a match. 30 second form, free to submit, A$29 only if we find you a slot.
          </p>
          <a href="#get-started" className="btn-primary btn-cta text-base">
            Find My Child a Slot
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/50">
      <div className="container-page py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <LogoFull region="NSW" />
            <p className="text-sm text-slate-400 mt-3 max-w-xs">
              Concierge matching for NSW paediatric ADHD and autism assessments.
              We call until we find a slot.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <div className="font-semibold text-slate-900 mb-3">Product</div>
              <div className="space-y-2 text-slate-500">
                <a href="#how-it-works" className="block hover:text-slate-900 transition-colors">How it works</a>
                <a href="#faq" className="block hover:text-slate-900 transition-colors">FAQ</a>
                <a href="#get-started" className="block hover:text-slate-900 transition-colors">Find a slot</a>
              </div>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-3">Legal</div>
              <div className="space-y-2 text-slate-500">
                <Link href="/terms" className="block hover:text-slate-900 transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="block hover:text-slate-900 transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} SkipTheWait NSW.</span>
            <UniqAttribution />
          </div>
          <div>Not affiliated with AHPRA, Medicare, NDIS or any clinic. Concierge service only.</div>
        </div>
      </div>
    </footer>
  )
}
