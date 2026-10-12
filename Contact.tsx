import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { CONTACT, LINKS } from '../../content/site';
import { gsap, registerLoop, unregisterLoop } from '../../motion/gsap';
import { useMotion } from '../../motion/useMotion';
import { CONTACT_ENDPOINT } from '../../lib/config';
import { onContactTopic } from '../../lib/contactIntent';
import { ButtonLink } from '../ui/Button';
import { Split } from '../ui/Split';
import './Contact.css';

type Field = 'name' | 'email' | 'company' | 'topic' | 'message';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'submitting' | 'sent' | 'mailto' | 'error';

const EMPTY: Values = { name: '', email: '', company: '', topic: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your work email.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address, e.g. name@company.com.';
  if (!v.topic) e.topic = 'Please choose what we can help you with.';
  if (v.message.trim().length < 10) e.message = 'Please tell us a little about your project (at least 10 characters).';
  return e;
}

function buildMailto(v: Values) {
  const subject = `Project enquiry: ${v.topic}${v.company ? ` — ${v.company}` : ''}`;
  const body = [`Name: ${v.name}`, `Email: ${v.email}`, v.company ? `Company: ${v.company}` : null, `Topic: ${v.topic}`, '', v.message]
    .filter((l) => l !== null).join('\n');
  return `mailto:${LINKS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [mailto, setMailto] = useState('');
  const [trap, setTrap] = useState('');
  const uid = useId();
  const id = (f: Field) => `${uid}-${f}`;

  useMotion(ref, (_c, el) => {
    const q = gsap.utils.selector(el);
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none reverse' } })
      .fromTo(q('.contact__frame-path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power3.inOut' })
      .from(q('.cform'), { y: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.2)
      .from(q('.field'), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.5);
    const flow = registerLoop(gsap.fromTo(q('.contact__packet'), { strokeDashoffset: 0 }, { strokeDashoffset: -1, duration: 9, ease: 'none', repeat: -1, stagger: 4.5 }));
    return () => unregisterLoop(flow);
  });

  useEffect(() => onContactTopic((topic) => {
    setValues((v) => ({ ...v, topic: CONTACT.topics.includes(topic) ? topic : 'Other' }));
    setErrors((e) => ({ ...e, topic: undefined }));
  }), []);

  const onChange = (f: Field) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = ev.target.value;
    setValues((v) => ({ ...v, [f]: value }));
    if (errors[f]) setErrors((e) => ({ ...e, [f]: validate({ ...values, [f]: value })[f] }));
    if (status === 'error' || status === 'mailto' || status === 'sent') setStatus('idle');
  };
  const onBlur = (f: Field) => () => {
    if (f === 'company' || !values[f]) return;
    setErrors((e) => ({ ...e, [f]: validate(values)[f] }));
  };

  const shake = (fields: Field[]) => {
    if (reduced()) return;
    fields.forEach((f) => {
      formRef.current?.querySelector(`[data-field="${f}"]`)?.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }],
        { duration: 260, easing: 'ease-out' },
      );
    });
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === 'submitting' || trap) return;
    const errs = validate(values);
    setErrors(errs);
    const bad = Object.keys(errs) as Field[];
    if (bad.length) {
      shake(bad);
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(bad[0]))}`)?.focus();
      return;
    }
    const link = buildMailto(values);
    setMailto(link);
    if (!CONTACT_ENDPOINT) {
      // No backend configured → hand off to the visitor's email app. Never claim delivery.
      setStatus('mailto');
      window.location.href = link;
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, source: 'iyanlabs.com' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
      setValues(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  const describedBy = (f: Field, hint?: boolean) => [hint ? `${id(f)}-hint` : '', errors[f] ? `${id(f)}-err` : ''].filter(Boolean).join(' ') || undefined;
  const fieldCls = (f: Field, extra = '') => ['field', extra, errors[f] && 'has-error', values[f] && 'is-filled'].filter(Boolean).join(' ');

  return (
    <section ref={ref} className="section contact stage--dark" id="contact" data-stage="dark" aria-labelledby="contact-title">
      <div className="spotlight" aria-hidden="true" />
      <div className="container">
        <div className="contact__frame">
          <svg className="contact__paths" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <rect className="contact__frame-path" x="1" y="1" width="998" height="598" rx="24" pathLength={1} />
            <rect className="contact__packet" x="1" y="1" width="998" height="598" rx="24" pathLength={1} />
          </svg>
          <span className="contact__focal" aria-hidden="true" />

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

          <form ref={formRef} className="cform" noValidate onSubmit={onSubmit} aria-labelledby="contact-title" aria-busy={status === 'submitting'}>
            <div className="cform__grid">
              <div className={fieldCls('name')} data-field="name">
                <input id={id('name')} name="name" type="text" autoComplete="name" placeholder=" " required aria-required="true"
                  aria-invalid={!!errors.name} aria-describedby={describedBy('name')} value={values.name} onChange={onChange('name')} onBlur={onBlur('name')} />
                <label htmlFor={id('name')}>Your name <span aria-hidden="true">*</span></label>
                <span className="field__line" aria-hidden="true" />
                {errors.name && <p className="field__err" id={`${id('name')}-err`}>{errors.name}</p>}
              </div>
              <div className={fieldCls('email')} data-field="email">
                <input id={id('email')} name="email" type="email" inputMode="email" autoComplete="email" placeholder=" " required aria-required="true"
                  aria-invalid={!!errors.email} aria-describedby={describedBy('email')} value={values.email} onChange={onChange('email')} onBlur={onBlur('email')} />
                <label htmlFor={id('email')}>Work email <span aria-hidden="true">*</span></label>
                <span className="field__line" aria-hidden="true" />
                {errors.email && <p className="field__err" id={`${id('email')}-err`}>{errors.email}</p>}
              </div>
              <div className={fieldCls('company')} data-field="company">
                <input id={id('company')} name="company" type="text" autoComplete="organization" placeholder=" " value={values.company} onChange={onChange('company')} />
                <label htmlFor={id('company')}>Company <span className="field__opt">(optional)</span></label>
                <span className="field__line" aria-hidden="true" />
              </div>
              <div className={fieldCls('topic', 'field--select')} data-field="topic">
                <select id={id('topic')} name="topic" required aria-required="true" aria-invalid={!!errors.topic} aria-describedby={describedBy('topic')}
                  value={values.topic} onChange={onChange('topic')} onBlur={onBlur('topic')}>
                  <option value="" disabled>Select a service</option>
                  {CONTACT.topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <label htmlFor={id('topic')}>What can we help you with? <span aria-hidden="true">*</span></label>
                <span className="field__line" aria-hidden="true" />
                {errors.topic && <p className="field__err" id={`${id('topic')}-err`}>{errors.topic}</p>}
              </div>
              <div className={fieldCls('message', 'field--full')} data-field="message">
                <textarea id={id('message')} name="message" rows={5} placeholder=" " required aria-required="true"
                  aria-invalid={!!errors.message} aria-describedby={describedBy('message', true)} value={values.message} onChange={onChange('message')} onBlur={onBlur('message')} />
                <label htmlFor={id('message')}>Tell us about your project <span aria-hidden="true">*</span></label>
                <span className="field__line" aria-hidden="true" />
                <p className="field__hint" id={`${id('message')}-hint`}>Goals, systems involved, timelines — whatever helps us understand the challenge.</p>
                {errors.message && <p className="field__err" id={`${id('message')}-err`}>{errors.message}</p>}
              </div>
              <div className="cform__trap" aria-hidden="true">
                <label htmlFor={`${uid}-web`}>Leave this field empty</label>
                <input id={`${uid}-web`} tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
              </div>
            </div>

            <div className="cform__foot">
              <button type="submit" className={`btn btn--primary btn--lg cform__submit${status === 'submitting' ? ' is-loading' : ''}${status === 'sent' ? ' is-success' : ''}`}
                disabled={status === 'submitting'} data-magnetic="" data-cursor="Send">
                <span className="btn__label">{status === 'submitting' ? 'Sending…' : status === 'sent' ? 'Message sent' : 'Start a Conversation'}</span>
                <span className="btn__icon" aria-hidden="true">
                  {status === 'sent'
                    ? <svg width="18" height="18" viewBox="0 0 16 16"><path className="cform__check" d="M3 8.5 6.5 12 13 4.5" pathLength={1} /></svg>
                    : <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
              </button>
              <p className="cform__privacy"><span aria-hidden="true">*</span> Required. The details you share are used to respond to your enquiry.</p>
            </div>

            <div className="cform__status" role="status" aria-live="polite">
              {status === 'sent' && <p className="msg msg--ok"><strong>Thank you — your message has been sent.</strong> We'll be in touch soon.</p>}
              {status === 'mailto' && (
                <p className="msg msg--info"><strong>Your email app should now open with your message ready to send.</strong> Please press send to reach us. If nothing opened, <a href={mailto}>try again</a> or email <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>.</p>
              )}
              {status === 'error' && (
                <p className="msg msg--err" role="alert"><strong>Sorry, we couldn't send your message.</strong> Please try again, or <a href={mailto}>send it by email</a> instead.</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
