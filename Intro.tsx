import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../motion/gsap';
import { beginIntro, endIntro, shouldPlayIntro } from '../../motion/intro';
import './Intro.css';

/**
 * First-visit intro (once per session, ≤1.6s, skippable, never for reduced motion).
 * The page renders underneath immediately, so it does not delay first content paint.
 */
export function Intro() {
  const [show, setShow] = useState(() => {
    const play = shouldPlayIntro();
    if (play) beginIntro();
    return play;
  });
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!show || !root.current) return;
    const el = root.current;
    const finish = () => { endIntro(); setShow(false); };
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ onComplete: finish })
        .fromTo('.intro__stroke', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power3.inOut', stagger: 0.08 })
        .from('.intro__dot', { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)', stagger: 0.06 }, '-=0.25')
        .from('.intro__word', { yPercent: 110, duration: 0.45, ease: 'expo.out' }, '-=0.3')
        .to('.intro__inner', { autoAlpha: 0, scale: 0.96, duration: 0.25, ease: 'power2.in' }, '+=0.05')
        .to('.intro__half--top', { yPercent: -100, duration: 0.55, ease: 'expo.inOut' }, '-=0.05')
        .to('.intro__half--bottom', { yPercent: 100, duration: 0.55, ease: 'expo.inOut' }, '<');
      // Hero entrance starts as the curtains open.
      tl.current.call(() => endIntro(), [], '-=0.45');
    }, el);

    // Safety net: never let the overlay outlive its 1.6s budget (e.g. if animation fails).
    const failsafe = window.setTimeout(finish, 2400);
    const skip = () => { tl.current?.progress(1); finish(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') skip(); };
    window.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(failsafe); window.removeEventListener('keydown', onKey); ctx.revert(); };
  }, [show]);

  const skipIntro = () => { tl.current?.progress(1); endIntro(); setShow(false); };

  if (!show) return null;
  return (
    <div ref={root} className="intro" role="presentation" onClick={skipIntro}>
      <div className="intro__half intro__half--top" />
      <div className="intro__half intro__half--bottom" />
      <div className="intro__inner" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="88" height="88">
          <rect className="intro__stroke" x="2" y="2" width="60" height="60" rx="16" pathLength={1} />
          <path className="intro__stroke" d="M20.5 28v20" pathLength={1} />
          <path className="intro__stroke" d="M33 15v31a3 3 0 0 0 3 3h12" pathLength={1} />
          <circle className="intro__dot" cx="20.5" cy="18.5" r="4.5" />
          <circle className="intro__dot intro__dot--light" cx="48" cy="49" r="3.2" />
        </svg>
        <span className="intro__wordwrap"><span className="intro__word">iyan<b>Labs</b></span></span>
      </div>
      <button type="button" className="intro__skip" onClick={(e) => { e.stopPropagation(); skipIntro(); }}>Skip intro</button>
    </div>
  );
}
