import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

type Variant = 'primary' | 'ghost' | 'outline';
interface Common {
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: 'arrow' | 'external' | 'none';
  /** Magnetic hover on desktop (handled globally by <Cursor/>). */
  magnetic?: boolean;
  /** Label shown in the custom cursor ring. */
  cursorLabel?: string;
  children: ReactNode;
}

const cls = (v: Variant = 'primary', s: 'md' | 'lg' = 'md', extra?: string) =>
  ['btn', `btn--${v}`, `btn--${s}`, extra].filter(Boolean).join(' ');

function Icon({ kind }: { kind: Common['icon'] }) {
  if (kind === 'none') return null;
  return (
    <span className="btn__icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
        {kind === 'external'
          ? <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </span>
  );
}

export function ButtonLink({ variant, size, icon = 'arrow', magnetic = true, cursorLabel, children, className, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = rest.target === '_blank';
  return (
    <a
      className={cls(variant, size, className)}
      data-magnetic={magnetic ? '' : undefined}
      data-cursor={cursorLabel ?? (external ? 'Open' : 'Explore')}
      {...rest}
      rel={external ? 'noopener noreferrer' : rest.rel}
    >
      <span className="btn__label">{children}</span>
      <Icon kind={icon} />
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export function Button({ variant, size, icon = 'arrow', magnetic = true, cursorLabel, children, className, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cls(variant, size, className)} data-magnetic={magnetic ? '' : undefined} data-cursor={cursorLabel} {...rest}>
      <span className="btn__label">{children}</span>
      <Icon kind={icon} />
    </button>
  );
}
