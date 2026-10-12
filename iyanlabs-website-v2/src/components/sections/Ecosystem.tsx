import { useRef, useState } from 'react';
import { ECOSYSTEM, type NodeId } from '../../content/site';
import { gsap, registerLoop, unregisterLoop } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { Split } from '../ui/Split';
import './Ecosystem.css';

const POS: Record<NodeId, { x: number; y: number }> = {
  salesforce: { x: 16, y: 24 },
  business: { x: 16, y: 76 },
  mulesoft: { x: 50, y: 50 },
  mobile: { x: 84, y: 50 },
};
const nameOf = (id: NodeId) => ECOSYSTEM.nodes.find((n) => n.id === id)!.name;
const edgePath = (a: NodeId, b: NodeId) => {
  const p = POS[a]; const q = POS[b]; const mx = (p.x + q.x) / 2;
  return `M${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`;
};

export function Ecosystem() {
  const ref = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<NodeId>('mulesoft');
  const node = ECOSYSTEM.nodes.find((n) => n.id === selected)!;
  const related = ECOSYSTEM.connections.filter((c) => c.from === selected || c.to === selected);

  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    const loops: gsap.core.Animation[] = [];
    if (!c.mobile && !c.tablet) {
      gsap.timeline({ scrollTrigger: { trigger: q('.eco__diagram')[0], start: 'top 70%', toggleActions: 'play none none reverse' } })
        .from(q('.eco__node-wrap--mulesoft .eco__node'), { scale: 0.4, autoAlpha: 0, duration: 1, ease: 'back.out(1.6)' })
        .from(q('.eco__node-wrap:not(.eco__node-wrap--mulesoft) .eco__node'), { scale: 0.6, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'back.out(1.6)' }, 0.25)
        .fromTo(q('.eco__edge'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.15, ease: 'power3.inOut' }, 0.4)
        .from(q('.eco__tag'), { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.1 }, 1)
        .from(q('.eco__detail'), { x: 40, autoAlpha: 0, duration: 1 }, 0.5);
      // Gentle orbit around the hub.
      q('.eco__node-wrap:not(.eco__node-wrap--mulesoft) .eco__glyph').forEach((n, i) => {
        loops.push(registerLoop(gsap.to(n, { x: [6, -5, 7][i], y: [-7, 6, -5][i], duration: 3.4 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
      });
      loops.push(registerLoop(gsap.fromTo(q('.eco__flow'), { strokeDashoffset: 0 }, { strokeDashoffset: -32, duration: 1.4, ease: 'none', repeat: -1 })));
    } else {
      // Vertical flow: connectors draw as you scroll.
      q('.eco__node').forEach((w) => {
        gsap.from(w, { y: 30, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: w, start: 'top 88%', toggleActions: 'play none none reverse' } });
      });
      gsap.fromTo(q('.eco__vline i'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: q('.eco__nodes')[0], start: 'top 75%', end: 'bottom 60%', scrub: true } });
    }
    return () => loops.forEach(unregisterLoop);
  });

  return (
    <section ref={ref} className="section eco stage--dark" id="ecosystem" data-stage="dark" aria-labelledby="eco-title">
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow" data-reveal="up">{ECOSYSTEM.eyebrow}</p>
          <Split id="eco-title" className="t-h2" text={ECOSYSTEM.headline} />
          <p className="t-lead" data-reveal="up">{ECOSYSTEM.body}</p>
        </div>

        <div className={`eco__board is-${selected}`}>
          <div className="eco__diagram">
            <svg className="eco__edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              {ECOSYSTEM.connections.map((cn) => {
                const on = cn.from === selected || cn.to === selected;
                const d = edgePath(cn.from, cn.to);
                return (
                  <g key={cn.tag} className={on ? 'is-on' : 'is-dim'}>
                    <path className="eco__edge" d={d} pathLength={1} />
                    <path className="eco__flow" d={d} />
                  </g>
                );
              })}
            </svg>
            {ECOSYSTEM.connections.map((cn) => {
              const a = POS[cn.from]; const b = POS[cn.to];
              const on = cn.from === selected || cn.to === selected;
              return <span key={cn.tag} className={`eco__tag${on ? ' is-on' : ''}`} aria-hidden="true" style={{ left: `${(a.x + b.x) / 2}%`, top: `${(a.y + b.y) / 2}%` }}>{cn.tag}</span>;
            })}
            <span className="eco__vline" aria-hidden="true"><i /></span>
            <ul className="eco__nodes" aria-label="Systems in the connected ecosystem">
              {ECOSYSTEM.nodes.map((n) => {
                const linked = n.id === selected || related.some((r) => r.from === n.id || r.to === n.id);
                return (
                  <li key={n.id} className={`eco__node-wrap eco__node-wrap--${n.id}${linked ? '' : ' is-dim'}`} style={{ left: `${POS[n.id].x}%`, top: `${POS[n.id].y}%` }}>
                    <button type="button" className={`eco__node eco__node--${n.shade}`} aria-pressed={selected === n.id} aria-controls="eco-detail"
                      data-cursor="Explore" onClick={() => setSelected(n.id)} onMouseEnter={() => setSelected(n.id)} onFocus={() => setSelected(n.id)}>
                      <span className="eco__glyph" aria-hidden="true">{n.glyph}</span>
                      <span className="eco__node-text">
                        <span className="eco__node-name">{n.name}</span>
                        <span className="eco__node-role">{n.role}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside id="eco-detail" className="eco__detail" aria-live="polite">
            <p className="t-label eco__lbl">Selected system</p>
            <h3 key={node.id} className="t-h3 eco__title">{node.name}</h3>
            <p className="eco__role">{node.role}</p>
            <p className="t-label eco__lbl">Connections</p>
            <ul className="eco__list">
              {related.map((cn) => (
                <li key={cn.tag}>
                  <span className="eco__pair">{nameOf(cn.from)} <span aria-hidden="true">⇄</span><span className="sr-only">connects with</span> {nameOf(cn.to)}</span>
                  <span>{cn.text}</span>
                </li>
              ))}
            </ul>
            <p className="eco__hint">Hover, tap or tab through the systems.</p>
          </aside>
        </div>

        <ol className="eco__summary" data-stagger="" aria-label="How the systems connect">
          {ECOSYSTEM.connections.map((cn) => (
            <li key={cn.tag}><strong>{nameOf(cn.from)} → {nameOf(cn.to)}</strong><span>{cn.text}</span></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
