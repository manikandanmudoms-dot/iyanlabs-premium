interface Props { tone?: 'light' | 'dark'; className?: string; }

/** Provisional iyanLabs mark + wordmark in the premium palette. Replace with the approved asset. */
export function Logo({ tone = 'light', className = '' }: Props) {
  const fg = tone === 'light' ? '#F7F2EA' : '#141416';
  const tile = tone === 'light' ? '#1C1C1F' : '#141416';
  return (
    <span className={`logo logo--${tone} ${className}`}>
      <svg className="logo__mark" width="34" height="34" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <rect width="64" height="64" rx="16" fill={tile} stroke={tone === 'light' ? '#3A3A3F' : 'none'} />
        <rect x="17" y="27" width="7" height="22" rx="3.5" fill="#F7F2EA" />
        <circle cx="20.5" cy="18.5" r="4.5" fill="#C8643B" />
        <path d="M33 15v31a3 3 0 0 0 3 3h12" fill="none" stroke="#F7F2EA" strokeWidth="7" strokeLinecap="round" />
        <circle cx="48" cy="49" r="3.2" fill="#E08A5F" />
      </svg>
      <span className="logo__word" style={{ color: fg }}>iyan<b>Labs</b></span>
    </span>
  );
}
