import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, setMotionPaused } from '../../motion/gsap';
import './Chrome.css';

/* Aurora scroll progress bar */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty('--p', String(max > 0 ? window.scrollY / max : 0));
    };
    const on = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return <div ref={ref} className="progress" aria-hidden="true" />;
}

/* Cursor (tone-aware), magnetic buttons, section + card spotlights */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useLayoutEffect(() => {
    const ok = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1025px)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');
    const r = ring.current;

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3.out' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3.out' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3.out' });

    let magnet: HTMLElement | null = null;
    let mx: gsap.QuickToFunc | null = null;
    let my: gsap.QuickToFunc | null = null;
    const release = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      magnet = null; mx = my = null;
    };

    const onMove = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target as Element | null;

      const interactive = t?.closest<HTMLElement>('a, button, [data-cursor], input, select, textarea, label');
      const text = interactive?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '';
      r.dataset.state = interactive ? (text ? 'label' : 'hover') : '';
      setLabel((prev) => (prev === text ? prev : text));

      const toned = t?.closest<HTMLElement>('[data-tone]');
      r.style.setProperty('--c', toned?.dataset.tone ?? '#22D3EE');

      const m = t?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (m !== magnet) {
        release();
        if (m) {
          magnet = m;
          mx = gsap.quickTo(m, 'x', { duration: 0.4, ease: 'power3.out' });
          my = gsap.quickTo(m, 'y', { duration: 0.4, ease: 'power3.out' });
        }
      }
      if (magnet && mx && my) {
        const b = magnet.getBoundingClientRect();
        mx((e.clientX - (b.left + b.width / 2)) * 0.25);
        my((e.clientY - (b.top + b.height / 2)) * 0.35);
      }

      const section = t?.closest<HTMLElement>('.section, .hero, .footer');
      if (section) {
        const b = section.getBoundingClientRect();
        section.style.setProperty('--mx', `${e.clientX - b.left}px`);
        section.style.setProperty('--my', `${e.clientY - b.top}px`);
      }
      const card = t?.closest<HTMLElement>('[data-spot]');
      if (card) {
        const b = card.getBoundingClientRect();
        card.style.setProperty('--sx', `${e.clientX - b.left}px`);
        card.style.setProperty('--sy', `${e.clientY - b.top}px`);
      }
    };
    const onDown = () => { r.dataset.down = '1'; };
    const onUp = () => { delete r.dataset.down; };
    const onLeave = () => { r.dataset.state = 'out'; release(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      root.classList.remove('has-cursor');
      release();
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring" data-state="out"><span className="cursor__label">{label}</span></div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}

/* Pause / play all motion: CSS loops, GSAP loops, WebGL and canvas */
export function MotionToggle() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', paused);
    setMotionPaused(paused);
  }, [paused]);
  return (
    <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setPaused((p) => !p)} data-cursor={paused ? 'Play' : 'Pause'}>
      <span aria-hidden="true" className={`motion-toggle__icon${paused ? ' is-paused' : ''}`}><i /><i /></span>
      <span className="motion-toggle__text">{paused ? 'Play motion' : 'Pause motion'}</span>
    </button>
  );
}
