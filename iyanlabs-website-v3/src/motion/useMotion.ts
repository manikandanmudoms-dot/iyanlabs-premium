import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap, QUERIES, type Conditions } from './gsap';

type Setup = (c: Conditions, scope: HTMLElement) => void | (() => void);

/**
 * Runs a GSAP setup inside gsap.matchMedia(), scoped to `scope`. Everything created is
 * reverted on unmount or breakpoint change. Skipped entirely for reduced motion, so
 * content stays in its natural, final, visible state.
 */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: Setup, deps: DependencyList = []) {
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    mm.add(QUERIES, (ctx) => {
      const c = (ctx.conditions ?? {}) as Conditions;
      if (c.reduce) return;
      return setup(c, el);
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
