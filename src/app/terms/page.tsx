import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-page max-w-3xl py-16">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">Back</Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-6 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString('en-AU')}</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <Section title="1. Who we are">
            SkipTheWait NSW (the &ldquo;Service&rdquo;) is a concierge matchmaking service operated by Uniq Labs Pte. Ltd.,
            a company registered in Singapore (&ldquo;we&rdquo;, &ldquo;us&rdquo;). We help parents in New South Wales,
            Australia, find paediatricians, child psychiatrists and clinical psychologists with availability for
            paediatric ADHD or autism assessments.
          </Section>

          <Section title="2. What we deliver">
            <p>For the fee of A$29 (the &ldquo;Standard Fee&rdquo;), we contact verified NSW practitioners
            matching your criteria and aim to match you with one who has confirmed availability for your timeline,
            within 7 days of your request.</p>
            <p className="mt-3">&ldquo;Delivery&rdquo; means we send you the matched practitioner&apos;s details
            (name, practice, contact details, typical fee, and any GP referral instructions) by email or SMS, with
            confirmation that we have personally verified their response.</p>
          </Section>

          <Section title="3. How payment works">
            <p>Payment is collected via Stripe (card). Stripe places a temporary authorisation hold on your card
            when we send the payment link, but no money moves until we have delivered the match. If we cannot deliver,
            the hold is voided and you are not charged.</p>
            <p className="mt-3">If we cannot find a match within 7 days, you will not be charged.</p>
          </Section>

          <Section title="4. Non-refundable once delivered">
            Once we have delivered the match per Section 2, the Fee is considered earned and is <strong>non-refundable</strong>.
            This includes cases where:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You change your mind or decide not to proceed with the assessment;</li>
              <li>You are unable to reach the practitioner after we provide their contact details;</li>
              <li>The practitioner becomes unresponsive or unavailable after we verify their response;</li>
              <li>The assessment outcome is not what you expected.</li>
            </ul>
            If you genuinely feel we have materially failed to deliver as promised (wrong specialty, wrong region,
            wrong condition focus), reach out within 7 days of receiving your match and we will run a second round at no extra cost.
          </Section>

          <Section title="5. We are not a medical service">
            We are a matchmaking and admin service. We do not provide medical advice, diagnosis, or treatment.
            We do not conduct assessments. All clinical work is conducted directly between you and the matched
            practitioner. We make no representation or warranty about practitioner qualifications beyond their
            current registration with AHPRA. AHPRA registration status is the responsibility of each practitioner;
            we encourage you to verify directly at ahpra.gov.au if you wish.
          </Section>

          <Section title="6. Practitioner relationship">
            Practitioners matched through our service are independent professionals. They are not our employees,
            agents, or contractors. We do not receive commissions, kickbacks, or referral fees from practitioners.
            Any dispute regarding the assessment, fees paid to the practitioner, or clinical outcomes should be
            raised directly with the practitioner or with AHPRA.
          </Section>

          <Section title="7. Medicare and rebates">
            We do not provide Medicare advice. Whether you can claim a rebate against the practitioner&apos;s fee
            depends on your eligibility, the practitioner&apos;s billing arrangement, and whether you have a valid
            GP referral. We will tell you whether the matched practitioner requires a referral, but the rebate
            decision is between you, your GP, the practitioner, and Medicare.
          </Section>

          <Section title="8. Your obligations">
            You agree to provide accurate information in your request, including your child&apos;s age and any
            relevant clinical context. You agree not to use our service to harass practitioners or submit fraudulent
            requests. We reserve the right to refuse service at our discretion.
          </Section>

          <Section title="9. Limitation of liability">
            To the maximum extent permitted by law, our total liability to you for any claim arising out of or
            related to the Service shall not exceed the total fees you have paid us. We are not liable for any
            indirect, consequential, or incidental damages, including any clinical outcome.
          </Section>

          <Section title="10. Governing law">
            These Terms are governed by the laws of Singapore (the location of the operating entity). Any dispute
            shall be resolved in the courts of Singapore. This does not affect statutory rights you may have under
            Australian Consumer Law.
          </Section>

          <Section title="11. Contact">
            Questions? Reach out on the SMS or WhatsApp thread we used to coordinate your request.
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
