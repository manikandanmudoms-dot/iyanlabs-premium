import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { BUILD, CTA, FAQ, HERO, INDUSTRIES, SHIPPED, SUBNAV, TECH, TESTIMONIALS, TONE, WHY, WORKING } from '../../content/approach';
import { decode } from '../../lib/decode';
import { prefillContact } from '../../lib/contactIntent';
import { gsap, ScrollTrigger, registerLoop, unregisterLoop } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { useRouter } from '../../router';
import { ButtonLink } from '../ui/Button';
import { Split } from '../ui/Split';
import { ParticleField } from '../visuals/ParticleField';
import './approach.css';

const css = (o: Record<string, string | number>) => o as CSSProperties;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={d} pathLength={1} /></svg>
);

/* ------------------------------------------------------------------ */
/* 1 · Hero                                                            */
/* ------------------------------------------------------------------ */
export function ApHero() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(q('.ap-crumb, .ap-hero .eyebrow'), { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.08 })
      .from(q('.ap-hero__title .w__i'), { yPercent: 120, rotate: 4, filter: 'blur(10px)', duration: 1.2, stagger: 0.08 }, '-=0.4')
      .from(q('.ap-core'), { scale: 0.1, autoAlpha: 0, filter: 'blur(20px) brightness(3)', duration: 1.6 }, 0.1)
      .fromTo(q('.ap-orbit__path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power3.inOut' }, 0.5)
      .from(q('.ap-phase'), { scale: 0, autoAlpha: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(2.4)' }, 0.9)
      .from([q('.ap-hero__body'), q('.ap-hero__ctas')], { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.6)
      .from(q('.ap-trust li'), { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.07, onStart: () => q('.ap-trust span').forEach((s) => decode(s as HTMLElement, undefined, 700)) }, 1.0);
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 } })
      .to(q('.ap-hero__visual'), { scale: 0.7, yPercent: 25, autoAlpha: 0.3, ease: 'none' }, 0)
      .to(q('.ap-hero__copy'), { yPercent: -12, autoAlpha: 0.2, ease: 'none' }, 0);
    if (c.desktop && c.fine) {
      const v = q('.ap-hero__visual')[0] as HTMLElement;
      const x = gsap.quickTo(v, 'x', { duration: 1.2, ease: 'power3.out' });
      const y = gsap.quickTo(v, 'y', { duration: 1.2, ease: 'power3.out' });
      const move = (e: PointerEvent) => { x((e.clientX / innerWidth - 0.5) * 26); y((e.clientY / innerHeight - 0.5) * 20); };
      window.addEventListener('pointermove', move, { passive: true });
      return () => window.removeEventListener('pointermove', move);
    }
  });

  return (
    <section ref={ref} className="section ap-hero grain" id="top" aria-labelledby="ap-title">
      <div className="ap-aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="tech-grid" aria-hidden="true" />
      <ParticleField density={0.7} />
      <div className="spotlight" aria-hidden="true" />
      <div className="container ap-hero__inner">
        <div className="ap-hero__copy">
          <nav aria-label="Breadcrumb" className="ap-crumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Our Approach</li></ol></nav>
          <p className="eyebrow">{HERO.eyebrow}</p>
          <Split as="h1" id="ap-title" className="t-display ap-hero__title" text={HERO.headline} manual />
          <p className="t-lead ap-hero__body">{HERO.body}</p>
          <div className="ap-hero__ctas">
            <ButtonLink href="/#contact" size="lg" cursorLabel="Talk">Discuss Your Project</ButtonLink>
            <ButtonLink href="#working" size="lg" variant="ghost" icon="none">See How We Work</ButtonLink>
          </div>
          <ul className="ap-trust" aria-label="At a glance">
            {HERO.trust.map((t) => <li key={t}><span data-text={t}>{t}</span></li>)}
          </ul>
        </div>
        <div className="ap-hero__visual" role="img" aria-label="Illustration: a glowing AI core orbited by the four phases of our approach: Discover, Design, Build and Launch.">
          <svg className="ap-orbit" viewBox="0 0 100 100" aria-hidden="true">
            <defs><linearGradient id="apg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#6366F1" /><stop offset=".5" stopColor="#8B5CF6" /><stop offset="1" stopColor="#22D3EE" /></linearGradient></defs>
            <circle className="ap-orbit__path" cx="50" cy="50" r="44" pathLength={1} />
            <circle className="ap-orbit__ring" cx="50" cy="50" r="36" />
          </svg>
          <div className="ap-core" aria-hidden="true"><img src="/ai-core.webp" alt="" width="800" height="800" decoding="async" /></div>
          {HERO.phases.map((p, i) => (
            <span key={p} className="ap-phase" style={css({ '--a': `${i * 90 - 135}deg` })} aria-hidden="true">
              <b>0{i + 1}</b>{p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky in-page navigation                                           */
/* ------------------------------------------------------------------ */
export function ApSubNav() {
  const [active, setActive] = useState(SUBNAV[0].id);
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const els = SUBNAV.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const list = listRef.current; const bar = barRef.current;
    const a = list?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!list || !bar || !a) return;
    bar.style.width = `${a.offsetWidth}px`;
    bar.style.transform = `translateX(${a.offsetLeft}px)`;
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' });
  }, [active]);
  return (
    <nav className="ap-subnav" aria-label="On this page">
      <div className="ap-subnav__pill">
        <ul ref={listRef}>
          {SUBNAV.map((s) => <li key={s.id}><a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>{s.label}</a></li>)}
          <span ref={barRef} className="ap-subnav__bar" aria-hidden="true" />
        </ul>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · Why companies choose iyanLabs                                   */
/* ------------------------------------------------------------------ */
const WHY_ICONS = [
  'M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4',
  'M4 7h6v6H4zM14 11h6v6h-6zM10 10h4M7 13v4h7',
  'M11 4a7 7 0 1 0 4.9 12M21 21l-5.1-5.1',
  'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4',
];
export function ApWhy() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    gsap.timeline({ scrollTrigger: { trigger: q('.ap-why__grid')[0], start: 'top 80%', toggleActions: 'play none none reverse' } })
      .from(q('.ap-why__card'), { y: 70, rotateX: c.mobile ? 0 : 14, autoAlpha: 0, transformPerspective: 1200, duration: 1.1, stagger: 0.09 })
      .fromTo(q('.ap-why__icon path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.06, ease: 'power3.inOut' }, 0.3)
      .call(() => q('[data-stat]').forEach((s) => decode(s as HTMLElement, undefined, 900)), [], 0.5);
  });
  return (
    <section ref={ref} className="section ap-why" id="why" aria-labelledby="why-title">
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal="up">{WHY.eyebrow}</p>
          <Split id="why-title" className="t-h2" text={WHY.headline} />
        </div>
        <ul className="ap-why__grid">
          {WHY.reasons.map((r, i) => (
            <li key={r.title} className={`ap-why__card glass${r.size === 'lg' ? ' is-lg beam' : ''}`} data-spot="" style={css({ '--tone': ['#22D3EE', '#8B5CF6', '#6366F1', '#22D3EE', '#A5B4FC', '#34D399'][i] })}>
              <span className="ap-why__icon"><Icon d={WHY_ICONS[i]} /></span>
              {r.stat && <p className="ap-why__stat" aria-hidden="true"><span data-stat="" data-text={r.stat}>{r.stat}</span><small>{r.unit}</small></p>}
              <h3 className="t-h4">{r.title}</h3>
              <p className="ap-why__desc">{r.description}</p>
              {r.badges && <p className="ap-why__badges">{r.badges.map((b) => <span key={b}>{b}</span>)}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · What our clients say                                            */
/* ------------------------------------------------------------------ */
export function ApClients() {
  const items = TESTIMONIALS.items;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const touch = useRef(0);
  const go = (n: number) => setI((n + items.length) % items.length);

  useEffect(() => {
    if (paused || reduced() || items.length < 2) return;
    const t = window.setTimeout(() => go(i + 1), 8000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused]);
  useEffect(() => {
    const q = quoteRef.current;
    if (!q || reduced()) return;
    gsap.fromTo(q.querySelectorAll('.ap-q__line'), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.012, ease: 'expo.out' });
  }, [i]);

  const t = items[i];
  const words = t.quote.split(' ');
  return (
    <section className="section ap-clients" id="clients" aria-labelledby="clients-title">
      <div className="ap-aurora ap-aurora--soft" aria-hidden="true"><i /><i /><i /></div>
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow" data-reveal="up">{TESTIMONIALS.eyebrow}</p>
          <Split id="clients-title" className="t-h2" text={TESTIMONIALS.headline} />
        </div>
        <div className="ap-q glass beam" style={css({ '--tone': TONE[t.tone] })}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); }}
          role="region" aria-roledescription="carousel" aria-label="Client testimonials">
          <span className="ap-q__mark" aria-hidden="true">“</span>
          <div aria-live={paused ? 'polite' : 'off'}>
            <blockquote ref={quoteRef} key={i} className="ap-q__text">
              {words.map((w, k) => <span key={k} className="ap-q__mask"><span className="ap-q__line">{w}</span>{' '}</span>)}
            </blockquote>
            <div className="ap-q__who">
              <span className="ap-q__avatar" aria-hidden="true"><span>{t.initials}</span></span>
              <div><p className="ap-q__name">{t.name}</p><p className="ap-q__role">{t.role}</p></div>
              <span className="ap-q__tag">{t.tag}</span>
            </div>
          </div>
          {items.length > 1 && (
            <div className="ap-q__ctrl">
              <button type="button" onClick={() => go(i - 1)} aria-label="Previous testimonial">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <ol className="ap-q__dots">
                {items.map((x, k) => (
                  <li key={x.name}><button type="button" aria-label={`Show testimonial ${k + 1} of ${items.length}`} aria-current={k === i ? 'true' : undefined} onClick={() => go(k)}>
                    <i className={k === i && !paused && !reduced() ? 'is-run' : ''} />
                  </button></li>
                ))}
              </ol>
              <button type="button" onClick={() => go(i + 1)} aria-label="Next testimonial">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" className="ap-q__pause" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>{paused ? 'Play' : 'Pause'}</button>
            </div>
          )}
        </div>
        <p className="ap-note">Quotes shared by clients on iyanlabs.com.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · What we build                                                   */
/* ------------------------------------------------------------------ */
export function ApBuild() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const spread = c.mobile ? 0.3 : 1;
    gsap.timeline({ scrollTrigger: { trigger: q('.ap-build__grid')[0], start: 'top 78%', toggleActions: 'play none none reverse' } })
      .from(q('.ap-build__card'), {
        x: () => gsap.utils.random(-180, 180) * spread, y: () => gsap.utils.random(-120, 160) * spread, rotate: () => gsap.utils.random(-16, 16) * spread,
        scale: 0.7, autoAlpha: 0, filter: 'blur(6px)', duration: 1.3, stagger: { each: 0.06, from: 'random' }, ease: 'expo.out',
      })
      .fromTo(q('.ap-build__links path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.15, ease: 'power3.inOut' }, 0.9)
      .fromTo(q('.ap-build__card .ap-ico path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.05, ease: 'power3.inOut' }, 0.6);
    if (c.desktop && c.fine) {
      const offs = q('.ap-build__card').map((card) => {
        const rx = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3.out' });
        gsap.set(card, { transformPerspective: 900 });
        const mv = (e: Event) => { const p = e as PointerEvent; const b = card.getBoundingClientRect(); ry(((p.clientX - b.left) / b.width - 0.5) * 12); rx(-((p.clientY - b.top) / b.height - 0.5) * 12); };
        const lv = () => { rx(0); ry(0); };
        card.addEventListener('pointermove', mv); card.addEventListener('pointerleave', lv);
        return () => { card.removeEventListener('pointermove', mv); card.removeEventListener('pointerleave', lv); };
      });
      return () => offs.forEach((f) => f());
    }
  });
  return (
    <section ref={ref} className="section ap-build" id="build" aria-labelledby="build-title">
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal="up">{BUILD.eyebrow}</p>
          <Split id="build-title" className="t-h2" text={BUILD.headline} />
        </div>
        <div className="ap-build__wrap">
          <svg className="ap-build__links" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
            <path d="M37.5 12 C 50 12, 50 38, 62.5 38" pathLength={1} />
            <path d="M62.5 38 C 75 38, 75 38, 87.5 38" pathLength={1} />
            <path d="M37.5 12 C 50 12, 50 12, 62.5 12" pathLength={1} />
          </svg>
          <ul className="ap-build__grid">
            {BUILD.items.map((b, k) => (
              <li key={b.title} className="ap-build__card glass" data-spot="" data-tone={TONE[b.tone]} style={css({ '--tone': TONE[b.tone] })}>
                <span className="ap-build__num t-label">{String(k + 1).padStart(2, '0')}</span>
                <span className="ap-ico"><Icon d={b.icon} size={24} /></span>
                <h3 className="t-h4">{b.title}</h3>
                <p>{b.description}</p>
                <span className="ap-build__pulse" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · What working with us looks like                                 */
/* ------------------------------------------------------------------ */
export function ApWorking() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const track = q('.ap-work__track')[0] as HTMLElement;
    const steps = q('.ap-work__step') as HTMLElement[];
    const activate = (n: number) => steps.forEach((s, k) => {
      const on = k <= n;
      if (on && !s.classList.contains('is-on')) decode(s.querySelector<HTMLElement>('.ap-work__num')!, undefined, 600);
      s.classList.toggle('is-on', on);
      s.classList.toggle('is-current', k === n);
    });
    if (c.desktop && c.tall) {
      const vp = q('.ap-work__viewport')[0] as HTMLElement;
      const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth);
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el, start: 'top top', end: () => `+=${dist() + innerHeight * 0.6}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => { activate(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 1.02))); el.classList.toggle('is-bloom', self.progress > 0.96); },
        },
      })
        .to(track, { x: () => -dist(), duration: 1 }, 0)
        .fromTo(q('.ap-work__fill'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    } else {
      gsap.fromTo(q('.ap-work__fill'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 70%', end: 'bottom 60%', scrub: true } });
      steps.forEach((s, k) => {
        gsap.from(s, { y: 30, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: s, start: 'top 86%', toggleActions: 'play none none reverse' } });
        ScrollTrigger.create({ trigger: s, start: 'top 70%', onEnter: () => activate(k), onLeaveBack: () => activate(k - 1) });
      });
    }
    activate(-1);
    return () => { steps.forEach((s) => s.classList.add('is-on')); el.classList.remove('is-bloom'); };
  });
  return (
    <section ref={ref} className="section ap-work" id="working" aria-labelledby="work-title">
      <div className="ap-aurora ap-aurora--soft" aria-hidden="true"><i /><i /><i /></div>
      <div className="container ap-work__head">
        <div className="section-head">
          <p className="eyebrow" data-reveal="up">{WORKING.eyebrow}</p>
          <Split id="work-title" className="t-h2" text={WORKING.headline} />
        </div>
        <p className="ap-work__hint" aria-hidden="true">Scroll to follow the journey →</p>
      </div>
      <div className="ap-work__viewport">
        <ol className="ap-work__track container">
          <li className="ap-work__rail" aria-hidden="true"><span className="ap-work__fill" /></li>
          {WORKING.steps.map((s) => (
            <li key={s.number} className="ap-work__step is-on" style={css({ '--tone': s.tone })}>
              <span className="ap-work__node" aria-hidden="true" />
              <span className="ap-work__num" aria-hidden="true" data-text={s.number}>{s.number}</span>
              <div className="ap-work__card glass beam" data-spot="">
                <h3 className="t-h3"><span className="sr-only">Step {s.number}: </span>{s.title}</h3>
                <p>{s.description}</p>
                <p className="ap-work__get"><span className="t-label">You get</span>{s.youGet}</p>
              </div>
            </li>
          ))}
        </ol>
        <span className="ap-work__bloom" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · Technologies and certifications                                 */
/* ------------------------------------------------------------------ */
export function ApTech() {
  const ref = useRef<HTMLElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const loops: gsap.core.Animation[] = [];
    q('[data-count]').forEach((n) => {
      const end = Number((n as HTMLElement).dataset.count); const o = { v: 0 }; n.textContent = '0';
      ScrollTrigger.create({ trigger: n, start: 'top 88%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => { n.textContent = String(Math.round(o.v)); } }) });
    });
    gsap.from(q('.ap-tech__ring'), { scale: 0.3, autoAlpha: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: q('.ap-tech__map')[0], start: 'top 75%', toggleActions: 'play none none reverse' } });
    if (!c.mobile) {
      q('.ap-tech__rot').forEach((r, k) => loops.push(registerLoop(gsap.to(r, { rotate: k % 2 ? -360 : 360, duration: 60 + k * 18, ease: 'none', repeat: -1 }))));
      q('.ap-tech__rot .ap-chip').forEach((ch) => { const parent = ch.closest('.ap-tech__rot')!; const k = [...q('.ap-tech__rot')].indexOf(parent); loops.push(registerLoop(gsap.to(ch, { rotate: k % 2 ? 360 : -360, duration: 60 + k * 18, ease: 'none', repeat: -1 }))); });
    }
    q('.ap-mq__track').forEach((t, k) => loops.push(registerLoop(gsap.fromTo(t, { xPercent: k ? -50 : 0 }, { xPercent: k ? 0 : -50, duration: 40, ease: 'none', repeat: -1 }))));
    return () => { loops.forEach(unregisterLoop); q('[data-count]').forEach((n) => { n.textContent = (n as HTMLElement).dataset.count ?? ''; }); };
  });
  const all = TECH.groups.flatMap((g) => g.items);
  return (
    <section ref={ref} className="section ap-tech" id="tech" aria-labelledby="tech-title">
      <div className="tech-grid" aria-hidden="true" />
      <div className="container">
        <div className="ap-tech__top">
          <div className="section-head">
            <p className="eyebrow" data-reveal="up">{TECH.eyebrow}</p>
            <Split id="tech-title" className="t-h2" text={TECH.headline} />
          </div>
          <ul className="ap-tech__stats">
            {TECH.highlights.map((h) => (
              <li key={h.label} className="glass beam" style={css({ '--tone': '#6366F1' })}>
                <b><span data-count={h.value}>{h.value}</span>{h.suffix}</b>
                <span>{h.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ap-tech__map" aria-hidden="true">
          <div className="ap-tech__center"><span>iyan<b>Labs</b></span></div>
          {TECH.groups.map((g, k) => (
            <div key={g.group} className={`ap-tech__ring${focus && focus !== g.group ? ' is-dim' : ''}`} style={css({ '--r': `${30 + k * 14}%`, '--tone': g.tone })}>
              <div className="ap-tech__rot">
                {g.items.map((it, j) => (
                  <span key={it} className="ap-chip-wrap" style={css({ '--a': `${(360 / g.items.length) * j + k * 23}deg` })}>
                    <span className="ap-chip">{it}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ul className="ap-tech__groups">
          {TECH.groups.map((g) => (
            <li key={g.group} className="glass" style={css({ '--tone': g.tone })} onMouseEnter={() => setFocus(g.group)} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus(g.group)} onBlur={() => setFocus(null)} tabIndex={0}>
              <h3 className="t-label">{g.group}</h3>
              <p>{g.items.map((it) => <span key={it}>{it}</span>)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="ap-mq" aria-hidden="true">
        {[0, 1].map((r) => (
          <div key={r} className={`ap-mq__row ap-mq__row--${r}`}><div className="ap-mq__track">
            {[...all, ...all].map((it, k) => <span key={k}>{it}<i>✦</i></span>)}
          </div></div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7 · Industries (light "clarity" section)                            */
/* ------------------------------------------------------------------ */
export function ApIndustries() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (_c, el) => {
    const q = gsap.utils.selector(el);
    gsap.timeline({ scrollTrigger: { trigger: q('.ap-ind__grid')[0], start: 'top 80%', toggleActions: 'play none none reverse' } })
      .from(q('.ap-ind__tile'), { rotateX: -80, y: 30, autoAlpha: 0, transformOrigin: '50% 0%', transformPerspective: 800, duration: 0.9, stagger: { each: 0.06, grid: 'auto', from: 'start' } })
      .fromTo(q('.ap-ind__sweep'), { xPercent: -100 }, { xPercent: 200, duration: 1.4, ease: 'power2.inOut' }, 0.4)
      .fromTo(q('.ap-ind__tile path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.04, ease: 'power3.inOut' }, 0.5);
  });
  return (
    <section ref={ref} className="section ap-ind" id="industries" aria-labelledby="ind-title">
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow" data-reveal="up">{INDUSTRIES.eyebrow}</p>
          <Split id="ind-title" className="t-h2" text={INDUSTRIES.headline} />
          <p className="t-lead" data-reveal="up">We learn the operations behind each industry, so the solutions we build fit how your business actually runs.</p>
        </div>
        <div className="ap-ind__wrap">
          <span className="ap-ind__sweep" aria-hidden="true" />
          <ul className="ap-ind__grid">
            {INDUSTRIES.items.map((it) => (
              <li key={it.name} className="ap-ind__tile">
                <span className="ap-ind__icon"><Icon d={it.icon} size={26} /></span>
                <span className="ap-ind__name">{it.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 8 · What we've shipped (sticky stacked cards)                       */
/* ------------------------------------------------------------------ */
function ShipVisual({ kind }: { kind: string }) {
  if (kind === 'phones') return (
    <div className="sv sv-phones">{['Visits', 'Orders', 'Branches'].map((t, k) => <div key={t} className={`sv-phone sv-phone--${k}`}><span className="sv-notch" /><b>{t}</b><i /><i /><i className="hot" /></div>)}</div>
  );
  if (kind === 'varavu') return (
    <div className="sv sv-varavu">
      <div className="sv-desk"><div className="sv-bar"><i /><i /><i /></div><svg viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 50 C 30 40, 50 48, 80 32 S 140 14, 200 8" pathLength={1} /></svg><div className="sv-rows"><i /><i /><i /></div></div>
      <div className="sv-mini sv-tab"><b>Invoice</b><i /><i /><span>Send</span></div>
      <div className="sv-mini sv-ph"><b>Paid</b><span className="ok">✓</span></div>
    </div>
  );
  if (kind === 'network') return (
    <div className="sv sv-net">
      {['CRM', 'ERP', 'Pay', 'Cloud', 'Apps'].map((n, k) => <span key={n} className={`sv-node sv-node--${k}`}>{n}</span>)}
      <span className="sv-hub">API</span>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">{[[15, 20], [15, 80], [85, 20], [85, 80], [50, 8]].map(([x, y], k) => <g key={k}><path d={`M50 50 L${x} ${y}`} /><path className="sv-pk" d={`M50 50 L${x} ${y}`} pathLength={100} style={css({ animationDelay: `${k * 0.4}s` })} /></g>)}</svg>
    </div>
  );
  return (
    <div className="sv sv-crm">
      <div className="sv-stages"><span>Lead</span><span>Opportunity</span><span>Customer</span></div>
      <div className="sv-fill"><i /></div>
      {['Retail account', 'Service case', 'Renewal'].map((t) => <div key={t} className="sv-rec"><b />{t}</div>)}
    </div>
  );
}

export function ApShipped() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const n = q('[data-count]')[0] as HTMLElement;
    const o = { v: 0 }; n.textContent = '0';
    ScrollTrigger.create({ trigger: n, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: 40, duration: 1.8, ease: 'power2.out', onUpdate: () => { n.textContent = String(Math.round(o.v)); } }) });
    const cards = q('.ap-ship__card') as HTMLElement[];
    if (c.desktop && c.tall) {
      cards.forEach((card, k) => {
        if (k === cards.length - 1) return;
        gsap.to(card.querySelector('.ap-ship__inner'), { scale: 0.92 - (cards.length - k) * 0.01, autoAlpha: 0.45, filter: 'blur(2px)', ease: 'none',
          scrollTrigger: { trigger: cards[k + 1], start: 'top bottom', end: 'top 20%', scrub: true } });
      });
    }
    cards.forEach((card) => gsap.from(card.querySelector('.sv'), { y: 40, autoAlpha: 0, scale: 0.9, duration: 1, scrollTrigger: { trigger: card, start: 'top 75%', toggleActions: 'play none none reverse' } }));
    return () => { n.textContent = '40'; };
  });
  return (
    <section ref={ref} className="section ap-ship" id="shipped" aria-labelledby="ship-title">
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="ap-ship__head">
          <div className="section-head">
            <p className="eyebrow" data-reveal="up">{SHIPPED.eyebrow}</p>
            <Split id="ship-title" className="t-h2" text={SHIPPED.headline} />
          </div>
          <p className="ap-ship__sum"><b><span data-count="40">40</span>+</b><span>{SHIPPED.summary.label}</span></p>
        </div>
        <ol className="ap-ship__list">
          {SHIPPED.items.map((s, k) => (
            <li key={s.title} className="ap-ship__card" style={css({ '--tone': TONE[s.tone], '--k': k })}>
              <div className="ap-ship__inner glass beam" data-tone={TONE[s.tone]}>
                <div className="ap-ship__copy">
                  <span className="t-label ap-ship__idx">0{k + 1} / 0{SHIPPED.items.length}</span>
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="ap-ship__stat"><b>{s.stat}</b><span>{s.statLabel}</span></p>
                  <p className="ap-ship__detail">{s.detail}</p>
                  {s.cta && <ButtonLink href={s.cta.url} target="_blank" icon="external" variant="ghost">{s.cta.label}</ButtonLink>}
                </div>
                <div className="ap-ship__visual" aria-hidden="true"><ShipVisual kind={s.visual} /></div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 9 · FAQ                                                             */
/* ------------------------------------------------------------------ */
export function ApFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  useEffect(() => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.ap = 'faq';
    s.text = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    document.head.appendChild(s);
    return () => s.remove();
  }, []);
  return (
    <section className="section ap-faq" id="faq" aria-labelledby="faq-title">
      <div className="container ap-faq__inner">
        <div className="ap-faq__side">
          <div className="section-head">
            <p className="eyebrow" data-reveal="up">{FAQ.eyebrow}</p>
            <Split id="faq-title" className="t-h2" text={FAQ.headline} />
          </div>
          <div className="ap-faq__nudge glass" data-reveal="up">
            <p className="t-h4">Still have a question?</p>
            <p>We reply to every enquiry within 24 hours.</p>
            <ButtonLink href="/#contact" icon="arrow">Ask Us Directly</ButtonLink>
          </div>
        </div>
        <ul className="ap-faq__list" data-stagger="">
          {FAQ.items.map((f, k) => {
            const isOpen = open === k;
            return (
              <li key={f.q} className={`ap-faq__item${isOpen ? ' is-open' : ''}`}>
                <h3>
                  <button type="button" id={`${uid}-b${k}`} aria-expanded={isOpen} aria-controls={`${uid}-p${k}`} onClick={() => setOpen(isOpen ? null : k)}>
                    <span>{f.q}</span><i aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${uid}-p${k}`} role="region" aria-labelledby={`${uid}-b${k}`} className="ap-faq__panel" hidden={!isOpen}>
                  <p>{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 10 · Call to action                                                 */
/* ------------------------------------------------------------------ */
export function ApCta() {
  const [msg, setMsg] = useState('');
  const { navigate } = useRouter();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = msg.trim();
    navigate('/#contact');
    // The contact form mounts with the home page; send the message once it is listening.
    if (text) [300, 900].forEach((t) => window.setTimeout(() => prefillContact({ message: text }), t));
  };
  return (
    <section className="section ap-cta grain" id="start" aria-labelledby="cta-title">
      <div className="ap-cta__floor" aria-hidden="true" />
      <div className="ap-cta__horizon" aria-hidden="true" />
      <ParticleField density={0.4} />
      <div className="container ap-cta__inner">
        <Split id="cta-title" className="t-display ap-cta__title" text={CTA.headline} />
        <p className="t-lead" data-reveal="up">{CTA.body}</p>
        <form className="ap-cta__prompt" onSubmit={submit} data-reveal="up">
          <label htmlFor="ap-cta-input" className="sr-only">Tell us what you’re trying to solve</label>
          <span className="ap-cta__spark" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z" fill="currentColor" /></svg></span>
          <input id="ap-cta-input" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Tell us what you’re trying to solve…" autoComplete="off" />
          <button type="submit" className="btn btn--primary" data-magnetic="" data-cursor="Send"><span className="btn__label">Start a Conversation</span></button>
        </form>
        <ul className="ap-cta__contacts" data-stagger="">
          <li><span className="t-label">Email</span><a href={`mailto:${CTA.email}`}>{CTA.email}</a></li>
          <li><span className="t-label">Call</span><a href={CTA.phoneHref}>{CTA.phone}</a><small>{CTA.hours}</small></li>
        </ul>
      </div>
    </section>
  );
}
