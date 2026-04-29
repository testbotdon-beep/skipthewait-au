import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://skipthewait.uqlabs.co'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SkipTheWait NSW | Find a paediatrician with a free assessment slot',
    template: '%s | SkipTheWait NSW',
  },
  description:
    'Skip the 18 month wait. We call NSW paediatricians, child psychiatrists and clinical psychologists until we find one with a free ADHD or autism assessment slot. A$29. No match, no charge.',
  applicationName: 'SkipTheWait NSW',
  keywords: [
    'paediatrician Sydney',
    'ADHD assessment Sydney',
    'autism assessment Sydney',
    'child psychiatrist NSW',
    'clinical psychologist Sydney',
    'paediatric ADHD NSW',
    'paediatric autism NSW',
    'private paediatrician Sydney',
    'paediatric assessment waitlist',
    'child psychologist NSW',
  ],
  authors: [{ name: 'Uniq Labs Pte Ltd', url: 'https://uqlabs.co' }],
  creator: 'Uniq Labs Pte Ltd',
  publisher: 'Uniq Labs Pte Ltd',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'SkipTheWait NSW | Find a paediatrician with a free assessment slot',
    description:
      'We call NSW paediatricians and child psychologists until we find one with a free ADHD or autism assessment slot. A$29. No match, no charge.',
    url: SITE_URL,
    siteName: 'SkipTheWait NSW',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkipTheWait NSW | Find a paediatrician with a free assessment slot',
    description:
      'We call NSW paediatricians until we find one with a free ADHD or autism assessment slot. A$29. No match, no charge.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'SkipTheWait NSW',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  image: `${SITE_URL}/opengraph-image`,
  description:
    'Concierge matching for NSW paediatric ADHD and autism assessments. We call practitioners until we find one with a confirmed free slot.',
  priceRange: 'A$29',
  areaServed: { '@type': 'State', name: 'New South Wales' },
  parentOrganization: {
    '@type': 'Organization',
    name: 'Uniq Labs Pte Ltd',
    url: 'https://uqlabs.co',
  },
  offers: {
    '@type': 'Offer',
    price: '29',
    priceCurrency: 'AUD',
    description: 'Match with a verified NSW paediatrician, child psychiatrist or clinical psychologist with a confirmed free assessment slot.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
