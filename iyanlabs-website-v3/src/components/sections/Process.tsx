import { useRef } from 'react';
import { PROCESS } from '../../content/site';
import { decode } from '../../lib/decode';
import { gsap, ScrollTrigger } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { Split } from '../ui/Split';
import './Process.css';

const TONES = ['#22D3EE', '#8B5CF6', '#EC4899', '#34D399'];

/**
 * Desktop: pinned horizontal scroll. A gradient beam fills across, numbers decode into place,
 * and each card's border beam lights up when its step becomes active. Otherwise: vertical timeline.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const track = q('.proc__track')[0] as HTMLElement;
    const steps = q('.proc__step') as HTMLElement[];
    const activate = (i: number) => steps.forEach((s, k) => {
      const on = k <= i;
      if (on && !s.classList.contains('is-active')) decode(s.querySelector<HTMLElement>('.proc__num')!, undefined, 600);
      s.classList.toggle('is-active', on);
    });

    if (c.desktop && c.tall) {
      const viewport = q('.proc__viewport')[0] as HTMLElement;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el, start: 'top top', end: () => `+=${distance() + innerHeight * 0.5}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => activate(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 1.05))),
        },
      })
        .to(track, { x: () => -distance(), duration: 1 }, 0)
        .fromTo(q('.proc__fill'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    } else {
      gsap.fromTo(q('.proc__fill'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 70%', end: 'bottom 60%', scrub: true } });
      steps.forEach((s, i) => {
        gsap.from(s, { y: 30, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: s, start: 'top 85%', toggleActions: 'play none none reverse' } });
        ScrollTrigger.create({ trigger: s, start: 'top 70%', onEnter: () => activate(i), onLeaveBack: () => activate(i - 1) });
      });
    }
    activate(-1);
    return () => steps.forEach((s) => s.classList.add('is-active'));
  });

  return (
    <section ref={ref} className="section proc" id="process" aria-labelledby="process-title">
      <div className="aurora aurora--soft" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="container proc__head">
        <div className="section-head">
          <p className="eyebrow" data-reveal="up">{PROCESS.eyebrow}</p>
          <Split id="process-title" className="t-h2" text={PROCESS.headline} />
        </div>
        <p className="proc__hint" aria-hidden="true">Scroll to move through the process →</p>
      </div>
      <div className="proc__viewport">
        <ol className="proc__track container">
          <li className="proc__rail" aria-hidden="true"><span className="proc__fill" /></li>
          {PROCESS.steps.map((s, i) => (
            <li key={s.number} className="proc__step is-active" style={{ ['--tone' as string]: TONES[i] }}>
              <span className="proc__dot" aria-hidden="true" />
              <span className="proc__num" aria-hidden="true" data-text={s.number}>{s.number}</span>
              <div className="proc__card beam glass" data-spot="">
                <h3 className="t-h3"><span className="sr-only">Step {s.number}: </span>{s.title}</h3>
                <p>{s.description}</p>
                <p className="proc__out"><span className="t-label">Outcome</span>{s.deliverable}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
