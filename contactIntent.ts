/** Lets service CTAs pre-select the enquiry topic in the contact form. */
const EVENT = 'iyanlabs:topic';

export function selectContactTopic(topic: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: topic }));
}

export function onContactTopic(handler: (topic: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
