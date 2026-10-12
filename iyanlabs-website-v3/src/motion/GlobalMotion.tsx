import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { decode } from '../lib/decode';
import { gsap, ScrollTrigger, QUERIES, type Conditions } from './gsap';

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/**
 * Site-wide motion. Rendered last in <App/> so it runs after sections have created their
 * own pinned ScrollTriggers (keeps trigger order correct).
 *  - Lenis smooth scrolling (fine pointers) synced with ScrollTrigger
 *  - declarative reveals: [data-split] [data-reveal="up|clip|wipe"] [data-stagger] [data-draw] [data-decode]
 *  - anchor navigation that works with and without Lenis, updates the hash and moves focus
 */
export function GlobalMotion() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add(QUERIES, (ctx) => {
      const c = (ctx.conditions ?? {}) as Conditions;
      if (c.reduce) { root.classList.remove('has-motion'); return; }
      root.classList.add('has-motion');

      let raf: ((t: number) => void) | null = null;
      if (c.fine) {
        lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        root.classList.add('has-lenis');
        lenis.on('scroll', ScrollTrigger.update);
        raf = (t: number) => lenis?.raf(t * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
      }

      const lift = c.mobile ? 24 : 48;
      const rev = { toggleActions: 'play none none reverse' };

      gsap.utils.toArray<HTMLElement>('[data-split]:not([data-manual])').forEach((el) => {
        gsap.from(el.querySelectorAll('.w__i'), {
          yPercent: 115, rotate: c.mobile ? 0 : 5, filter: 'blur(6px)', duration: 1.1, stagger: 0.045,
          scrollTrigger: { trigger: el, start: 'top 88%', ...rev },
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((el) => {
        gsap.from(el, { y: lift, autoAlpha: 0, duration: 1, delay: Number(el.dataset.delay ?? 0), scrollTrigger: { trigger: el, start: 'top 90%', ...rev } });
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(14% 10% 14% 10% round 28px)', autoAlpha: 0.15 },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', autoAlpha: 1, duration: 1.4, scrollTrigger: { trigger: el, start: 'top 85%', ...rev } });
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal="wipe"]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(75% at 50% 50%)', duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 80%', ...rev } });
      });
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((el) => {
        gsap.from(el.children, { y: lift * 0.6, autoAlpha: 0, duration: 0.9, stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 88%', ...rev } });
      });
      gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((p) => {
        gsap.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: p.closest('svg') ?? p, start: 'top 85%', ...rev } });
      });
      const stops: Array<() => void> = [];
      gsap.utils.toArray<HTMLElement>('[data-decode]').forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: 'top 92%', onEnter: () => stops.push(decode(el)), onEnterBack: () => stops.push(decode(el)) });
      });

      ScrollTrigger.refresh();
      return () => {
        stops.forEach((s) => s());
        if (raf) gsap.ticker.remove(raf);
        lenis?.destroy(); lenis = null;
        root.classList.remove('has-lenis', 'has-motion');
      };
    });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      const offset = id === 'top' ? 0 : -(parseInt(getComputedStyle(root).getPropertyValue('--header-h'), 10) || 80);
      if (lenis) lenis.scrollTo(id === 'top' ? 0 : target, { offset, duration: 1.4 });
      else window.scrollTo({ top: id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
      if (id !== 'top') {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener('click', onClick);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', onLoad);
      mm.revert();
    };
  }, []);

  return null;
}
