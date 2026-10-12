import { useRef } from 'react';
import { CHALLENGE } from '../../content/site';
import { gsap, ScrollTrigger } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { Split } from '../ui/Split';
import './Challenge.css';

const FRAGMENTS = [
  { label: 'CRM', kind: 'panel', tone: '#3B82F6', x: -80, y: -60, r: -14 },
  { label: 'Spreadsheets', kind: 'panel', tone: '#94A3B8', x: 60, y: -80, r: 10 },
  { label: '“Where is my order?”', kind: 'chat', tone: '#34D399', x: 100, y: 20, r: 16 },
  { label: 'Orders', kind: 'panel', tone: '#22D3EE', x: -100, y: 60, r: 9 },
  { label: 'Website', kind: 'panel', tone: '#8B5CF6', x: 30, y: 90, r: -12 },
  { label: '“Can someone call me back?”', kind: 'chat', tone: '#EC4899', x: 80, y: 70, r: -16 },
];

const ICONS = [
  'M4 7h6v6H4zM14 11h6v6h-6zM10 10h4',
  'M4 6h16M4 12h10M4 18h6M17 15l3 3-3 3',
  'M4 5h16v11H4zM9 20h6M12 16v4',
];

export function Challenge() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const k = c.mobile ? 0.4 : c.tablet ? 0.7 : 1;
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.fromTo(q('.frag'),
      { x: (i: number) => FRAGMENTS[i].x * k, y: (i: number) => FRAGMENTS[i].y * k, rotate: (i: number) => FRAGMENTS[i].r * k },
      { x: 0, y: 0, rotate: 0, duration: 1, stagger: 0.04 }, 0)
      .fromTo(q('.frag'), { '--glitch': 1 }, { '--glitch': 0, duration: 0.6, stagger: 0.04 }, 0.2)
      .fromTo(q('.frags__sweep'), { xPercent: -120 }, { xPercent: 120, duration: 0.9, ease: 'power1.inOut' }, 0.25)
      .fromTo(q('.frags__link'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.05 }, 0.6)
      .to(q('.frags__state--before'), { yPercent: -100, autoAlpha: 0, duration: 0.25 }, 0.55)
      .fromTo(q('.frags__state--after'), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.25 }, 0.6)
      .from(q('.challenge__card'), { x: 60, autoAlpha: 0, duration: 0.45, stagger: 0.12, ease: 'expo.out' }, 0.1);

    if (c.desktop && c.tall) {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=150%', scrub: 0.8, pin: true, anticipatePin: 1 } }).add(tl);
    } else {
      tl.duration(1.8).pause();
      ScrollTrigger.create({ trigger: q('.frags')[0], start: 'top 75%', onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() });
    }
  });

  return (
    <section ref={ref} className="section challenge" id="approach" aria-labelledby="challenge-title">
      <div className="tech-grid" aria-hidden="true" />
      <div className="spotlight" aria-hidden="true" />
      <div className="container challenge__inner">
        <div className="challenge__copy">
          <div className="section-head">
            <p className="eyebrow" data-reveal="up">{CHALLENGE.eyebrow}</p>
            <Split id="challenge-title" className="t-h2" text={CHALLENGE.headline} />
            <p className="t-lead" data-reveal="up">{CHALLENGE.body}</p>
          </div>
          <ol className="challenge__cards">
            {CHALLENGE.cards.map((card, i) => (
              <li key={card.title} className="challenge__card glass" data-spot="">
                <span className="challenge__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[i]} /></svg>
                </span>
                <div><h3 className="t-h4">{card.title}</h3><p>{card.description}</p></div>
              </li>
            ))}
          </ol>
        </div>

        <div className="frags" role="img" aria-label="Illustration: scattered tools and unanswered customer messages snap into one connected, intelligent workspace.">
          <div className="frags__frame" aria-hidden="true">
            <span className="frags__states">
              <span className="frags__state frags__state--before">Disconnected</span>
              <span className="frags__state frags__state--after">Connected + intelligent</span>
            </span>
          </div>
          <span className="frags__sweep" aria-hidden="true" />
          <svg className="frags__links" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="fl" x1="0" x2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset=".5" stopColor="#3B82F6" /><stop offset="1" stopColor="#22D3EE" /></linearGradient></defs>
            {['M41 41H259', 'M41 159H259', 'M41 41V159', 'M150 41V159', 'M259 41V159'].map((d) => <path key={d} className="frags__link" d={d} pathLength={1} stroke="url(#fl)" />)}
          </svg>
          <div className="frags__grid" aria-hidden="true">
            {FRAGMENTS.map((f) => (
              <div key={f.label} className={`frag frag--${f.kind}`} style={{ ['--tone' as string]: f.tone }}>
                <span className="frag__label">{f.label}</span>
                {f.kind === 'panel' ? <><span className="frag__line" /><span className="frag__line frag__line--short" /></> : <span className="frag__meta">unanswered</span>}
                <i className="frag__dot" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
