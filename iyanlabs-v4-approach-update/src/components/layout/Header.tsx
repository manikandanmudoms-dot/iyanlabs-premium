import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../motion/gsap';
import { getLenis } from '../../motion/GlobalMotion';
import { useRouter } from '../../router';
import { Logo } from '../ui/Logo';
import './Header.css';

/**
 * v4 navigation: real routes where pages exist, home-section links for the rest.
 * Update an item's href to its route as each new page is built.
 */
export const NAV_V4 = [
  { label: 'Our Approach', href: '/approach' },
  { label: 'Services', href: '/#services' },
  { label: 'AI Solutions', href: '/#ai' },
  { label: 'Our Work', href: '/#work' },
  { label: 'About', href: '/#about' },
] as const;

export function Header() {
  const { path } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [hover, setHover] = useState<string | null>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) { setHidden(y > last && y > 360); last = y; }
    };
    const on = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  /* Active item: the current route, or (on home) the section in view. */
  useEffect(() => {
    setHidden(false);
    const routeItem = NAV_V4.find((n) => !n.href.includes('#') && n.href === path);
    if (routeItem) { setActive(routeItem.href); return; }
    if (path !== '/') { setActive(''); return; }
    setActive('');
    const items = NAV_V4.filter((n) => n.href.startsWith('/#'));
    const els = items.map((n) => document.getElementById(n.href.slice(2))).filter((e): e is HTMLElement => !!e);
    if (!('IntersectionObserver' in window) || !els.length) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(`/#${e.target.id}`); }), { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  useLayoutEffect(() => {
    const list = navRef.current; const bar = barRef.current;
    if (!list || !bar) return;
    const key = hover ?? active;
    const link = key ? list.querySelector<HTMLAnchorElement>(`a[href="${key}"]`) : null;
    if (!link) { bar.style.opacity = '0'; return; }
    const lr = link.getBoundingClientRect(); const pr = list.getBoundingClientRect();
    bar.style.opacity = '1';
    bar.style.width = `${lr.width}px`;
    bar.style.transform = `translateX(${lr.left - pr.left}px)`;
  }, [hover, active, scrolled, path]);

  useEffect(() => { setOpen(false); }, [path]);

  useLayoutEffect(() => {
    const lenis = getLenis();
    if (!open) { lenis?.start(); document.body.style.overflow = ''; return; }
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const el = menuRef.current;
    let ctx: gsap.Context | null = null;
    if (el && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctx = gsap.context(() => {
        gsap.fromTo(el, { clipPath: 'circle(0% at 92% 4%)' }, { clipPath: 'circle(150% at 92% 4%)', duration: 0.8, ease: 'expo.inOut' });
        gsap.from('.mmenu__link', { yPercent: 120, duration: 0.9, stagger: 0.06, delay: 0.25 });
        gsap.from('.mmenu__foot', { autoAlpha: 0, y: 20, duration: 0.6, delay: 0.55 });
      }, el);
    }
    el?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); ctx?.revert(); };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const on = () => mq.matches && setOpen(false);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const close = () => setOpen(false);
  const cls = ['hdr', scrolled && 'is-scrolled', hidden && !open && 'is-hidden', open && 'is-open'].filter(Boolean).join(' ');
  const isCurrent = (href: string) => active === href;

  return (
    <header className={cls}>
      <div className="hdr__pill">
        <a href="/" className="hdr__brand" aria-label="iyanLabs home" onClick={close} data-cursor="Home"><Logo /></a>
        <nav className="hdr__nav" aria-label="Primary" onMouseLeave={() => setHover(null)}>
          <ul ref={navRef}>
            {NAV_V4.map((item) => (
              <li key={item.href}>
                <a href={item.href} aria-current={isCurrent(item.href) ? (item.href.includes('#') ? 'location' : 'page') : undefined}
                  onMouseEnter={() => setHover(item.href)} onFocus={() => setHover(item.href)} onBlur={() => setHover(null)}>{item.label}</a>
              </li>
            ))}
          </ul>
          <span ref={barRef} className="hdr__bar" aria-hidden="true" />
        </nav>
        <a href="/#contact" className="hdr__ask" data-cursor="Ask">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z" fill="currentColor" /></svg>
          <span>Ask iyanLabs…</span>
        </a>
        <a href="/#contact" className="hdr__cta" data-magnetic="" data-cursor="Talk">Let's Talk</a>
        <button ref={toggleRef} type="button" className="hdr__toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
          <span aria-hidden="true" className={`burger${open ? ' is-open' : ''}`}><i /><i /></span>
        </button>
      </div>

      <div id="mobile-menu" ref={menuRef} className="mmenu" hidden={!open}>
        <div className="aurora" aria-hidden="true"><i /><i /><i /><i /></div>
        <nav aria-label="Mobile" className="container mmenu__nav">
          <ul>
            {NAV_V4.map((item, i) => (
              <li key={item.href} className="mmenu__item">
                <a href={item.href} onClick={close} className="mmenu__a" aria-current={isCurrent(item.href) && !item.href.includes('#') ? 'page' : undefined}>
                  <span className="mmenu__link"><span className="mmenu__num">0{i + 1}</span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mmenu__foot">
            <a href="/#contact" className="mmenu__cta" onClick={close}>Let's Talk</a>
            <p>Understand. Connect. Build. Automate.</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
