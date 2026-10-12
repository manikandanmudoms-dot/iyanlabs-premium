import { useRef } from 'react';
import { PROCESS } from '../../content/site';
import { gsap } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { Split } from '../ui/Split';
import './Process.css';

/**
 * Desktop: pinned horizontal "film strip" — vertical scroll moves the four steps sideways,
 * the terracotta progress line fills, and each number flips in as its step arrives.
 * Tablet/mobile: vertical timeline whose line fills on scroll.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const track = q('.proc__track')[0] as HTMLElement;
    const steps = q('.proc__step');

    if (c.desktop && c.tall) {
      const distance = () => Math.max(0, track.scrollWidth - (q('.proc__viewport')[0] as HTMLElement).clientWidth);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance() + window.innerHeight * 0.6}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      });
      tl.to(track, { x: () => -distance(), duration: 1 }, 0)
        .fromTo(q('.proc__fill'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      steps.forEach((s, i) => {
        const at = i / (steps.length - 1) * 0.85;
        tl.fromTo(s.querySelector('.proc__num'), { rotateX: -90, autoAlpha: 0 }, { rotateX: 0, autoAlpha: 1, duration: 0.08, ease: 'power2.out' }, at)
          .fromTo(s.querySelector('.proc__card'), { y: 40, autoAlpha: 0.25 }, { y: 0, autoAlpha: 1, duration: 0.12, ease: 'power2.out' }, at)
          .fromTo(s.querySelector('.proc__dot'), { scale: 0.4, backgroundColor: '#2A2A2E' }, { scale: 1, backgroundColor: '#C8643B', duration: 0.05 }, at);
      });
    } else {
      gsap.fromTo(q('.proc__fill'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 70%', end: 'bottom 60%', scrub: true } });
      steps.forEach((s) => {
        gsap.from(s, { y: 30, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: s, start: 'top 85%', toggleActions: 'play none none reverse' } });
      });
    }
  });

  return (
    <section ref={ref} className="section proc stage--dark" id="process" data-stage="dark" aria-labelledby="process-title">
      <div className="spotlight" aria-hidden="true" />
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
          {PROCESS.steps.map((s) => (
            <li key={s.number} className="proc__step">
              <span className="proc__dot" aria-hidden="true" />
              <span className="proc__num" aria-hidden="true">{s.number}</span>
              <div className="proc__card">
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
