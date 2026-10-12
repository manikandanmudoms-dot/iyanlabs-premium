/** Lets CTAs anywhere on the page pre-fill the contact form. */
const EVENT = 'iyanlabs:contact';
export interface ContactIntent { topic?: string; message?: string; }

export function prefillContact(intent: ContactIntent) {
  window.dispatchEvent(new CustomEvent<ContactIntent>(EVENT, { detail: intent }));
}
export function onContactIntent(handler: (intent: ContactIntent) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ContactIntent>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
