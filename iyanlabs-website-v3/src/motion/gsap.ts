/** Single entry point for GSAP so plugins are registered once. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'expo.out', duration: 0.8 });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

/** Motion tokens (mirrors CSS custom properties in tokens.css). */
export const EASE = { out: 'expo.out', inOut: 'power3.inOut', spring: 'elastic.out(1, 0.6)' } as const;
export const DUR = { micro: 0.16, short: 0.4, medium: 0.8, long: 1.4 } as const;

export const QUERIES = {
  desktop: '(min-width: 1025px)',
  tablet: '(min-width: 640px) and (max-width: 1024px)',
  mobile: '(max-width: 639px)',
  tall: '(min-height: 700px)',
  fine: '(hover: hover) and (pointer: fine)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;
export type Conditions = Record<keyof typeof QUERIES, boolean>;

/* Loop registry: the "Pause motion" control pauses every registered loop. */
const loops = new Set<gsap.core.Animation>();
const listeners = new Set<(paused: boolean) => void>();
let paused = false;

export function registerLoop<T extends gsap.core.Animation>(anim: T): T {
  loops.add(anim);
  if (paused) anim.pause();
  return anim;
}
export function unregisterLoop(anim: gsap.core.Animation) { loops.delete(anim); }
export function setMotionPaused(value: boolean) {
  paused = value;
  loops.forEach((a) => (value ? a.pause() : a.play()));
  listeners.forEach((fn) => fn(value));
}
export function isMotionPaused() { return paused; }
/** Subscribe non-GSAP loops (WebGL, canvas) to the pause control. */
export function onMotionPause(fn: (paused: boolean) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
