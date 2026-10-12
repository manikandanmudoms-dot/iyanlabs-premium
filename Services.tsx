import { useEffect, useRef, useState } from 'react';
import { SERVICES, SERVICES_INTRO, type Service } from '../../content/site';
import { gsap, registerLoop, unregisterLoop, type Conditions } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { selectContactTopic } from '../../lib/contactIntent';
import { ButtonLink } from '../ui/Button';
import { Split } from '../ui/Split';
import { ApiVisual, CrmVisual, MobileVisual } from '../visuals/ServiceVisuals';
import './Services.css';

const VISUALS = { salesforce: CrmVisual, mulesoft: ApiVisual, mobile: MobileVisual } as const;

/* ---------------- Per-service choreography ---------------- */
function salesforceMotion(c: Conditions, el: HTMLElement): void | (() => void) {
  {
    const v = el.querySelector<HTMLElement>('.crmv')!;
    const tl = gsap.timeline({ scrollTrigger: { trigger: v, start: 'top 75%', toggleActions: 'play none none reverse' } });
    tl.fromTo(v, { clipPath: 'inset(0% 100% 0% 0% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.3, ease: 'expo.inOut' })
      .from('.crmv__window', { y: 40, scale: 0.94, duration: 1.2, ease: 'expo.out' }, 0.5)
      .from('.crmv__dot', { backgroundColor: '#FBF8F3', color: '#5E5750', borderColor: '#E2D6C3', duration: 0.35, stagger: 0.45 }, 0.9)
      .from('.crmv__line i', { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, 0.95)
      .from('.crmv__mod', { x: (i: number) => [-30, 30, -20, 25][i], y: (i: number) => [30, -20, 40, 20][i], rotate: (i: number) => [-4, 3, 2, -3][i], autoAlpha: 0, duration: 1, stagger: 0.1 }, 1.0);

    if (c.desktop && c.fine) {
      const win = el.querySelector<HTMLElement>('.crmv__window')!;
      const rx = gsap.quickTo(win, 'rotateX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(win, 'rotateY', { duration: 0.8, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = v.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      };
      const leave = () => { rx(0); ry(0); };
      v.addEventListener('pointermove', move);
      v.addEventListener('pointerleave', leave);
      return () => { v.removeEventListener('pointermove', move); v.removeEventListener('pointerleave', leave); };
    }
  }
}

function mulesoftMotion(c: Conditions, el: HTMLElement): void | (() => void) {
  {
    if (c.mobile) {
      gsap.from(el.querySelectorAll('.apiv__row'), { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: el.querySelector('.apiv__stack'), start: 'top 80%', toggleActions: 'play none none reverse' } });
      return;
    }
    const q = gsap.utils.selector(el);
    const srcs = q('.apiv__src');
    const layers = q('.apiv__layer');
    const routesIn = q('.apiv__route--in .apiv__lit');
    const routesMid = q('.apiv__route--mid .apiv__lit');
    const routesOut = q('.apiv__route--out .apiv__lit');
    const lit = (els: Element[]) => ({ onStart: () => els.forEach((e) => e.classList.add('is-lit')), onReverseComplete: () => els.forEach((e) => e.classList.remove('is-lit')) });

    gsap.set([...routesIn, ...routesMid, ...routesOut], { strokeDashoffset: 1 });
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    srcs.forEach((s, i) => {
      tl.to(s, { duration: 0.15, ...lit([s]) }, i * 0.25).to(routesIn[i], { strokeDashoffset: 0, duration: 0.5 }, i * 0.25);
    });
    tl.to(layers[0], { duration: 0.2, ...lit([layers[0]]) }, '>-0.1')
      .to(routesMid[0], { strokeDashoffset: 0, duration: 0.4 })
      .to(layers[1], { duration: 0.2, ...lit([layers[1]]) })
      .to(routesMid[1], { strokeDashoffset: 0, duration: 0.4 })
      .to(layers[2], { duration: 0.2, ...lit([layers[2]]) })
      .to(routesOut, { strokeDashoffset: 0, duration: 0.6, stagger: 0.15 })
      .from(q('.apiv__dst'), { scale: 0.85, transformOrigin: '50% 50%', autoAlpha: 0.3, duration: 0.4, stagger: 0.15 }, '<0.2');

    if (c.desktop && c.tall) {
      gsap.timeline({ scrollTrigger: { trigger: el, start: () => (el.offsetHeight > window.innerHeight - 96 ? 'top top+=72' : 'center center'), end: '+=120%', scrub: 0.8, pin: true, anticipatePin: 1 } }).add(tl);
    } else {
      tl.pause();
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 65%', onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() } });
    }

    const packets = registerLoop(gsap.fromTo(q('.apiv__packet'), { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 2, ease: 'none', stagger: { each: 0.22, repeat: -1 } }));
    return () => unregisterLoop(packets);
  }
}

function mobileMotion(c: Conditions, el: HTMLElement): void | (() => void) {
  {
    const q = gsap.utils.selector(el);
    gsap.timeline({ scrollTrigger: { trigger: q('.mobv')[0], start: 'top 75%', toggleActions: 'play none none reverse' } })
      .from(q('.mph--hero'), { yPercent: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out' })
      .from(q('.mph--left'), { x: 120, rotate: 0, yPercent: 30, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.25)
      .from(q('.mph--right'), { x: -120, rotate: 0, yPercent: 30, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.25);
    if (!c.mobile) {
      const float = registerLoop(gsap.to(q('.mph--side'), { y: '-=10', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.8 }));
      return () => unregisterLoop(float);
    }
  }
}

const MOTION = { salesforce: salesforceMotion, mulesoft: mulesoftMotion, mobile: mobileMotion } as const;

/* ---------------- Panel ---------------- */
function ServicePanel({ service }: { service: Service }) {
  const ref = useRef<HTMLElement>(null);
  const Visual = VISUALS[service.id];
  const dark = service.id === 'mulesoft';
  useMotion(ref, (c, el) => MOTION[service.id](c, el), [service.id]);

  return (
    <article ref={ref} id={service.id} data-index={service.number}
      className={`svc svc--${service.id}${dark ? ' stage--dark' : ''}`} aria-labelledby={`${service.id}-title`}>
      {dark && <div className="spotlight" aria-hidden="true" />}
      <div className="svc__visual">
        <span className={`svc__tag pill ${dark ? 'pill--live' : 'pill--accent'}`}>{service.visualLabel}</span>
        <Visual />
      </div>
      <div className="svc__content">
        <p className="svc__kicker" data-reveal="up"><span className="svc__num">{service.number}</span>{service.name}</p>
        <Split as="h3" id={`${service.id}-title`} className="t-h3 svc__title" text={service.headline} />
        <p className="svc__desc" data-reveal="up">{service.description}</p>
        <div className="svc__caps">
          <h4 className="t-label svc__caps-title">Capabilities</h4>
          <ul data-stagger="">
            {service.capabilities.map((cap) => (
              <li key={cap}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {cap}
              </li>
            ))}
          </ul>
        </div>
        <div className="svc__value" data-reveal="up">
          <p className="t-label">Business value</p>
          <p>{service.value}</p>
        </div>
        <div data-reveal="up">
          <ButtonLink href="#contact" onClick={() => selectContactTopic(service.topic)} cursorLabel="Talk">
            {service.cta}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function Services() {
  const [current, setCurrent] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  /* Outlined counter rail follows the panel in view (works without GSAP). */
  useEffect(() => {
    const panels = listRef.current?.querySelectorAll<HTMLElement>('.svc');
    if (!panels?.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.index) - 1); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section services stage--light" id="services" data-stage="light" aria-labelledby="services-title">
      <div className="container">
        <div className="services__intro">
          <div className="section-head">
            <p className="eyebrow" data-reveal="up">{SERVICES_INTRO.eyebrow}</p>
            <Split id="services-title" className="t-h2" text={SERVICES_INTRO.headline} />
          </div>
          <p className="t-lead" data-reveal="up">{SERVICES_INTRO.body}</p>
        </div>

        <div className="services__body">
          <aside className="services__rail" aria-hidden="true">
            <span className="services__counter">
              <span className="services__digits" style={{ transform: `translateY(${-current}em)` }}>
                <span>01</span><span>02</span><span>03</span>
              </span>
            </span>
            <span className="services__of">/ 03</span>
            <span className="services__railname">{SERVICES[current].name}</span>
            <span className="services__railbar"><i style={{ transform: `scaleY(${(current + 1) / 3})` }} /></span>
          </aside>
          <div ref={listRef} className="services__list">
            {SERVICES.map((s) => <ServicePanel key={s.id} service={s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
