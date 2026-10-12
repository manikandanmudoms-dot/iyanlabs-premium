import { useRef } from 'react';
import { FOOTER, LINKS, NAV, SERVICES, TONES } from '../../content/site';
import { gsap } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { Logo } from '../ui/Logo';
import './Footer.css';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  /* Curtain reveal: content rises from beneath; the wordmark slides together (scrubbed). */
  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } })
      .fromTo(q('.footer__inner'), { yPercent: c.mobile ? -10 : -30 }, { yPercent: 0, ease: 'none' }, 0)
      .fromTo(q('.footer__mark-line'), { xPercent: (i: number) => (i ? -20 : 20) }, { xPercent: 0, ease: 'none' }, 0)
      .fromTo(q('.footer__floor'), { rotateX: 80, autoAlpha: 0 }, { rotateX: 62, autoAlpha: 1, ease: 'none' }, 0);
  });

  return (
    <footer ref={ref} className="footer">
      <div className="footer__floor" aria-hidden="true" />
      <div className="footer__horizon" aria-hidden="true" />
      <div className="footer__inner">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <a href="#top" aria-label="iyanLabs, back to top" className="footer__logo" data-cursor="Top"><Logo /></a>
              <p className="footer__desc">{FOOTER.description}</p>
            </div>
            <nav className="footer__nav" aria-label="Footer">
              <div>
                <h2 className="t-label">Services</h2>
                <ul>{SERVICES.map((s) => <li key={s.id}><a href={`#${s.id}`} style={{ ['--c' as string]: TONES[s.id].color }}>{s.name}</a></li>)}</ul>
              </div>
              <div>
                <h2 className="t-label">Explore</h2>
                <ul>{NAV.filter((n) => n.href !== '#services').map((n) => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}</ul>
              </div>
              <div>
                <h2 className="t-label">Connect</h2>
                <ul>
                  <li><a href="#contact">Contact</a></li>
                  <li><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></li>
                  <li><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
        <p className="footer__mark">
          <span className="sr-only">{FOOTER.tagline}</span>
          <span className="footer__mark-line" aria-hidden="true">We Build</span>
          <span className="footer__mark-line grad" aria-hidden="true">Different.</span>
        </p>
        <div className="container footer__bottom">
          <p>© {year} iyanLabs. All rights reserved.</p>
          <p className="footer__motto">Understand. Connect. Build. Automate.</p>
        </div>
      </div>
    </footer>
  );
}
