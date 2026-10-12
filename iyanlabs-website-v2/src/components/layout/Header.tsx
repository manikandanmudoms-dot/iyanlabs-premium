import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NAV } from '../../content/site';
import { gsap } from '../../motion/gsap';
import { getLenis } from '../../motion/GlobalMotion';
import { Logo } from '../ui/Logo';
import './Header.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [hover, setHover] = useState<string | null>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Compact on scroll; hide on scroll down, reveal on scroll up. */
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) { setHidden(y > last && y > 320); last = y; }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Active section → nav highlight. */
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.href.slice(1))).filter((e): e is HTMLElement => !!e);
    if (!('IntersectionObserver' in window) || !els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(`#${e.target.id}`); }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Sliding terracotta underline follows hover, else the active item. */
  useLayoutEffect(() => {
    const list = navRef.current;
    const bar = barRef.current;
    if (!list || !bar) return;
    const key = hover ?? active;
    const link = key ? list.querySelector<HTMLAnchorElement>(`a[href="${key}"]`) : null;
    if (!link) { bar.style.opacity = '0'; return; }
    const lr = link.getBoundingClientRect();
    const pr = list.getBoundingClientRect();
    bar.style.opacity = '1';
    bar.style.transform = `translateX(${lr.left - pr.left + 14}px) scaleX(${(lr.width - 28) / 100})`;
  }, [hover, active, scrolled]);

  /* Mobile menu: lock scroll, focus, Escape, staggered links. */
  useLayoutEffect(() => {
    const lenis = getLenis();
    if (!open) { lenis?.start(); document.body.style.overflow = ''; return; }
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const el = menuRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx: gsap.Context | null = null;
    if (el && !reduce) {
      ctx = gsap.context(() => {
        gsap.fromTo(el, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.8, ease: 'expo.inOut' });
        gsap.from('.mmenu__link', { yPercent: 120, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.25 });
        gsap.from('.mmenu__foot', { autoAlpha: 0, y: 20, duration: 0.6, delay: 0.55 });
      }, el);
    }
    el?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); ctx?.revert(); };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const close = () => setOpen(false);
  const cls = ['hdr', scrolled && 'is-scrolled', hidden && !open && 'is-hidden', open && 'is-open'].filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div className="container hdr__inner">
        <a href="#top" className="hdr__brand" aria-label="iyanLabs home" onClick={close} data-cursor="Top"><Logo /></a>

        <nav className="hdr__nav" aria-label="Primary" onMouseLeave={() => setHover(null)}>
          <ul ref={navRef}>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} aria-current={active === item.href ? 'location' : undefined}
                  onMouseEnter={() => setHover(item.href)} onFocus={() => setHover(item.href)} onBlur={() => setHover(null)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <span ref={barRef} className="hdr__bar" aria-hidden="true" />
        </nav>

        <a href="#contact" className="hdr__cta" data-magnetic="" data-cursor="Talk">Let's Talk</a>

        <button ref={toggleRef} type="button" className="hdr__toggle" aria-expanded={open} aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
          <span aria-hidden="true" className={`burger${open ? ' is-open' : ''}`}><i /><i /></span>
        </button>
      </div>

      <div id="mobile-menu" ref={menuRef} className="mmenu" hidden={!open}>
        <nav aria-label="Mobile" className="container mmenu__nav">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.href} className="mmenu__item">
                <a href={item.href} onClick={close} className="mmenu__a">
                  <span className="mmenu__link"><span className="mmenu__num">0{i + 1}</span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mmenu__foot">
            <a href="#contact" className="mmenu__cta" onClick={close}>Let's Talk</a>
            <p>Understand. Connect. Build. Deliver.</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
