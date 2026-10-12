import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { CONTACT, LINKS } from '../../content/site';
import { gsap } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { CONTACT_ENDPOINT } from '../../lib/config';
import { onContactIntent } from '../../lib/contactIntent';
import { ButtonLink } from '../ui/Button';
import { Split } from '../ui/Split';
import './Contact.css';

type Field = 'name' | 'email' | 'company' | 'topic' | 'message';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'submitting' | 'sent' | 'mailto' | 'error';

const EMPTY: Values = { name: '', email: '', company: '', topic: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER: Field[] = ['message', 'name', 'email', 'topic'];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.message.trim().length < 10) e.message = 'Please tell us a little about your project (at least 10 characters).';
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your work email.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address, e.g. name@company.com.';
  if (!v.topic) e.topic = 'Please choose what we can help you with.';
  return e;
}

function buildMailto(v: Values) {
  const subject = `Project enquiry: ${v.topic}${v.company ? ` — ${v.company}` : ''}`;
  const body = [`Name: ${v.name}`, `Email: ${v.email}`, v.company ? `Company: ${v.company}` : null, `Topic: ${v.topic}`, '', v.message].filter((l) => l !== null).join('\n');
  return `mailto:${LINKS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [expanded, setExpanded] = useState(false);
  const [mailto, setMailto] = useState('');
  const [trap, setTrap] = useState('');
  const uid = useId();
  const id = (f: Field) => `${uid}-${f}`;

  useMotion(ref, (_c, el) => {
    const q = gsap.utils.selector(el);
    gsap.from(q('.cform'), { y: 60, autoAlpha: 0, scale: 0.97, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none reverse' } });
  });

  useEffect(() => onContactIntent(({ topic, message }) => {
    setValues((v) => ({
      ...v,
      topic: topic ? (CONTACT.topics.includes(topic) ? topic : 'Other') : v.topic,
      message: message && !v.message ? message : v.message,
    }));
    if (topic) { setExpanded(true); setErrors((e) => ({ ...e, topic: undefined })); }
  }), []);

  /* Animate the expansion of the remaining fields. */
  useEffect(() => {
    const m = moreRef.current;
    if (!m || !expanded || reduced()) return;
    gsap.fromTo(m.querySelectorAll('.field, .cform__foot'), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: 'expo.out' });
  }, [expanded]);

  const onChange = (f: Field) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = ev.target.value;
    setValues((v) => ({ ...v, [f]: value }));
    if (errors[f]) setErrors((e) => ({ ...e, [f]: validate({ ...values, [f]: value })[f] }));
    if (status !== 'idle' && status !== 'submitting') setStatus('idle');
  };
  const onBlur = (f: Field) => () => {
    if (f === 'company' || !values[f]) return;
    setErrors((e) => ({ ...e, [f]: validate(values)[f] }));
  };

  const shake = (fields: Field[]) => {
    if (reduced()) return;
    fields.forEach((f) => formRef.current?.querySelector(`[data-field="${f}"]`)?.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }], { duration: 280, easing: 'ease-out' }));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === 'submitting' || trap) return;
    setExpanded(true);
    const errs = validate(values);
    setErrors(errs);
    const bad = ORDER.filter((f) => errs[f]);
    if (bad.length) {
      shake(bad);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(bad[0]))}`)?.focus());
      return;
    }
    const link = buildMailto(values);
    setMailto(link);
    if (!CONTACT_ENDPOINT) { setStatus('mailto'); window.location.href = link; return; }
    setStatus('submitting');
    try {
      const res = await fetch(CONTACT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...values, source: 'iyanlabs.com' }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
      setValues(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  const describedBy = (f: Field, hint?: boolean) => [hint ? `${id(f)}-hint` : '', errors[f] ? `${id(f)}-err` : ''].filter(Boolean).join(' ') || undefined;
  const fieldCls = (f: Field, extra = '') => ['field', extra, errors[f] && 'has-error'].filter(Boolean).join(' ');
  const err = (f: Field) => errors[f] && <p className="field__err" id={`${id(f)}-err`}>{errors[f]}</p>;

  return (
    <section ref={ref} className="section contact grain" id="contact" aria-labelledby="contact-title">
      <div className="aurora" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="spotlight" aria-hidden="true" />
      <div className="container contact__inner">
        <div className="contact__intro">
          <p className="eyebrow" data-reveal="up">{CONTACT.eyebrow}</p>
          <Split id="contact-title" className="t-h2" text={CONTACT.headline} />
          <p className="t-lead" data-reveal="up">{CONTACT.body}</p>
          <ul className="contact__direct" data-stagger="">
            <li><span className="t-label">Email</span><a href={`mailto:${LINKS.email}`} data-cursor="Email">{LINKS.email}</a></li>
            <li><span className="t-label">LinkedIn</span><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="Open">iyanLabs on LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></li>
          </ul>
          <div data-reveal="up"><ButtonLink href="#services" variant="ghost" icon="none">Explore Our Services</ButtonLink></div>
        </div>

        <form ref={formRef} className={`cform${expanded ? ' is-expanded' : ''}`} noValidate onSubmit={onSubmit} aria-labelledby="contact-title" aria-busy={status === 'submitting'}>
          <div className={fieldCls('message', 'field--prompt')} data-field="message">
            <label htmlFor={id('message')} className="field__label">Tell us about your project <span aria-hidden="true">*</span></label>
            <div className="prompt-input">
              <span className="prompt-input__spark" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z" fill="currentColor" /></svg></span>
              <textarea id={id('message')} name="message" rows={expanded ? 4 : 2} placeholder="Tell us what you're trying to solve…" required aria-required="true"
                aria-invalid={!!errors.message} aria-describedby={describedBy('message', true)} value={values.message}
                onChange={onChange('message')} onBlur={onBlur('message')} onFocus={() => setExpanded(true)} />
              {!expanded && (
                <button type="button" className="prompt-input__go" aria-label="Continue to your details" onClick={() => { setExpanded(true); requestAnimationFrame(() => document.getElementById(id('name'))?.focus()); }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              )}
            </div>
            <p className="field__hint" id={`${id('message')}-hint`}>Goals, systems involved, timelines: whatever helps us understand the challenge.</p>
            {err('message')}
          </div>

          <div ref={moreRef} className="cform__more" inert={!expanded} aria-hidden={!expanded}>
            <div className="cform__more-inner">
              <div className="cform__grid">
                <div className={fieldCls('name')} data-field="name">
                  <label htmlFor={id('name')} className="field__label">Your name <span aria-hidden="true">*</span></label>
                  <input id={id('name')} name="name" type="text" autoComplete="name" required aria-required="true" aria-invalid={!!errors.name} aria-describedby={describedBy('name')} value={values.name} onChange={onChange('name')} onBlur={onBlur('name')} />
                  {err('name')}
                </div>
                <div className={fieldCls('email')} data-field="email">
                  <label htmlFor={id('email')} className="field__label">Work email <span aria-hidden="true">*</span></label>
                  <input id={id('email')} name="email" type="email" inputMode="email" autoComplete="email" required aria-required="true" aria-invalid={!!errors.email} aria-describedby={describedBy('email')} value={values.email} onChange={onChange('email')} onBlur={onBlur('email')} />
                  {err('email')}
                </div>
                <div className={fieldCls('company')} data-field="company">
                  <label htmlFor={id('company')} className="field__label">Company <span className="field__opt">(optional)</span></label>
                  <input id={id('company')} name="company" type="text" autoComplete="organization" value={values.company} onChange={onChange('company')} />
                </div>
                <div className={fieldCls('topic', 'field--select')} data-field="topic">
                  <label htmlFor={id('topic')} className="field__label">What can we help you with? <span aria-hidden="true">*</span></label>
                  <select id={id('topic')} name="topic" required aria-required="true" aria-invalid={!!errors.topic} aria-describedby={describedBy('topic')} value={values.topic} onChange={onChange('topic')} onBlur={onBlur('topic')}>
                    <option value="" disabled>Select a service</option>
                    {CONTACT.topics.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {err('topic')}
                </div>
                <div className="cform__trap" aria-hidden="true">
                  <label htmlFor={`${uid}-web`}>Leave this field empty</label>
                  <input id={`${uid}-web`} tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                </div>
              </div>
              <div className="cform__foot">
                <button type="submit" className={`btn btn--primary btn--lg cform__submit${status === 'submitting' ? ' is-loading' : ''}`} disabled={status === 'submitting'} data-magnetic="" data-cursor="Send">
                  <span className="btn__label">{status === 'submitting' ? 'Thinking…' : status === 'sent' ? 'Message sent' : 'Start a Conversation'}</span>
                  <span className="btn__icon" aria-hidden="true">
                    {status === 'sent'
                      ? <svg width="18" height="18" viewBox="0 0 16 16"><path className="cform__check" d="M3 8.5 6.5 12 13 4.5" pathLength={1} /></svg>
                      : <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                </button>
                <p className="cform__privacy"><span aria-hidden="true">*</span> Required. The details you share are used to respond to your enquiry.</p>
              </div>
            </div>
          </div>

          <div className="cform__status" role="status" aria-live="polite">
            {status === 'sent' && <p className="msg msg--ok"><strong>Thank you, your message has been sent.</strong> We'll be in touch soon.</p>}
            {status === 'mailto' && <p className="msg msg--info"><strong>Your email app should now open with your message ready to send.</strong> Please press send to reach us. If nothing opened, <a href={mailto}>try again</a> or email <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>.</p>}
            {status === 'error' && <p className="msg msg--err" role="alert"><strong>Sorry, we couldn't send your message.</strong> Please try again, or <a href={mailto}>send it by email</a> instead.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
