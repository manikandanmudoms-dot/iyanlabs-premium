import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GROUPS, SERVICES, SERVICES_INTRO, TONES, type Service } from '../../content/site';
import { gsap } from '../../motion/gsap';
import { getLenis } from '../../motion/GlobalMotion';
import { useMotion } from '../../motion/useMotion';
import { prefillContact } from '../../lib/contactIntent';
import { ButtonLink } from '../ui/Button';
import { ServiceIcon } from '../ui/Icons';
import { Split } from '../ui/Split';
import { ServiceVisual } from '../visuals/ServiceVisuals';
import './Services.css';

const SPAN: Record<string, string> = { salesforce: 'wide', mulesoft: 'narrow', mobile: 'narrow', web: 'wide', agents: 'wide', chatbots: 'narrow' };
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Tile({ s, onOpen }: { s: Service; onOpen: (s: Service, from: HTMLElement) => void }) {
  const ref = useRef<HTMLElement>(null);
  const tone = TONES[s.id];
  return (
    <article ref={ref} id={s.id} className={`tile tile--${SPAN[s.id]} beam glass`} data-spot="" data-tone={tone.color}
      style={{ ['--tone' as string]: tone.color, ['--tone-text' as string]: tone.text }} aria-labelledby={`${s.id}-name`}>
      <div className="tile__top">
        <span className="tile__icon"><ServiceIcon id={s.id} /></span>
        <span className="tile__meta t-label"><span data-decode="">{s.number}</span> · {s.group}</span>
      </div>
      <ServiceVisual id={s.id} />
      <p className="sr-only">{s.visualLabel}: an animated illustration of {s.name.toLowerCase()}.</p>
      <div className="tile__body">
        <h3 id={`${s.id}-name`} className="tile__name">{s.name}</h3>
        <p className="tile__headline">{s.headline}</p>
        <p className="tile__desc">{s.description}</p>
      </div>
      <button type="button" className="tile__open" aria-haspopup="dialog" data-cursor="Open" onClick={() => onOpen(s, ref.current!)}>
        <span>View capabilities</span>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
    </article>
  );
}

