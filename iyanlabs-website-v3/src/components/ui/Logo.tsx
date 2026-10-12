/** Provisional iyanLabs mark + wordmark in the AI palette. Replace with the approved asset. */
export function Logo() {
  return (
    <span className="logo">
      <svg className="logo__mark" width="34" height="34" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8B5CF6" /><stop offset=".5" stopColor="#3B82F6" /><stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="#0A0B14" />
        <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="url(#logo-g)" strokeWidth="2" />
        <rect x="17" y="27" width="7" height="22" rx="3.5" fill="#F5F7FF" />
        <circle cx="20.5" cy="18.5" r="4.5" fill="#FF6B3D" />
        <path d="M33 15v31a3 3 0 0 0 3 3h12" fill="none" stroke="url(#logo-g)" strokeWidth="7" strokeLinecap="round" />
      </svg>
      <span className="logo__word">iyan<b>Labs</b></span>
    </span>
  );
}
