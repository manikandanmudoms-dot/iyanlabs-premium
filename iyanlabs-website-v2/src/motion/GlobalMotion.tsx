import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, QUERIES, type Conditions } from './gsap';

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/**
 * Site-wide motion. Rendered last in <App/> so its layout effect runs after every
 * section has created its own (pinned) ScrollTriggers — keeping trigger order correct.
 *
 *  - Lenis smooth scrolling synced with ScrollTrigger (desktop/fine pointer only)
 *  - smooth anchor navigation that still updates the URL hash and focus
 *  - stage background morph between charcoal and ivory
 *  - split-text, slide-up, clip-path and stagger reveals declared with data attributes
 */
export function GlobalMotion() {
  useLayoutEffect(() => {
    const root = document.documentElement;

    const mm = gsap.matchMedia();
    mm.add(QUERIES, (ctx) => {
      const c = (ctx.conditions ?? {}) as Conditions;
      if (c.reduce) {
        root.classList.remove('has-motion');
        return;
      }
      root.classList.add('has-motion');

      /* ---------- Smooth scrolling ---------- */
      let raf: ((t: number) => void) | null = null;
      if (c.fine) {
        lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
        root.classList.add('has-lenis');
        lenis.on('scroll', ScrollTrigger.update);
        raf = (t: number) => lenis?.raf(t * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
      }

      /* ---------- Stage colour morph ----------
         Where a light stage follows a dark one (or vice versa), its background is scrubbed
         from the previous stage's colour as it enters. Reversible; final colours are the
         CSS defaults, so nothing breaks if this never runs. */
      const stages = gsap.utils.toArray<HTMLElement>('[data-stage]');
      stages.forEach((el, i) => {
        const prev = stages[i - 1];
        if (!prev || prev.dataset.stage === el.dataset.stage) return;
        const from = getComputedStyle(prev).backgroundColor;
        const to = getComputedStyle(el).backgroundColor;
        gsap.fromTo(el, { backgroundColor: from }, {
          backgroundColor: to, ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: true },
        });
      });

      /* ---------- Declarative reveals ---------- */
      const lift = c.mobile ? 24 : 48;
      const once = { toggleActions: 'play none none reverse' };

      gsap.utils.toArray<HTMLElement>('[data-split]:not([data-manual])').forEach((el) => {
        gsap.from(el.querySelectorAll('.w__i'), {
          yPercent: 115, rotate: c.mobile ? 0 : 4, duration: 1.1, stagger: 0.045, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', ...once },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((el) => {
        gsap.from(el, {
          y: lift, autoAlpha: 0, duration: 1, ease: 'expo.out', delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 90%', ...once },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
        gsap.fromTo(el,
          { clipPath: 'inset(12% 8% 12% 8% round 24px)', autoAlpha: 0.2 },
          { clipPath: 'inset(0% 0% 0% 0% round 24px)', autoAlpha: 1, duration: 1.4, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', ...once } });
      });

      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((el) => {
        gsap.from(el.children, {
          y: lift * 0.6, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', ...once },
        });
      });

      gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((path) => {
        gsap.fromTo(path, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: { trigger: path.closest('[data-draw-scope]') ?? path, start: 'top 85%', ...once },
        });
      });

      ScrollTrigger.refresh();

      return () => {
        if (raf) gsap.ticker.remove(raf);
        lenis?.destroy();
        lenis = null;
        root.classList.remove('has-lenis', 'has-motion');
      };
    });

    /* ---------- Anchor navigation (works with and without Lenis) ---------- */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.preventDefault();
      const offset = id === 'top' || !id ? 0 : -parseInt(getComputedStyle(root).getPropertyValue('--header-h') || '76', 10) + 1;
      if (lenis) lenis.scrollTo(id === 'top' ? 0 : target, { offset, duration: 1.4 });
      else window.scrollTo({ top: id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
      if (id !== 'top') {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener('click', onClick);

    /* Fonts change line lengths → recompute trigger positions. */
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
