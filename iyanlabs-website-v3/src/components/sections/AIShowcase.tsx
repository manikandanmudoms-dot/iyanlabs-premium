import { useEffect, useRef, useState } from 'react';
import { AI_SHOWCASE } from '../../content/site';
import { gsap } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { Split } from '../ui/Split';
import './AIShowcase.css';

type Msg = { id: number; role: 'user' | 'bot'; text: string; done: boolean };
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scripted demo conversation. Answers are pre-written from iyanLabs service content and
 * streamed word by word. No AI service is called, and the UI says so.
 */
function ChatDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const nextId = useRef(1);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const l = logRef.current; if (l) l.scrollTop = l.scrollHeight; }, [msgs, typing]);

  const ask = (i: number) => {
    if (busy) return;
    const { q, a } = AI_SHOWCASE.qa[i];
    const uid = nextId.current++; const bid = nextId.current++;
    setBusy(true);
    setMsgs((m) => [...m, { id: uid, role: 'user', text: q, done: true }]);
    if (reduced()) {
      setMsgs((m) => [...m, { id: bid, role: 'bot', text: a, done: true }]);
      setBusy(false);
      return;
    }
    setTyping(true);
    const words = a.split(' ');
    timers.current.push(window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: bid, role: 'bot', text: '', done: false }]);
      words.forEach((_, w) => {
        timers.current.push(window.setTimeout(() => {
          const done = w === words.length - 1;
          setMsgs((m) => m.map((x) => (x.id === bid ? { ...x, text: words.slice(0, w + 1).join(' '), done } : x)));
          if (done) setBusy(false);
        }, w * 45));
      });
    }, 900));
  };

  const reset = () => { timers.current.forEach(clearTimeout); timers.current = []; setMsgs([]); setBusy(false); setTyping(false); };

  return (
    <div className="chat beam glass" style={{ ['--tone' as string]: '#34D399' }} data-tone="#34D399">
      <div className="chat__head">
        <span className="chat__avatar" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5h16v10H10l-4 3.5v-3.5H4zM8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" /></svg>
        </span>
        <div>
          <p className="chat__title">iyanLabs assistant</p>
          <p className="chat__label">{AI_SHOWCASE.demoLabel}</p>
        </div>
        {msgs.length > 0 && <button type="button" className="chat__reset" onClick={reset}>Reset</button>}
      </div>

      <div ref={logRef} className="chat__log" role="log" aria-live="polite" aria-relevant="additions text" aria-label="Demo conversation">
        {msgs.length === 0 && <p className="chat__empty">Pick a question below to see how a connected assistant could respond.</p>}
        {msgs.map((m) => (
          <div key={m.id} className={`chat__msg chat__msg--${m.role}`}>
            {m.role === 'bot' && !m.done ? <><span aria-hidden="true">{m.text}<i className="chat__caret" /></span><span className="sr-only">Assistant is responding…</span></> : m.text}
          </div>
        ))}
        {typing && <div className="chat__typing" aria-hidden="true"><i /><i /><i /></div>}
      </div>

      <div className="chat__ask">
        <p className="t-label chat__ask-label" id="chat-q">Try a question</p>
        <div className="chat__chips" role="group" aria-labelledby="chat-q">
          {AI_SHOWCASE.qa.map((x, i) => (
            <button key={x.q} type="button" className="chat__chip" onClick={() => ask(i)} disabled={busy} data-cursor="Ask">{x.q}</button>
          ))}
        </div>
        <p className="chat__note">Pre-written demo. No live AI service is connected.</p>
      </div>
    </div>
  );
}

function AgentVisualiser() {
  const { goal, steps } = AI_SHOWCASE.agent;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(steps.length); // final state by default (no-JS / reduced motion)

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let i = 0, timer = 0, visible = false;
    const tick = () => {
      if (!visible || document.documentElement.classList.contains('motion-paused')) { timer = window.setTimeout(tick, 400); return; }
      i = (i + 1) % (steps.length + 2);
      setActive(Math.min(i, steps.length));
      timer = window.setTimeout(tick, i >= steps.length ? 2200 : 1100);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    setActive(0);
    timer = window.setTimeout(tick, 600);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, [steps.length]);

  return (
    <div ref={ref} className="agent beam glass" style={{ ['--tone' as string]: '#EC4899' }} data-tone="#EC4899">
      <div className="agent__head">
        <p className="t-label agent__label">AI agent at work · illustrative</p>
        <p className="agent__goal"><span className="agent__goal-tag">Goal</span>{goal}</p>
      </div>
      <ol className="agent__steps">
        {steps.map((s, i) => {
          const state = i < active ? 'done' : i === active ? 'now' : 'todo';
          return (
            <li key={s.label} className={`agent__step is-${state}`}>
              <span className="agent__tool">{s.tool}</span>
              <span className="agent__text">{s.label}</span>
              <span className="agent__status" aria-hidden="true">{state === 'done' ? '✓' : state === 'now' ? <i className="agent__spin" /> : ''}</span>
              <span className="sr-only">{state === 'done' ? '(done)' : state === 'now' ? '(in progress)' : '(pending)'}</span>
            </li>
          );
        })}
      </ol>
      <p className={`agent__result${active >= steps.length ? ' is-on' : ''}`}><span aria-hidden="true">●</span> Customer updated · follow-up booked · team approved</p>
    </div>
  );
}

export function AIShowcase() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (c, el) => {
    const q = gsap.utils.selector(el);
    gsap.from([q('.chat'), q('.agent')], { y: 80, autoAlpha: 0, rotateY: c.mobile ? 0 : (i: number) => (i ? -10 : 10), transformPerspective: 1400, duration: 1.3, stagger: 0.15,
      scrollTrigger: { trigger: q('.ai__stage')[0], start: 'top 80%', toggleActions: 'play none none reverse' } });
  });

  return (
    <section ref={ref} className="section ai grain" id="ai" aria-labelledby="ai-title">
      <div className="aurora" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow" data-reveal="up">{AI_SHOWCASE.eyebrow}</p>
          <Split id="ai-title" className="t-h2" text={AI_SHOWCASE.headline} />
          <p className="t-lead" data-reveal="up">{AI_SHOWCASE.body}</p>
        </div>
        <div className="ai__stage">
          <ChatDemo />
          <AgentVisualiser />
        </div>
        <ul className="ai__highlights" data-stagger="">
          {AI_SHOWCASE.highlights.map((h, i) => (
            <li key={h.title} className="glass" data-spot="" style={{ ['--tone' as string]: ['#22D3EE', '#EC4899', '#34D399'][i] }}>
              <span className="ai__hl-dot" aria-hidden="true" />
              <h3 className="t-h4">{h.title}</h3>
              <p>{h.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
