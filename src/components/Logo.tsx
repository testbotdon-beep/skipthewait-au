export function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="10" fill="#0a1628" />
      {/* Hourglass / wait icon */}
      <path
        d="M14 11h12M14 29h12M14 11c0 5 5 7 5 9s-5 4-5 9M26 11c0 5-5 7-5 9s5 4 5 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Forward arrow accent */}
      <circle cx="32" cy="8" r="6" fill="#10b981" />
      <path
        d="M29 8h6M32 5l3 3-3 3"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function LogoFull({ className = '', region = 'NSW' }: { className?: string; region?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={36} />
      <div className="flex flex-col leading-none">
        <span className="font-bold text-[15px] tracking-tight text-slate-900">SkipTheWait</span>
        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-400">{region}</span>
      </div>
    </div>
  )
}
