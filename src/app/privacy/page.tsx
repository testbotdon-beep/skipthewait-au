import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-page max-w-3xl py-16">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">Back</Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-6 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString('en-AU')}</p>

        <div className="space-y-6 text-slate-700">
          <Section title="1. Who we are">
            SkipTheWait NSW is operated by Uniq Labs Pte. Ltd., Singapore. This Privacy Policy describes how we
            collect, use, and share your personal data. We aim to comply with the Australian Privacy Principles
            under the Privacy Act 1988 (Cth) and Singapore&apos;s Personal Data Protection Act (PDPA).
          </Section>

          <Section title="2. What we collect">
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Request data:</strong> your name, mobile number, email address, child&apos;s age band,
              area, condition (ADHD or autism), GP referral status, urgency, budget, and any notes you provide.</li>
              <li><strong>Payment data:</strong> processed via Stripe. We do not store card numbers or
              bank account details.</li>
              <li><strong>Technical data:</strong> IP address, browser, and device info via standard server logs
              and Vercel Analytics.</li>
            </ul>
          </Section>

          <Section title="3. Sensitive information">
            We treat the fact that you are seeking a paediatric ADHD or autism assessment as sensitive
            information. We collect it only with your consent (by submitting the form) and use it solely to match
            you to a relevant practitioner. We do not collect formal diagnostic records, school reports, or other
            clinical documents through this service.
          </Section>

          <Section title="4. How we use your data">
            <ul className="list-disc pl-6 space-y-1">
              <li>To match you with NSW paediatricians, child psychiatrists or clinical psychologists.</li>
              <li>To share your first name and mobile number with the matched practitioner so they can confirm.</li>
              <li>To communicate with you about your request via SMS, WhatsApp or email.</li>
              <li>To process payment.</li>
              <li>To improve our service (anonymised analytics only).</li>
            </ul>
          </Section>

          <Section title="5. Who we share it with">
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Matched practitioner:</strong> your first name and mobile only, after we confirm a match.</li>
              <li><strong>Stripe:</strong> for payment processing only.</li>
              <li><strong>No one else.</strong> We do not sell, rent, or trade your data to third parties.</li>
            </ul>
          </Section>

          <Section title="6. How long we keep it">
            We keep your request data for 12 months for service delivery, dispute resolution, and improvement.
            After that, we anonymise or delete it. You can request deletion at any time (see Section 8).
          </Section>

          <Section title="7. Security">
            We use industry-standard security including HTTPS, encrypted storage, and access controls.
          </Section>

          <Section title="8. Your rights">
            You have the right to access, correct, or request deletion of your personal data. To exercise these
            rights, reach out on the message thread we used to coordinate your request. We will respond within 30 days.
          </Section>

          <Section title="9. Cookies">
            We use minimal cookies for session management. We use Vercel Analytics for anonymised traffic data.
            We do not use advertising or tracking cookies.
          </Section>

          <Section title="10. Changes">
            We may update this Privacy Policy occasionally. Material changes will be announced on this page.
          </Section>

          <Section title="11. Contact">
            Questions about privacy? Reach out on the message thread we used to coordinate your request.
          </Section>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}
