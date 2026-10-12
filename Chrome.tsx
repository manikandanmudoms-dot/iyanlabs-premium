import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, setLoopsPaused } from '../../motion/gsap';
import './Chrome.css';

/* ------------------------------------------------------------------ */
/* Scroll progress bar                                                 */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty('--p', String(max > 0 ? window.scrollY / max : 0));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <div ref={ref} className="progress" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Custom cursor, magnetic buttons and dark-stage spotlight            */
/* ------------------------------------------------------------------ */
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

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3.out' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3.out' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3.out' });

    let magnet: HTMLElement | null = null;
    let mx: gsap.QuickToFunc | null = null;
    let my: gsap.QuickToFunc | null = null;
    const release = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      magnet = null; mx = my = null;
    };

    const onMove = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target as Element | null;

      const interactive = t?.closest<HTMLElement>('a, button, [data-cursor], input, select, textarea, label');
      const text = interactive?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '';
      ring.current!.dataset.state = interactive ? (text ? 'label' : 'hover') : '';
      setLabel((prev) => (prev === text ? prev : text));

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
        const r = magnet.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.25);
        my((e.clientY - (r.top + r.height / 2)) * 0.35);
      }

      const stage = t?.closest<HTMLElement>('.stage--dark');
      if (stage) {
        const r = stage.getBoundingClientRect();
        stage.style.setProperty('--mx', `${e.clientX - r.left}px`);
        stage.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    };
    const onDown = () => ring.current && (ring.current.dataset.down = '1');
    const onUp = () => ring.current && delete ring.current.dataset.down;
    const onLeave = () => { ring.current!.dataset.state = 'out'; release(); };

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
      <div ref={ring} className="cursor__ring"><span className="cursor__label">{label}</span></div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pause / play all looping motion (accessibility)                     */
/* ------------------------------------------------------------------ */
export function MotionToggle() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', paused);
    setLoopsPaused(paused);
  }, [paused]);
  return (
    <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setPaused((p) => !p)} data-cursor={paused ? 'Play' : 'Pause'}>
      <span aria-hidden="true" className={`motion-toggle__icon${paused ? ' is-paused' : ''}`}><i /><i /></span>
      <span>{paused ? 'Play motion' : 'Pause motion'}</span>
    </button>
  );
}
