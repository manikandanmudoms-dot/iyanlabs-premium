/**
 * Single entry point for GSAP. Every component imports gsap/ScrollTrigger from here
 * so plugins are registered exactly once.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'expo.out', duration: 0.8 });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

/** Motion tokens (mirrors CSS custom properties in tokens.css). */
export const EASE = { out: 'expo.out', inOut: 'power3.inOut' } as const;
export const DUR = { micro: 0.18, short: 0.4, medium: 0.8, long: 1.4 } as const;
export const STAGGER = 0.07;

/** Media conditions used with gsap.matchMedia(). */
export const QUERIES = {
  desktop: '(min-width: 1025px)',
  tablet: '(min-width: 640px) and (max-width: 1024px)',
  mobile: '(max-width: 639px)',
  tall: '(min-height: 700px)',
  fine: '(hover: hover) and (pointer: fine)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

export type Conditions = Record<keyof typeof QUERIES, boolean>;

/** Long-running loops register here so the "Pause motion" control can pause them. */
const loops = new Set<gsap.core.Animation>();
let paused = false;

export function registerLoop<T extends gsap.core.Animation>(anim: T): T {
  loops.add(anim);
  if (paused) anim.pause();
  return anim;
}
export function unregisterLoop(anim: gsap.core.Animation) {
  loops.delete(anim);
}
export function setLoopsPaused(value: boolean) {
  paused = value;
  loops.forEach((a) => (value ? a.pause() : a.play()));
}
export function loopsPaused() {
  return paused;
}
