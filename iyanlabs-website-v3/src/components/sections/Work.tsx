import { useRef } from 'react';
import { LINKS, TONES, WORK } from '../../content/site';
import { decode } from '../../lib/decode';
import { gsap, ScrollTrigger, registerLoop, unregisterLoop } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { prefillContact } from '../../lib/contactIntent';
import { ButtonLink } from '../ui/Button';
import { ServiceIcon } from '../ui/Icons';
import { Split } from '../ui/Split';
import './Work.css';

function VaravuDevices() {
  return (
    <div className="vv" role="img" aria-label="Illustration: Varavu on desktop, tablet and mobile: a billing dashboard with a revenue trend and recent invoices, an invoice view, and a payment received notification.">
      <div className="vv__desktop vv__dev" aria-hidden="true">
        <div className="vv__chrome"><i /><i /><i /><span>Varavu · Dashboard</span></div>
        <div className="vv__dash">
          <div className="vv__kpis">
            <div><small>Revenue</small><b className="vv__bar vv__bar--a" /></div>
            <div><small>Paid</small><b className="vv__bar vv__bar--b" /></div>
            <div><small>Due</small><b className="vv__bar vv__bar--c" /></div>
          </div>
          <div className="vv__chart">
            <svg viewBox="0 0 300 90" preserveAspectRatio="none">
              <defs><linearGradient id="vvg" x1="0" x2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset=".6" stopColor="#3B82F6" /><stop offset="1" stopColor="#22D3EE" /></linearGradient>
                <linearGradient id="vva" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="rgba(59,130,246,.35)" /><stop offset="1" stopColor="rgba(59,130,246,0)" /></linearGradient></defs>
              <path className="vv__area" d="M0 70 C 40 60, 60 72, 90 55 S 150 30, 180 42 S 240 20, 300 14 V90 H0Z" fill="url(#vva)" />
              <path className="vv__line" d="M0 70 C 40 60, 60 72, 90 55 S 150 30, 180 42 S 240 20, 300 14" pathLength={1} stroke="url(#vvg)" />
            </svg>
          </div>
          <div className="vv__table">
            {['Paid', 'Paid', 'Due'].map((s, i) => <div key={i} className="vv__row"><span>INV-{208 + i}</span><span className="vv__ln" /><em className={s === 'Due' ? 'due' : ''}>{s}</em></div>)}
          </div>
        </div>
      </div>
      <div className="vv__tablet vv__dev" aria-hidden="true">
        <div className="vv__tab-screen">
          <p className="vv__h">Invoice</p>
          <div className="vv__inv"><span className="vv__ln" /><span className="vv__ln vv__ln--s" /><div className="vv__inv-rows"><i /><i /><i /></div><div className="vv__inv-total"><span>Total</span><b /></div></div>
          <span className="vv__send">Send invoice</span>
        </div>
      </div>
      <div className="vv__phone vv__dev" aria-hidden="true">
        <div className="vv__ph-screen">
          <p className="vv__h">Reminders</p>
          <div className="vv__remind"><i />Payment due</div>
          <div className="vv__remind vv__remind--ok"><i />Payment received</div>
          <span className="vv__sync"><i />Synced</span>
        </div>
      </div>
      <span className="vv__toast" aria-hidden="true"><i>✓</i>Payment received</span>
    </div>
  );
}

