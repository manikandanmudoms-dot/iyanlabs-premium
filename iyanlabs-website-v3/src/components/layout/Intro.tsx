import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../motion/gsap';
import { beginIntro, endIntro, shouldPlayIntro } from '../../motion/intro';
import './Intro.css';

const LINE = 'initialising iyanLabs intelligence…';

/**
 * Boot sequence (first visit per session, ≤1.8s, skippable, never for reduced motion).
 * The page renders underneath immediately, so it never delays first content paint.
 */
export function Intro() {
  const [show, setShow] = useState(() => {
    const play = shouldPlayIntro();
    if (play) beginIntro();
    return play;
  });
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const finish = () => { endIntro(); setShow(false); };

  useLayoutEffect(() => {
    if (!show || !root.current) return;
    const el = root.current;
    const typed = el.querySelector<HTMLElement>('.boot__typed')!;
    const ctx = gsap.context(() => {
      const state = { n: 0 };
      tl.current = gsap.timeline({ onComplete: finish })
        .to(state, { n: LINE.length, duration: 0.8, ease: 'none', onUpdate: () => { typed.textContent = LINE.slice(0, Math.round(state.n)); } })
        .fromTo('.boot__spark', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'back.out(3)' }, 0.55)
        .to('.boot__spark', { scale: 60, autoAlpha: 0, duration: 0.6, ease: 'expo.in' }, '>-0.02')
        .call(() => endIntro(), [], '<0.35')
        .to(el, { autoAlpha: 0, duration: 0.3 }, '<0.3');
    }, el);
    const failsafe = window.setTimeout(finish, 2600);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') skip(); };
    window.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(failsafe); window.removeEventListener('keydown', onKey); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const skip = () => { tl.current?.progress(1); finish(); };

  if (!show) return null;
  return (
    <div ref={root} className="boot" role="presentation" onClick={skip}>
      <div className="boot__inner" aria-hidden="true">
        <p className="boot__line"><span className="boot__prompt">&gt;</span> <span className="boot__typed" /><span className="boot__caret" /></p>
        <span className="boot__spark" />
      </div>
      <button type="button" className="boot__skip" onClick={(e) => { e.stopPropagation(); skip(); }}>Skip intro</button>
    </div>
  );
}
