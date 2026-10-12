import { useRef } from 'react';
import { HERO, SERVICES } from '../../content/site';
import { gsap, registerLoop, unregisterLoop } from '../../motion/gsap';
import { whenIntroDone } from '../../motion/intro';
import { useMotion } from '../../motion/useMotion';
import { ButtonLink } from '../ui/Button';
import './Hero.css';

const PATHS = [
  'M178 262 C 178 330, 150 360, 172 412',
  'M352 470 C 384 470, 384 404, 404 404',
  'M392 110 C 448 110, 488 104, 488 140',
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (c, el) => {
    const loops: gsap.core.Animation[] = [];

    /* Entrance timeline — waits for the intro curtain. */
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    tl.from('.hero__eyebrow', { y: 20, autoAlpha: 0, duration: 0.8 })
      .from('.hero__title .w__i', { yPercent: 115, rotate: 3, duration: 1.2, stagger: 0.09 }, '-=0.6')
      .fromTo('.hero__underline path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power3.inOut' }, '-=0.6')
      .from(['.hero__support', '.hero__ticker', '.hero__body', '.hero__ctas', '.hero__trust'], { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, '-=0.9')
      .from('.studio__glow', { scale: 0.6, autoAlpha: 0, duration: 1.6 }, 0.2)
      .from('.studio__layer', {
        autoAlpha: 0, y: 80, z: -240, rotateX: c.mobile ? 0 : 18, rotateY: c.mobile ? 0 : -14,
        duration: 1.5, stagger: 0.14, ease: 'expo.out',
      }, 0.35)
      .fromTo('.studio__path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.15, ease: 'power3.inOut' }, '-=0.9')
      .from('.studio__node', { scale: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(3)' }, '-=0.5')
      .from('.studio__toast', { x: 40, autoAlpha: 0, duration: 0.8 }, '-=0.3')
      .from('.hero__cue', { autoAlpha: 0, duration: 0.8 }, '-=0.6')
      .from('.hero__strip li', { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, '-=0.9');

    /* Continuous: packets along pathways + breathing glow. */
    tl.add(() => {
      loops.push(registerLoop(gsap.fromTo('.studio__packet', { strokeDashoffset: 100 }, {
        strokeDashoffset: 0, duration: 2.4, ease: 'none', stagger: { each: 0.5, repeat: -1 },
      })));
      loops.push(registerLoop(gsap.to('.studio__glow', { scale: 1.12, opacity: 0.75, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
      if (!c.mobile) {
        loops.push(registerLoop(gsap.to('.studio__float', { y: -10, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.6 })));
      }
    });

    const stop = whenIntroDone(() => tl.play());

    /* Scroll out: modules separate and drift upward (scrubbed, reversible). */
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 } })
      .to('.studio__crm', { yPercent: -30, xPercent: -8, ease: 'none' }, 0)
      .to('.studio__api', { yPercent: -10, xPercent: 6, ease: 'none' }, 0)
      .to('.studio__phone', { yPercent: -55, ease: 'none' }, 0)
      .to('.studio__paths', { autoAlpha: 0.2, ease: 'none' }, 0)
      .to('.hero__copy', { yPercent: -12, autoAlpha: 0.2, ease: 'none' }, 0);

    /* Pointer parallax across three depth layers (desktop). */
    let onMove: ((e: PointerEvent) => void) | null = null;
    if (c.desktop && c.fine) {
      const stage = el.querySelector<HTMLElement>('.studio')!;
      const layers = [
        { el: '.studio__crm', d: 12 }, { el: '.studio__api', d: 22 }, { el: '.studio__phone', d: 34 }, { el: '.studio__toast', d: 44 },
      ].map(({ el, d }) => ({
        x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
        d,
      }));
      const tilt = gsap.quickTo(stage, 'rotateY', { duration: 1.2, ease: 'power3.out' });
      const tiltX = gsap.quickTo(stage, 'rotateX', { duration: 1.2, ease: 'power3.out' });
      onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d); });
        tilt(nx * 6); tiltX(-ny * 4);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    return () => {
      stop();
      loops.forEach(unregisterLoop);
      if (onMove) window.removeEventListener('pointermove', onMove);
    };
  });

  return (
    <section ref={ref} className="hero stage--dark" id="top" data-stage="dark" aria-labelledby="hero-title">
      <div className="spotlight" aria-hidden="true" />
      <div className="hero__grid arch-grid" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">{HERO.eyebrow}</p>
          <h1 id="hero-title" className="t-display hero__title" data-split="" data-manual="">
            <span className="w"><span className="w__i">We</span></span>{' '}
            <span className="w"><span className="w__i">Build</span></span>{' '}
            <span className="hero__diff">
              <span className="w"><span className="w__i accent-strong">Different.</span></span>
              <svg className="hero__underline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 14 C 80 4, 200 4, 296 12" pathLength={1} />
              </svg>
            </span>
          </h1>
          <p className="hero__support">{HERO.support}</p>
          <p className="hero__ticker">
            <span className="hero__ticker-pre">Engineering for</span>
            <span className="hero__ticker-slot" aria-hidden="true">
              <span className="hero__ticker-track">
                {[...HERO.ticker, HERO.ticker[0]].map((w, i) => <span key={i}>{w}</span>)}
              </span>
            </span>
            <span className="sr-only">Salesforce, MuleSoft and Mobile</span>
          </p>
          <p className="t-lead hero__body">{HERO.body}</p>
          <div className="hero__ctas">
            <ButtonLink href="#contact" size="lg" cursorLabel="Talk">Discuss Your Project</ButtonLink>
            <ButtonLink href="#services" size="lg" variant="ghost" icon="none">Explore Our Services</ButtonLink>
          </div>
          <p className="hero__trust">{HERO.trust}</p>
        </div>

        <div className="hero__visual">
          <Studio />
        </div>
      </div>

      <div className="container">
        <ul className="hero__strip" aria-label="Our capabilities">
          {SERVICES.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="hero__cap" data-cursor="View">
                <span className="hero__cap-num">{s.number}</span>
                <span className="hero__cap-name">{s.name}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <a href="#approach" className="hero__cue" aria-label="Scroll to the next section"><span>Scroll</span><i aria-hidden="true" /></a>
    </section>
  );
}

/** The iyanLabs Connected Systems Studio. */
function Studio() {
  return (
    <div className="studio" role="img" aria-label="Illustration: a CRM workspace, an API integration layer and a mobile business app, connected by live data pathways.">
      <div className="studio__glow" aria-hidden="true" />
      <svg className="studio__paths" viewBox="0 0 600 620" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {PATHS.map((d) => <path key={d} className="studio__path" d={d} pathLength={1} />)}
        {PATHS.map((d) => <path key={`p${d}`} className="studio__packet" d={d} pathLength={100} />)}
      </svg>
      <span className="studio__node studio__node--1" aria-hidden="true" />
      <span className="studio__node studio__node--2" aria-hidden="true" />
      <span className="studio__node studio__node--3" aria-hidden="true" />

      <div className="studio__layer studio__crm" aria-hidden="true">
        <div className="studio__float">
          <div className="panel panel--ivory">
            <div className="panel__bar"><span className="panel__title">Customer workspace</span><span className="chip chip--live">Live</span></div>
            <div className="crm-stages">
              <span className="is-done">Lead</span><span className="is-done">Qualified</span><span className="is-active">Proposal</span><span>Won</span>
            </div>
            <ul className="crm-rows">
              <li><i className="av av--1" />Retail account<em>Opportunity</em></li>
              <li><i className="av av--2" />Logistics account<em>Synced</em></li>
              <li><i className="av av--3" />Service case<em className="em--hot">Action</em></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="studio__layer studio__api" aria-hidden="true">
        <div className="studio__float">
          <div className="panel panel--dark">
            <div className="panel__bar"><span className="panel__title">API layer</span><span className="chip chip--ok"><i />Healthy</span></div>
            <div className="api-topo">
              <span className="api-chip">Experience</span><span className="api-line" />
              <span className="api-chip api-chip--mid">Process</span><span className="api-line" />
              <span className="api-chip">System</span>
            </div>
            <div className="api-targets"><span>CRM</span><span>ERP</span><span>DB</span><span>Cloud</span></div>
          </div>
        </div>
      </div>

      <div className="studio__layer studio__phone" aria-hidden="true">
        <div className="studio__float">
          <div className="device">
            <div className="device__screen">
              <div className="device__notch" />
              <div className="app">
                <div className="app__head"><span>Today</span><i className="app__dot" /></div>
                <div className="app__card"><small>Field visit</small><strong>3 tasks</strong><div className="app__bar"><i /></div></div>
                <div className="app__list">
                  <span><i className="ok" />Visit logged</span>
                  <span><i className="ok" />Stock checked</span>
                  <span><i />Confirm order</span>
                </div>
                <div className="app__btn">Confirm order</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="studio__layer studio__toast" aria-hidden="true"><span className="toast"><i />Order synced to CRM</span></div>
    </div>
  );
}
