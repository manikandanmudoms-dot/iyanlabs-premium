import { useRef } from 'react';
import { CHALLENGE } from '../../content/site';
import { gsap, ScrollTrigger } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { Split } from '../ui/Split';
import './Challenge.css';

const FRAGMENTS = [
  { label: 'CRM', tone: 'ink', x: -70, y: -50, r: -12 },
  { label: 'Spreadsheets', tone: 'sand', x: 50, y: -70, r: 9 },
  { label: 'Email threads', tone: 'sand', x: 90, y: 20, r: 14 },
  { label: 'Orders', tone: 'tc', x: -90, y: 50, r: 8 },
  { label: 'Reports', tone: 'sand', x: 20, y: 80, r: -10 },
  { label: 'Mobile', tone: 'ink', x: 70, y: 60, r: -15 },
];

const ICONS = [
  <path key="a" d="M4 7h6v6H4zM14 11h6v6h-6zM10 10h4" />,
  <path key="b" d="M4 6h16M4 12h10M4 18h6M17 15l3 3-3 3" />,
  <path key="c" d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2" />,
];

export function Challenge() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (c, el) => {
    const frags = gsap.utils.toArray<HTMLElement>('.frag', el);
    const k = c.mobile ? 0.4 : c.tablet ? 0.7 : 1;

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.fromTo(frags, { x: (i: number) => FRAGMENTS[i].x * k, y: (i: number) => FRAGMENTS[i].y * k, rotate: (i: number) => FRAGMENTS[i].r * k, boxShadow: '0 24px 40px -16px rgba(20,20,22,0.35)' },
      { x: 0, y: 0, rotate: 0, boxShadow: '0 1px 2px rgba(20,20,22,0.05)', duration: 1, stagger: 0.04 }, 0)
      .fromTo('.frags__link', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.05 }, 0.55)
      .to('.frags__state--before', { yPercent: -100, autoAlpha: 0, duration: 0.25 }, 0.5)
      .fromTo('.frags__state--after', { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.25 }, 0.55)
      .fromTo('.frag__dot', { backgroundColor: '#E2D6C3' }, { backgroundColor: '#C8643B', duration: 0.3, stagger: 0.04 }, 0.7)
      .from('.challenge__card', { x: 60, autoAlpha: 0, duration: 0.45, stagger: 0.12, ease: 'expo.out' }, 0.1);

    if (c.desktop && c.tall) {
      // Pinned, scrubbed and fully reversible.
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=150%', scrub: 0.8, pin: true, anticipatePin: 1 } }).add(tl);
    } else {
      // Lighter in-view version for tablet / short screens / mobile.
      tl.duration(1.6).pause();
      ScrollTrigger.create({ trigger: el.querySelector('.frags'), start: 'top 75%', onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() });
    }
  });

  return (
    <section ref={ref} className="section challenge stage--light" id="approach" data-stage="light" aria-labelledby="challenge-title">
      <div className="container challenge__inner">
        <div className="challenge__copy">
          <div className="section-head">
            <p className="eyebrow" data-reveal="up">{CHALLENGE.eyebrow}</p>
            <Split id="challenge-title" className="t-h2" text={CHALLENGE.headline} />
            <p className="t-lead" data-reveal="up">{CHALLENGE.body}</p>
          </div>
          <ol className="challenge__cards">
            {CHALLENGE.cards.map((card, i) => (
              <li key={card.title} className="challenge__card">
                <span className="challenge__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[i]}</svg>
                </span>
                <div>
                  <h3 className="t-h4">{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="frags" role="img" aria-label="Illustration: scattered business tools — CRM, spreadsheets, email, orders, reports and mobile — align and connect into one workspace.">
          <div className="frags__frame" aria-hidden="true">
            <span className="frags__states">
              <span className="frags__state frags__state--before">Disconnected</span>
              <span className="frags__state frags__state--after">Connected workspace</span>
            </span>
          </div>
          <svg className="frags__links" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
            <path className="frags__link" d="M41 41H259" pathLength={1} />
            <path className="frags__link" d="M41 159H259" pathLength={1} />
            <path className="frags__link" d="M41 41V159" pathLength={1} />
            <path className="frags__link" d="M150 41V159" pathLength={1} />
            <path className="frags__link" d="M259 41V159" pathLength={1} />
          </svg>
          <div className="frags__grid" aria-hidden="true">
            {FRAGMENTS.map((f) => (
              <div key={f.label} className={`frag frag--${f.tone}`}>
                <span className="frag__label">{f.label}</span>
                <span className="frag__line" />
                <span className="frag__line frag__line--short" />
                <i className="frag__dot" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
