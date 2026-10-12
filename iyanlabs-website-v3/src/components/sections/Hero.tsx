import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { HERO, SERVICES, TONES } from '../../content/site';
import { gsap } from '../../motion/gsap';
import { whenIntroDone } from '../../motion/intro';
import { useMotion } from '../../motion/useMotion';
import { prefillContact } from '../../lib/contactIntent';
import { ButtonLink } from '../ui/Button';
import { ServiceIcon } from '../ui/Icons';
import { ParticleField } from '../visuals/ParticleField';
import './Hero.css';

const AICore = lazy(() => import('../visuals/AICore'));

/** Decide once whether the live WebGL core should run on this device. */
function useLiveCore() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 639px)').matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 2;
    let gl = false;
    try { gl = !!document.createElement('canvas').getContext('webgl'); } catch { gl = false; }
    setLive(!reduce && !small && !weak && gl);
  }, []);
  return [live, setLive] as const;
}

/** Types rotating example prompts into the prompt bar. */
function useTypedPrompts(prompts: string[]) {
  const [text, setText] = useState(prompts[0]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0, pos = 0, deleting = false, timer = 0;
    const tick = () => {
      if (document.documentElement.classList.contains('motion-paused')) { timer = window.setTimeout(tick, 300); return; }
      const full = prompts[i];
      if (!deleting) {
        pos++;
        setText(full.slice(0, pos));
        if (pos >= full.length) { deleting = true; timer = window.setTimeout(tick, 1800); return; }
        timer = window.setTimeout(tick, 38 + Math.random() * 40);
      } else {
        pos -= 2;
        setText(full.slice(0, Math.max(0, pos)));
        if (pos <= 0) { deleting = false; i = (i + 1) % prompts.length; setIndex(i); }
        timer = window.setTimeout(tick, 18);
      }
    };
    setText('');
    timer = window.setTimeout(tick, 900);
    return () => window.clearTimeout(timer);
  }, [prompts]);
  return { text, current: prompts[index] };
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useLiveCore();
  const onFail = useCallback(() => setLive(false), [setLive]);
  const { text, current } = useTypedPrompts(HERO.prompts);

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    tl.from(q('.hero__eyebrow'), { y: 20, autoAlpha: 0, duration: 0.8 })
      .from(q('.hero__title .w__i'), { yPercent: 120, rotate: 4, filter: 'blur(10px)', duration: 1.3, stagger: 0.1 }, '-=0.6')
      .from(q('.hero__core-stage'), { scale: 0.05, autoAlpha: 0, filter: 'blur(20px) brightness(3)', duration: 1.8, ease: 'expo.out' }, 0.15)
      .from(q('.orbit__chip'), { scale: 0, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(2.2)' }, 0.8)
      .from(q('.hero__ring'), { scale: 0.6, autoAlpha: 0, duration: 1.4, stagger: 0.12 }, 0.5)
      .from([q('.hero__support'), q('.prompt'), q('.hero__body'), q('.hero__ctas'), q('.hero__trust')], { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.7)
      .from(q('.hero__cue'), { autoAlpha: 0, duration: 0.8 }, 1.4);
    const stop = whenIntroDone(() => tl.play());

    // Scroll out: core shrinks, energy rises, orbits spread; copy lifts away. Scrubbed + reversible.
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 } })
      .to(q('.hero__core-stage'), { scale: 0.55, yPercent: 30, '--energy': 1, ease: 'none' }, 0)
      .to(q('.orbit'), { scale: 1.35, autoAlpha: 0, ease: 'none' }, 0)
      .to(q('.hero__copy'), { yPercent: -14, autoAlpha: 0.15, ease: 'none' }, 0);

    if (c.desktop && c.fine) {
      const stage = q('.hero__visual')[0] as HTMLElement;
      const x = gsap.quickTo(stage, 'x', { duration: 1.2, ease: 'power3.out' });
      const y = gsap.quickTo(stage, 'y', { duration: 1.2, ease: 'power3.out' });
      const move = (e: PointerEvent) => { x((e.clientX / innerWidth - 0.5) * 24); y((e.clientY / innerHeight - 0.5) * 18); };
      window.addEventListener('pointermove', move, { passive: true });
      return () => { stop(); window.removeEventListener('pointermove', move); };
    }
    return stop;
  });

  return (
    <section ref={ref} className="hero section grain" id="top" aria-labelledby="hero-title">
      <div className="aurora" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="tech-grid" aria-hidden="true" />
      <ParticleField />
      <div className="spotlight" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">{HERO.eyebrow}</p>
          <h1 id="hero-title" className="t-display hero__title" data-split="" data-manual="">
            <span className="w"><span className="w__i">We</span></span>{' '}
            <span className="w"><span className="w__i">Build</span></span>{' '}
            <span className="w"><span className="w__i grad">Different.</span></span>
          </h1>
          <p className="hero__support">{HERO.support}</p>

          <a href="#contact" className="prompt" data-cursor="Ask" onClick={() => prefillContact({ message: current.replace(/…$/, '') })}>
            <span className="prompt__spark" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z" fill="currentColor" /></svg>
            </span>
            <span className="prompt__text" aria-hidden="true">{text}<i className="prompt__caret" /></span>
            <span className="sr-only">Ask iyanLabs about your project, for example: {HERO.prompts.join(' ')}</span>
            <span className="prompt__go" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </a>

          <p className="t-lead hero__body">{HERO.body}</p>
          <div className="hero__ctas">
            <ButtonLink href="#contact" size="lg" cursorLabel="Talk">Discuss Your Project</ButtonLink>
            <ButtonLink href="#services" size="lg" variant="ghost" icon="none">Explore Our Services</ButtonLink>
          </div>
          <p className="hero__trust">{HERO.trust}</p>
        </div>

        <div className="hero__visual">
          <div className="hero__core" role="img" aria-label="Illustration: a glowing AI core at the centre of six iyanLabs capabilities: Salesforce, MuleSoft, mobile apps, websites, AI agents and chatbots.">
            <span className="hero__ring hero__ring--1" aria-hidden="true" />
            <span className="hero__ring hero__ring--2" aria-hidden="true" />
            <div className="hero__core-stage" aria-hidden="true">
              <img className="hero__core-img" src="/ai-core.webp" srcSet="/ai-core-sm.webp 480w, /ai-core.webp 800w" sizes="(max-width: 639px) 80vw, 520px" width="800" height="800" alt="" decoding="async" fetchPriority="high" />
              {live && (
                <Suspense fallback={null}>
                  <AICore className="hero__core-canvas" onFail={onFail} />
                </Suspense>
              )}
            </div>
          </div>
          <ul className="orbit" aria-label="Our six capabilities">
            {SERVICES.map((s, i) => (
              <li key={s.id} className="orbit__slot" style={{ ['--a' as string]: `${i * 60 - 90}deg`, ['--tone' as string]: TONES[s.id].color }}>
                <a href={`#${s.id}`} className="orbit__chip" data-tone={TONES[s.id].color} data-cursor="View">
                  <ServiceIcon id={s.id} size={20} />
                  <span className="orbit__label">{s.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a href="#approach" className="hero__cue" aria-label="Scroll to the next section"><span>Scroll</span><i aria-hidden="true" /></a>
    </section>
  );
}
