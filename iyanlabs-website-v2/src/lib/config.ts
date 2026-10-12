/** Runtime configuration from Vite environment variables (see .env.example). */
export const CONTACT_ENDPOINT: string = (import.meta.env.VITE_CONTACT_ENDPOINT ?? '').trim();
