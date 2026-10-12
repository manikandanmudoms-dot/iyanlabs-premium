import type { ServiceId } from '../../content/site';

const PATHS: Record<ServiceId, string> = {
  salesforce: 'M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 8.97L17 18H7z',
  mulesoft: 'M5 6h4v4H5zM15 6h4v4h-4zM10 15h4v4h-4zM9 8h6M7 10l4 5M17 10l-4 5',
  mobile: 'M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3zM11 18h2',
  web: 'M3.5 5.5h17v13h-17zM3.5 9h17M6 7.3h.01M8 7.3h.01M7 12h5M7 15h8',
  agents: 'M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z',
  chatbots: 'M4 5.5h16v10H10l-4 3.5v-3.5H4zM8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01',
};

/** Service icon, always rendered alongside a text label (never colour alone). */
export function ServiceIcon({ id, size = 22 }: { id: ServiceId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[id]} />
    </svg>
  );
}
