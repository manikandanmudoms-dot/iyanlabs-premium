import { useEffect, useRef } from 'react';
import { gsap } from '../../motion/gsap';
import './PageTransition.css';

/** Aurora curtain with the iyanLabs mark, played on every route change (≤600ms). Skipped for reduced motion. */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const play = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.killTweensOf(el);
      gsap.timeline()
        .set(el, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' })
        .fromTo(el.querySelector('.ptr__mark'), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'back.out(2)' })
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'expo.inOut' }, '+=0.05')
        .set(el, { autoAlpha: 0 });
    };
    window.addEventListener('iyanlabs:route', play);
    return () => window.removeEventListener('iyanlabs:route', play);
  }, []);
  return (
    <div ref={ref} className="ptr" aria-hidden="true">
      <span className="ptr__mark">iyan<b>Labs</b></span>
    </div>
  );
}
