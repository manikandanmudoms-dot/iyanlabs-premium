import { useRef } from 'react';
import { ABOUT } from '../../content/site';
import { gsap } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { ParticleField } from '../visuals/ParticleField';
import { Split } from '../ui/Split';
import './About.css';

const ICONS = [
  'M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  'M8 7 3 12l5 5M16 7l5 5-5 5M13.5 5l-3 14',
  'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4',
  'M4 20 20 4M20 4h-7M20 4v7M4 13v7h7',
];
const TONES = ['#22D3EE', '#8B5CF6', '#EC4899', '#34D399'];

export function About() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (_c, el) => {
    const q = gsap.utils.selector(el);
    gsap.timeline({ scrollTrigger: { trigger: q('.about__values')[0], start: 'top 80%', toggleActions: 'play none none reverse' } })
      .from(q('.about__value'), { y: 60, autoAlpha: 0, scale: 0.96, duration: 1.1, stagger: 0.1 })
      .fromTo(q('.about__icon path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.1, ease: 'power3.inOut' }, 0.3);
    gsap.from(q('.leader'), { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.1, scrollTrigger: { trigger: q('.leaders')[0], start: 'top 85%', toggleActions: 'play none none reverse' } });
  });

  return (
    <section ref={ref} className="section about" id="about" aria-labelledby="about-title">
      <ParticleField density={0.45} />
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="about__top">
          <div className="section-head about__head">
            <p className="eyebrow" data-reveal="up">{ABOUT.eyebrow}</p>
            <Split id="about-title" className="t-h2" text={ABOUT.headline} />
            <p className="t-lead" data-reveal="up">{ABOUT.body}</p>
          </div>
          <ul className="about__values">
            {ABOUT.values.map((v, i) => (
              <li key={v.title} className="about__value glass" data-spot="" style={{ ['--tone' as string]: TONES[i] }}>
                <span className="about__icon" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24"><path d={ICONS[i]} pathLength={1} /></svg></span>
                <span className="about__idx t-label" aria-hidden="true">0{i + 1}</span>
                <h3 className="t-h4">{v.title}</h3>
                <p>{v.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="leaders">
          <h3 className="t-label leaders__title">Practice leadership</h3>
          <ul className="leaders__grid">
            {ABOUT.leaders.map((l) => (
              <li key={l.name} className="leader glass" style={{ ['--tone' as string]: l.tone }}>
                <span className="leader__mono" aria-hidden="true"><span>{l.initials}</span></span>
                <div><p className="leader__name">{l.name}</p><p className="leader__role">{l.role}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
