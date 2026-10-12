import { useEffect, useRef } from 'react';
import { isMotionPaused, onMotionPause } from '../../motion/gsap';

const COLORS = ['#8B5CF6', '#3B82F6', '#22D3EE', '#EC4899', '#34D399'];

interface Props { density?: number; className?: string; }

/**
 * Neural particle field: drifting nodes that connect with faint lines and link to the
 * pointer when it comes near. Canvas 2D; paused off-screen, on hidden tabs and when motion is paused.
 */
export function ParticleField({ density = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    let w = 0, h = 0;
    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let pts: P[] = [];
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      const b = canvas.getBoundingClientRect();
      w = b.width; h = b.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = (w * h) / 14000;
      const n = Math.round(Math.min(lowPower ? 60 : 130, base) * density * (w < 640 ? 0.55 : 1));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.5, c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    };
    seed();
    const ro = new ResizeObserver(seed);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => { const b = canvas.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let speed = 1, lastY = window.scrollY;
    const onScroll = () => { speed = Math.min(6, 1 + Math.abs(window.scrollY - lastY) / 30); lastY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const LINK = 120, LINK2 = LINK * LINK;
    let raf = 0, visible = true, paused = isMotionPaused();
    const frame = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      speed += (1 - speed) * 0.05;
      for (const p of pts) {
        p.x += p.vx * speed; p.y += p.vy * speed;
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
      }
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            ctx.strokeStyle = `rgba(139,160,255,${(1 - d2 / LINK2) * 0.18})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const mx = a.x - mouse.x, my = a.y - mouse.y, m2 = mx * mx + my * my;
        if (m2 < 180 * 180) {
          ctx.strokeStyle = `rgba(34,211,238,${(1 - m2 / (180 * 180)) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      for (const p of pts) {
        ctx.fillStyle = p.c; ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      schedule();
    };
    const schedule = () => { if (!raf && visible && !paused && !document.hidden) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; schedule(); });
    io.observe(canvas);
    const onVis = () => schedule();
    document.addEventListener('visibilitychange', onVis);
    const off = onMotionPause((p) => { paused = p; schedule(); });
    schedule();

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); off();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [density]);

  return <canvas ref={ref} className={`particles ${className ?? ''}`} aria-hidden="true" />;
}
