/** Coordinates the first-visit boot sequence with the hero entrance. */
const KEY = 'iyanlabs:boot-seen';
let active = false;
const listeners = new Set<() => void>();

export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false;
  try { if (sessionStorage.getItem(KEY)) return false; } catch { return false; }
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function beginIntro() {
  active = true;
  try { sessionStorage.setItem(KEY, '1'); } catch { /* storage unavailable */ }
}
export function endIntro() {
  if (!active) return;
  active = false;
  listeners.forEach((fn) => fn());
  listeners.clear();
}
/** Calls `fn` once the boot sequence has finished (immediately when none is playing). */
export function whenIntroDone(fn: () => void): () => void {
  if (!active) { fn(); return () => {}; }
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
