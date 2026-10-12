import { useRef, useState } from 'react';
import { MARQUEE } from '../../content/site';
import { gsap, ScrollTrigger, registerLoop, unregisterLoop } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import './Marquee.css';

/** Two counter-scrolling technology marquees. Speed follows scroll velocity; pause on hover or via the button. */
export function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const loops = useRef<gsap.core.Tween[]>([]);
  const [paused, setPaused] = useState(false);

  useMotion(ref, (c, el) => {
    const tracks = gsap.utils.toArray<HTMLElement>('.marquee__track', el);
    const tweens = tracks.map((t, i) => registerLoop(i === 0
      ? gsap.fromTo(t, { xPercent: 0 }, { xPercent: -50, duration: c.mobile ? 36 : 48, ease: 'none', repeat: -1 })
      : gsap.fromTo(t, { xPercent: -50 }, { xPercent: 0, duration: c.mobile ? 40 : 54, ease: 'none', repeat: -1 })));
    loops.current = tweens;
    let hovering = false;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        if (hovering) return;
        const v = Math.min(Math.abs(self.getVelocity()) / 300, 6);
        tweens.forEach((tw) => {
          if (tw.paused()) return;
          gsap.to(tw, { timeScale: 1 + v, duration: 0.2, overwrite: true });
          gsap.to(tw, { timeScale: 1, duration: 1.2, delay: 0.25, ease: 'power2.out' });
        });
      },
    });
    const enter = () => { hovering = true; tweens.forEach((tw) => gsap.to(tw, { timeScale: 0, duration: 0.6, overwrite: true })); };
    const leave = () => { hovering = false; tweens.forEach((tw) => gsap.to(tw, { timeScale: 1, duration: 0.8, overwrite: true })); };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    return () => { st.kill(); el.removeEventListener('pointerenter', enter); el.removeEventListener('pointerleave', leave); tweens.forEach(unregisterLoop); loops.current = []; };
  });

  const toggle = () => setPaused((p) => { loops.current.forEach((t) => (p ? t.play() : t.pause())); return !p; });

  const row = (items: string[], variant: string) => (
    <div className={`marquee__row marquee__row--${variant}`} aria-hidden="true">
      <div className="marquee__track">
        {[...items, ...items].map((m, i) => <span key={i} className="marquee__item">{m}<i className="marquee__star">✦</i></span>)}
      </div>
    </div>
  );

  return (
    <section ref={ref} className={`marquee${paused ? ' is-paused' : ''}`} aria-label="Technologies we work with">
      <ul className="sr-only">{[...MARQUEE.top, ...MARQUEE.bottom].map((m) => <li key={m}>{m}</li>)}</ul>
      {row(MARQUEE.top, 'a')}
      {row(MARQUEE.bottom, 'b')}
      <button type="button" className="marquee__pause" onClick={toggle} aria-pressed={paused}>{paused ? 'Play' : 'Pause'}<span className="sr-only"> technology marquee</span></button>
    </section>
  );
}
