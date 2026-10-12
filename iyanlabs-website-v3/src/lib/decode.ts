/** Decode/scramble text effect: characters resolve left-to-right into the final text. */
const GLYPHS = '01<>/\\{}[]#*+=_ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function decode(el: HTMLElement, finalText = el.dataset.text ?? el.textContent ?? '', duration = 900): () => void {
  el.dataset.text = finalText;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = finalText; return () => {}; }
  const start = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const fixed = Math.floor(p * finalText.length);
    let out = finalText.slice(0, fixed);
    for (let i = fixed; i < finalText.length; i++) {
      out += finalText[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(tick);
    else el.textContent = finalText;
  };
  raf = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(raf); el.textContent = finalText; };
}
