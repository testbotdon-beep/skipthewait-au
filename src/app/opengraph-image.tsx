import { ImageResponse } from 'next/og'

export const alt = 'SkipTheWait NSW - Find a paediatrician with a free assessment slot'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a1628',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(16,185,129,0.2), transparent 70%)',
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <svg width="100" height="100" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#111d32" />
            <path d="M14 11h12M14 29h12M14 11c0 5 5 7 5 9s-5 4-5 9M26 11c0 5-5 7-5 9s5 4 5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="32" cy="8" r="6" fill="#10b981" />
            <path d="M29 8h6M32 5l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: 'white', letterSpacing: -1 }}>SkipTheWait</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 4, color: '#94a3b8', marginTop: 6, textTransform: 'uppercase' }}>NSW</div>
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            letterSpacing: -2,
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Skip the 18 month wait for an assessment.
        </div>
        <div
          style={{
            fontSize: 26,
            color: '#94a3b8',
            textAlign: 'center',
            display: 'flex',
            gap: 24,
          }}
        >
          <span>NSW paediatricians</span>
          <span style={{ color: '#475569' }}>|</span>
          <span>A$29 flat</span>
          <span style={{ color: '#475569' }}>|</span>
          <span>No match, no charge</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