function ServiceDialog({ service, from, onClose }: { service: Service | null; from: HTMLElement | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  useLayoutEffect(() => {
    const d = ref.current;
    if (!d || !service) return;
    closing.current = false;
    if (!d.open) d.showModal();
    getLenis()?.stop();
    document.documentElement.classList.add('dialog-open');
    const p = panel.current;
    if (p && from && !reduced()) {
      // Shared-element style transition: grow from the tile's rectangle.
      const a = from.getBoundingClientRect();
      const b = p.getBoundingClientRect();
      gsap.fromTo(p,
        { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: '0 0', borderRadius: 28 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.75, ease: 'expo.out', clearProps: 'transform' });
      gsap.from(p.querySelectorAll('.sd__in'), { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.05, delay: 0.2 });
    }
  }, [service, from]);

  const close = (after?: () => void) => {
    const d = ref.current; const p = panel.current;
    if (!d || closing.current) return;
    closing.current = true;
    const done = () => {
      d.close(); getLenis()?.start(); document.documentElement.classList.remove('dialog-open');
      onClose(); from?.querySelector<HTMLButtonElement>('.tile__open')?.focus({ preventScroll: true }); after?.();
    };
    if (p && !reduced()) gsap.to(p, { y: 30, autoAlpha: 0, scale: 0.97, duration: 0.3, ease: 'power2.in', onComplete: () => { gsap.set(p, { clearProps: 'all' }); done(); } });
    else done();
  };

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCancel = (e: Event) => { e.preventDefault(); close(); };
    d.addEventListener('cancel', onCancel);
    return () => d.removeEventListener('cancel', onCancel);
  });

  const s = service;
  const tone = s ? TONES[s.id] : null;
  return (
    <dialog ref={ref} className="sd" aria-labelledby="sd-title" onClick={(e) => { if (e.target === ref.current) close(); }}>
      {s && tone && (
        <div ref={panel} className="sd__panel beam" style={{ ['--tone' as string]: tone.color, ['--tone-text' as string]: tone.text }} data-tone={tone.color}>
          <button type="button" className="sd__close" onClick={() => close()} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
          <div className="sd__grid">
            <div className="sd__main">
              <p className="sd__meta t-label sd__in"><span className="tile__icon"><ServiceIcon id={s.id} /></span>{s.number} · {s.group} · {s.name}</p>
              <h2 id="sd-title" className="t-h2 sd__title sd__in">{s.headline}</h2>
              <p className="t-lead sd__in">{s.description}</p>
              <div className="sd__value sd__in"><p className="t-label">Business value</p><p>{s.value}</p></div>
              <div className="sd__in">
                <ButtonLink href="#contact" variant="tone" cursorLabel="Talk" onClick={() => { prefillContact({ topic: s.topic }); close(); }}>{s.cta}</ButtonLink>
              </div>
            </div>
            <div className="sd__side">
              <div className="sd__in sd__visual is-in"><ServiceVisual id={s.id} /></div>
              <h3 className="t-label sd__caps-title sd__in">Capabilities</h3>
              <ul className="sd__caps">
                {s.capabilities.map((c) => (
                  <li key={c} className="sd__in"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<{ s: Service; from: HTMLElement } | null>(null);

  /* Tiles run their mini-animations only while visible. */
  useEffect(() => {
    const tiles = ref.current?.querySelectorAll<HTMLElement>('.tile');
    if (!tiles?.length) return;
    if (!('IntersectionObserver' in window)) { tiles.forEach((t) => t.classList.add('is-in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-in', e.isIntersecting)), { threshold: 0.2 });
    tiles.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    q('.bento__group').forEach((g) => {
      gsap.from(g.querySelectorAll('.tile'), {
        y: 80, rotateX: c.mobile ? 0 : 12, autoAlpha: 0, transformPerspective: 1200, duration: 1.2, stagger: 0.12,
        scrollTrigger: { trigger: g, start: 'top 82%', toggleActions: 'play none none reverse' },
      });
      gsap.from(g.querySelector('.bento__label'), { x: -30, autoAlpha: 0, duration: 0.9, scrollTrigger: { trigger: g, start: 'top 85%', toggleActions: 'play none none reverse' } });
    });
    if (c.desktop && c.fine) {
      const offs = q('.tile').map((t) => {
        const rx = gsap.quickTo(t, 'rotateX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(t, 'rotateY', { duration: 0.6, ease: 'power3.out' });
        gsap.set(t, { transformPerspective: 1400 });
        const move = (e: Event) => { const p = e as PointerEvent; const b = t.getBoundingClientRect(); ry(((p.clientX - b.left) / b.width - 0.5) * 6); rx(-((p.clientY - b.top) / b.height - 0.5) * 6); };
        const leave = () => { rx(0); ry(0); };
        t.addEventListener('pointermove', move); t.addEventListener('pointerleave', leave);
        return () => { t.removeEventListener('pointermove', move); t.removeEventListener('pointerleave', leave); };
      });
      return () => offs.forEach((f) => f());
    }
  });

  return (
    <section ref={ref} className="section services" id="services" aria-labelledby="services-title">
      <div className="aurora aurora--soft" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="services__intro">
          <div className="section-head">
            <p className="eyebrow" data-reveal="up">{SERVICES_INTRO.eyebrow}</p>
            <Split id="services-title" className="t-h2" text={SERVICES_INTRO.headline} />
          </div>
          <p className="t-lead" data-reveal="up">{SERVICES_INTRO.body}</p>
        </div>

        <div className="bento">
          {GROUPS.map((g) => (
            <div key={g.name} className="bento__group">
              <p className="bento__label"><span className="t-label">{g.name}</span><span className="bento__blurb">{g.blurb}</span></p>
              <div className="bento__row">
                {SERVICES.filter((s) => s.group === g.name).map((s) => <Tile key={s.id} s={s} onOpen={(svc, from) => setOpen({ s: svc, from })} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ServiceDialog service={open?.s ?? null} from={open?.from ?? null} onClose={() => setOpen(null)} />
    </section>
  );
}
