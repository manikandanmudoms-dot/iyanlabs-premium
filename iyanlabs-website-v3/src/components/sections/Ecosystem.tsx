import { useRef, useState } from 'react';
import { ECOSYSTEM, type NodeId } from '../../content/site';
import { gsap, registerLoop, unregisterLoop } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { Split } from '../ui/Split';
import './Ecosystem.css';

const POS: Record<NodeId, { x: number; y: number }> = {
  core: { x: 50, y: 50 },
  salesforce: { x: 17, y: 25 },
  mulesoft: { x: 50, y: 11 },
  web: { x: 83, y: 25 },
  mobile: { x: 83, y: 75 },
  chatbots: { x: 50, y: 89 },
  business: { x: 17, y: 75 },
};
const node = (id: NodeId) => ECOSYSTEM.nodes.find((n) => n.id === id)!;
const path = (a: NodeId, b: NodeId) => {
  const p = POS[a], q = POS[b];
  const mx = (p.x + q.x) / 2 + (q.y - p.y) * 0.12, my = (p.y + q.y) / 2 - (q.x - p.x) * 0.12;
  return `M${p.x} ${p.y} Q ${mx} ${my} ${q.x} ${q.y}`;
};

export function Ecosystem() {
  const ref = useRef<HTMLElement>(null);
  const [sel, setSel] = useState<NodeId>('core');
  const current = node(sel);
  const related = ECOSYSTEM.connections.filter((c) => c.from === sel || c.to === sel);
  const linked = new Set<NodeId>([sel, ...related.flatMap((r) => [r.from, r.to])]);

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const loops: gsap.core.Animation[] = [];
    if (c.desktop) {
      gsap.timeline({ scrollTrigger: { trigger: q('.eco__map')[0], start: 'top 72%', toggleActions: 'play none none reverse' } })
        .from(q('.eco__node--core .eco__btn'), { scale: 0.2, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.7)' })
        .from(q('.eco__node:not(.eco__node--core) .eco__btn'), { scale: 0.4, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.8)' }, 0.25)
        .fromTo(q('.eco__edge'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.06, ease: 'power3.inOut' }, 0.35)
        .from(q('.eco__detail'), { x: 40, autoAlpha: 0, duration: 1 }, 0.4);
      q('.eco__node:not(.eco__node--core) .eco__btn').forEach((n, i) => {
        loops.push(registerLoop(gsap.to(n, { x: Math.sin(i * 1.7) * 8, y: Math.cos(i * 1.3) * 8, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
      });
      loops.push(registerLoop(gsap.fromTo(q('.eco__flow'), { strokeDashoffset: 0 }, { strokeDashoffset: -40, duration: 1.6, ease: 'none', repeat: -1 })));
    } else {
      q('.eco__btn').forEach((b) => gsap.from(b, { y: 30, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: b, start: 'top 90%', toggleActions: 'play none none reverse' } }));
      gsap.fromTo(q('.eco__vline i'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: q('.eco__nodes')[0], start: 'top 75%', end: 'bottom 60%', scrub: true } });
    }
    return () => loops.forEach(unregisterLoop);
  });

  return (
    <section ref={ref} className="section eco" id="ecosystem" aria-labelledby="eco-title">
      <div className="spotlight" aria-hidden="true" />
      <div className="eco__stars" aria-hidden="true" />
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow" data-reveal="up">{ECOSYSTEM.eyebrow}</p>
          <Split id="eco-title" className="t-h2" text={ECOSYSTEM.headline} />
          <p className="t-lead" data-reveal="up">{ECOSYSTEM.body}</p>
        </div>

        <div className="eco__board">
          <div className="eco__map">
            <svg className="eco__edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              {ECOSYSTEM.connections.map((cn) => {
                const on = cn.from === sel || cn.to === sel;
                const d = path(cn.from, cn.to);
                const color = node(cn.from === 'core' ? cn.to : cn.from).color;
                return (
                  <g key={cn.from + cn.to} className={on ? 'is-on' : 'is-dim'} style={{ ['--c' as string]: color }}>
                    <path className="eco__edge" d={d} pathLength={1} />
                    <path className="eco__flow" d={d} />
                  </g>
                );
              })}
            </svg>
            <span className="eco__vline" aria-hidden="true"><i /></span>
            <ul className="eco__nodes" aria-label="Systems in the connected ecosystem">
              {ECOSYSTEM.nodes.map((n) => (
                <li key={n.id} className={`eco__node eco__node--${n.id}${linked.has(n.id) ? '' : ' is-dim'}`} style={{ left: `${POS[n.id].x}%`, top: `${POS[n.id].y}%`, ['--c' as string]: n.color }}>
                  <button type="button" className="eco__btn" aria-pressed={sel === n.id} aria-controls="eco-detail" data-tone={n.color} data-cursor="Explore"
                    onClick={() => setSel(n.id)} onMouseEnter={() => setSel(n.id)} onFocus={() => setSel(n.id)}>
                    <span className="eco__glyph" aria-hidden="true">{n.glyph}</span>
                    <span className="eco__text"><span className="eco__name">{n.name}</span><span className="eco__role">{n.role}</span></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <aside id="eco-detail" className="eco__detail glass beam" aria-live="polite" style={{ ['--tone' as string]: current.color }}>
            <p className="t-label eco__lbl">Selected system</p>
            <h3 key={current.id} className="t-h3 eco__title" style={{ color: current.color === '#94A3B8' ? '#CBD5E1' : current.color }}>{current.name}</h3>
            <p className="eco__desc">{current.role}</p>
            <p className="t-label eco__lbl">Connections</p>
            <ul className="eco__list">
              {related.map((cn) => (
                <li key={cn.from + cn.to}>
                  <span className="eco__pair">{node(cn.from).name} <span aria-hidden="true">⇄</span><span className="sr-only">connects with</span> {node(cn.to).name}</span>
                  <span>{cn.text}</span>
                </li>
              ))}
            </ul>
            <p className="eco__hint">Hover, tap or tab through the systems.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