export function Work() {
  const ref = useRef<HTMLElement>(null);
  const { varavu, portfolio } = WORK;

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const loops: gsap.core.Animation[] = [];
    const far = c.mobile ? 50 : 140;
    // Devices assemble from glass shards (clip-path polygons resolving to full rectangles).
    gsap.timeline({ scrollTrigger: { trigger: q('.vv')[0], start: 'top 75%', toggleActions: 'play none none reverse' } })
      .fromTo(q('.vv__dev'),
        { clipPath: (i: number) => ['polygon(10% 30%, 60% 0%, 90% 50%, 40% 100%)', 'polygon(50% 0%, 100% 40%, 60% 100%, 0% 60%)', 'polygon(0% 20%, 80% 0%, 100% 90%, 30% 100%)'][i], x: (i: number) => [-far, 0, far][i], y: (i: number) => [0, far, 0][i], rotate: (i: number) => [-6, 4, 8][i], autoAlpha: 0, filter: 'blur(8px)' },
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', x: 0, y: 0, rotate: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1.4, stagger: 0.15, ease: 'expo.out' })
      .fromTo(q('.vv__line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power3.inOut' }, 0.6)
      .from(q('.vv__area'), { autoAlpha: 0, duration: 0.8 }, 1.2)
      .from(q('.vv__bar'), { scaleX: 0, transformOrigin: 'left', duration: 0.9, stagger: 0.12 }, 0.7)
      .from(q('.vv__row'), { x: -20, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, 0.9)
      .from(q('.vv__toast'), { y: 30, scale: 0.7, autoAlpha: 0, duration: 1, ease: 'elastic.out(1, 0.6)' }, 1.6);
    if (!c.mobile) loops.push(registerLoop(gsap.to(q('.vv__phone'), { y: -8, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })));

    // Verified figures: count up with a decode flicker, once.
    q('[data-count]').forEach((n) => {
      const end = Number((n as HTMLElement).dataset.count);
      const obj = { v: 0 };
      n.textContent = '0';
      ScrollTrigger.create({
        trigger: n, start: 'top 90%', once: true,
        onEnter: () => gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => { n.textContent = String(Math.round(obj.v)); }, onComplete: () => { decode(n as HTMLElement, String(end), 400); } }),
      });
    });
    return () => { loops.forEach(unregisterLoop); q('[data-count]').forEach((n) => { n.textContent = (n as HTMLElement).dataset.count ?? ''; }); };
  });

  return (
    <section ref={ref} className="section work" id="work" aria-labelledby="work-title">
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal="up">{WORK.eyebrow}</p>
          <Split id="work-title" className="t-h2" text={WORK.headline} />
          <p className="t-lead" data-reveal="up">{WORK.body}</p>
        </div>

        <article className="varavu beam" aria-labelledby="varavu-title" data-reveal="clip" style={{ ['--tone' as string]: '#FF6B3D' }}>
          <div className="varavu__copy">
            <span className="pill pill--live" style={{ ['--tone' as string]: '#FF6B3D' }}>Our own product</span>
            <h3 id="varavu-title" className="varavu__title">
              <span className="varavu__name">{varavu.name}</span>
              <span className="varavu__headline grad">{varavu.headline}</span>
            </h3>
            <p className="varavu__desc">{varavu.description}</p>
            <ul className="varavu__features" data-stagger="">
              {varavu.features.map((f) => <li key={f}><span aria-hidden="true" />{f}</li>)}
            </ul>
            <div className="varavu__ctas">
              <ButtonLink href={LINKS.varavu} target="_blank" icon="external">Explore Varavu</ButtonLink>
              <ButtonLink href="#contact" variant="ghost" icon="none" onClick={() => prefillContact({ topic: 'Other', message: 'I’d like to know more about Varavu.' })}>Ask about Varavu</ButtonLink>
            </div>
          </div>
          <div className="varavu__visual"><VaravuDevices /></div>
        </article>

        <div className="portfolio">
          <div className="portfolio__head">
            <h3 className="t-h3" data-reveal="up">{portfolio.title}</h3>
            <ul className="portfolio__figures" aria-label="Published delivery record">
              {portfolio.figures.map((f) => (
                <li key={f.label}><b><span data-count={f.value}>{f.value}</span>{f.suffix}</b><span>{f.label}</span></li>
              ))}
            </ul>
          </div>
          <ul className="portfolio__grid" data-stagger="">
            {portfolio.items.map((item) => (
              <li key={item.title} className="concept glass" data-spot="" data-tone={TONES[item.id].color} data-cursor="Concept" style={{ ['--tone' as string]: TONES[item.id].color, ['--tone-text' as string]: TONES[item.id].text }}>
                <span className="concept__icon" aria-hidden="true"><ServiceIcon id={item.id} size={20} /></span>
                <p className="concept__meta"><span className="concept__badge">Illustrative concept</span></p>
                <h4 className="t-h4">{item.title}</h4>
                <p className="concept__desc">{item.description}</p>
              </li>
            ))}
          </ul>
          <p className="portfolio__note">{portfolio.note}</p>
        </div>
      </div>
    </section>
  );
}
