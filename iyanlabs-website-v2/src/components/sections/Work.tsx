import { useRef } from 'react';
import { LINKS, WORK } from '../../content/site';
import { gsap, registerLoop, unregisterLoop } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { selectContactTopic } from '../../lib/contactIntent';
import { ButtonLink } from '../ui/Button';
import { Split } from '../ui/Split';
import './Work.css';

function VaravuDevices() {
  return (
    <div className="vv" role="img" aria-label="Illustration: Varavu on desktop, tablet and mobile — a billing dashboard with a revenue trend and recent invoices, an invoice view, and a payment received notification.">
      <div className="vv__desktop" aria-hidden="true">
        <div className="vv__chrome"><i /><i /><i /><span>Varavu · Dashboard</span></div>
        <div className="vv__dash">
          <div className="vv__kpis">
            <div><small>Revenue</small><b className="vv__bar vv__bar--a" /></div>
            <div><small>Paid</small><b className="vv__bar vv__bar--b" /></div>
            <div><small>Due</small><b className="vv__bar vv__bar--c" /></div>
          </div>
          <div className="vv__chart">
            <svg viewBox="0 0 300 90" preserveAspectRatio="none">
              <path className="vv__area" d="M0 70 C 40 60, 60 72, 90 55 S 150 30, 180 42 S 240 20, 300 14 V90 H0Z" />
              <path className="vv__line" d="M0 70 C 40 60, 60 72, 90 55 S 150 30, 180 42 S 240 20, 300 14" pathLength={1} />
            </svg>
          </div>
          <div className="vv__table">
            {['Paid', 'Paid', 'Due'].map((s, i) => (
              <div key={i} className="vv__row"><span>INV-{208 + i}</span><span className="vv__ln" /><em className={s === 'Due' ? 'due' : ''}>{s}</em></div>
            ))}
          </div>
        </div>
      </div>
      <div className="vv__tablet" aria-hidden="true">
        <div className="vv__tab-screen">
          <p className="vv__h">Invoice</p>
          <div className="vv__inv">
            <span className="vv__ln" /><span className="vv__ln vv__ln--s" />
            <div className="vv__inv-rows"><i /><i /><i /></div>
            <div className="vv__inv-total"><span>Total</span><b /></div>
          </div>
          <span className="vv__send">Send invoice</span>
        </div>
      </div>
      <div className="vv__phone" aria-hidden="true">
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

function ConceptArt({ kind }: { kind: string }) {
  return (
    <div className={`concept__art concept__art--${kind}`} aria-hidden="true">
      {kind === 'flow' && <div className="ca-flow"><span className="ca-chip">Intake</span><i /><span className="ca-chip">Diagnose</span><i /><span className="ca-chip is-now">Resolve</span></div>}
      {kind === 'sync' && <div className="ca-sync"><span className="ca-box">CRM</span><i /><span className="ca-box ca-box--api">API</span><i /><span className="ca-box">ERP</span></div>}
      {kind === 'phone' && <div className="ca-phone"><span className="ca-row is-done" /><span className="ca-row is-done" /><span className="ca-row" /><span className="ca-btn" /></div>}
    </div>
  );
}

export function Work() {
  const ref = useRef<HTMLElement>(null);
  const { varavu, portfolio } = WORK;

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const loops: gsap.core.Animation[] = [];
    const far = c.mobile ? 60 : 160;

    gsap.timeline({ scrollTrigger: { trigger: q('.vv')[0], start: 'top 75%', toggleActions: 'play none none reverse' } })
      .from(q('.vv__desktop'), { x: -far, autoAlpha: 0, rotateY: c.mobile ? 0 : 12, duration: 1.3, ease: 'expo.out' })
      .from(q('.vv__tablet'), { y: far, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.2)
      .from(q('.vv__phone'), { x: far, autoAlpha: 0, rotate: 8, duration: 1.2, ease: 'expo.out' }, 0.35)
      .fromTo(q('.vv__line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power3.inOut' }, 0.6)
      .from(q('.vv__area'), { autoAlpha: 0, duration: 0.8 }, 1.2)
      .from(q('.vv__bar'), { scaleX: 0, transformOrigin: 'left', duration: 0.9, stagger: 0.12 }, 0.7)
      .from(q('.vv__row'), { x: -20, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, 0.9)
      .from(q('.vv__toast'), { y: 30, scale: 0.9, autoAlpha: 0, duration: 0.8, ease: 'back.out(2)' }, 1.5);

    if (!c.mobile) loops.push(registerLoop(gsap.to(q('.vv__phone'), { y: -8, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })));

    /* Verified figures count up once. */
    q('[data-count]').forEach((n) => {
      const end = Number((n as HTMLElement).dataset.count);
      const obj = { v: 0 };
      n.textContent = '0';
      gsap.to(obj, {
        v: end, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: n, start: 'top 90%', once: true },
        onUpdate: () => { n.textContent = String(Math.round(obj.v)); },
      });
    });

    /* Concept cards: tilt on hover (desktop). */
    if (c.desktop && c.fine) {
      const cleanups = q('.concept').map((card) => {
        const rx = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3.out' });
        const move = (e: Event) => {
          const pe = e as PointerEvent; const r = card.getBoundingClientRect();
          ry(((pe.clientX - r.left) / r.width - 0.5) * 10); rx(-((pe.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => { rx(0); ry(0); };
        card.addEventListener('pointermove', move); card.addEventListener('pointerleave', leave);
        return () => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); };
      });
      return () => { cleanups.forEach((f) => f()); loops.forEach(unregisterLoop); q('[data-count]').forEach((n) => { n.textContent = (n as HTMLElement).dataset.count ?? ''; }); };
    }
    return () => { loops.forEach(unregisterLoop); q('[data-count]').forEach((n) => { n.textContent = (n as HTMLElement).dataset.count ?? ''; }); };
  });

  return (
    <section ref={ref} className="section work stage--light" id="work" data-stage="light" aria-labelledby="work-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal="up">{WORK.eyebrow}</p>
          <Split id="work-title" className="t-h2" text={WORK.headline} />
          <p className="t-lead" data-reveal="up">{WORK.body}</p>
        </div>

        <article className="varavu" aria-labelledby="varavu-title" data-reveal="clip">
          <div className="varavu__copy">
            <span className="pill pill--accent">Our own product</span>
            <h3 id="varavu-title" className="varavu__title">
              <span className="varavu__name">{varavu.name}</span>
              <span className="varavu__headline accent">{varavu.headline}</span>
            </h3>
            <p className="varavu__desc">{varavu.description}</p>
            <ul className="varavu__features" data-stagger="">
              {varavu.features.map((f) => <li key={f}><span aria-hidden="true" />{f}</li>)}
            </ul>
            <div className="varavu__ctas">
              <ButtonLink href={LINKS.varavu} target="_blank" icon="external">Explore Varavu</ButtonLink>
              <ButtonLink href="#contact" variant="outline" icon="none" onClick={() => selectContactTopic('Other')}>Ask about Varavu</ButtonLink>
            </div>
          </div>
          <div className="varavu__visual"><VaravuDevices /></div>
        </article>

        <div className="portfolio">
          <div className="portfolio__head">
            <h3 className="t-h3" data-reveal="up">{portfolio.title}</h3>
            <ul className="portfolio__figures" aria-label="Published delivery record">
              {portfolio.figures.map((f) => (
                <li key={f.label}>
                  <b><span data-count={f.value}>{f.value}</span>{f.suffix}</b>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="portfolio__grid" data-stagger="">
            {portfolio.items.map((item) => (
              <li key={item.title} className="concept" data-cursor="Concept">
                <ConceptArt kind={item.kind} />
                <div className="concept__body">
                  <p className="concept__meta"><span className="t-label">{item.category}</span><span className="concept__badge">Illustrative concept</span></p>
                  <h4 className="t-h4">{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="portfolio__note">{portfolio.note}</p>
        </div>
      </div>
    </section>
  );
}
