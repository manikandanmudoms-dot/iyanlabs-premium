import { useRef, useState } from 'react';
import { MARQUEE } from '../../content/site';
import { gsap, ScrollTrigger, registerLoop, unregisterLoop } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import './Marquee.css';

/** Infinite capability marquee: drifts slowly, speeds up with scroll velocity, pauses on hover. */
export function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);
  const [paused, setPaused] = useState(false);

  useMotion(ref, (c, el) => {
    const track = el.querySelector<HTMLElement>('.marquee__track')!;
    const tween = registerLoop(gsap.to(track, { xPercent: -50, duration: c.mobile ? 40 : 55, ease: 'none', repeat: -1 }));
    loop.current = tween;
    let hovering = false;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        if (hovering || tween.paused()) return;
        const v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
        gsap.to(tween, { timeScale: 1 + v, duration: 0.2, overwrite: true });
        gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.25, ease: 'power2.out' });
      },
    });
    const enter = () => { hovering = true; gsap.to(tween, { timeScale: 0, duration: 0.6, overwrite: true }); };
    const leave = () => { hovering = false; gsap.to(tween, { timeScale: 1, duration: 0.8, overwrite: true }); };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    return () => {
      st.kill();
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
      unregisterLoop(tween);
      loop.current = null;
    };
  });

  const toggle = () => {
    const t = loop.current;
    setPaused((p) => {
      if (t) { if (p) t.play(); else t.pause(); }
      return !p;
    });
  };

  const items = [...MARQUEE, ...MARQUEE];
  return (
    <section ref={ref} className={`marquee stage--dark${paused ? ' is-paused' : ''}`} data-stage="dark" aria-label="Technologies we work with">
      <ul className="sr-only">{MARQUEE.map((m) => <li key={m}>{m}</li>)}</ul>
      <div className="marquee__viewport" aria-hidden="true">
        <div className="marquee__track">
          {items.map((m, i) => (
            <span key={i} className="marquee__item">{m}<i className="marquee__star">✦</i></span>
          ))}
        </div>
      </div>
      <button type="button" className="marquee__pause" onClick={toggle} aria-pressed={paused}>
        {paused ? 'Play' : 'Pause'}<span className="sr-only"> technology marquee</span>
      </button>
    </section>
  );
}
