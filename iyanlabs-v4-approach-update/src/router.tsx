import { createContext, useCallback, useContext, useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

/**
 * Minimal, dependency-free client router (History API).
 * - <RouterProvider> tracks the current pathname.
 * - Any same-origin <a href="/..."> click is handled automatically (no special Link needed),
 *   so "/approach", "/#contact" and "/approach#faq" all work from anywhere.
 * - After navigation it scrolls to the hash target (once rendered) or to the top.
 * Swap for react-router later if you need nested routes or loaders.
 */
interface RouterState { path: string; navigate: (to: string) => void; }
const Ctx = createContext<RouterState>({ path: '/', navigate: () => {} });

export const ROUTES = ['/', '/approach'] as const;
const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';

function scrollToHash(hash: string, tries = 20) {
  if (!hash) { window.scrollTo(0, 0); return; }
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) { if (tries > 0) setTimeout(() => scrollToHash(hash, tries - 1), 60); return; }
  const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'auto' });
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => clean(window.location.pathname));

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.href);
    const next = clean(url.pathname);
    if (next === clean(window.location.pathname) && url.hash) {
      // Same page: let the in-page smooth scroll handler deal with it.
      history.pushState(null, '', url.pathname + url.hash);
      scrollToHash(url.hash);
      return;
    }
    history.pushState(null, '', url.pathname + url.search + url.hash);
    window.dispatchEvent(new CustomEvent('iyanlabs:route', { detail: { path: next, hash: url.hash } }));
    setPath(next);
  }, []);

  useEffect(() => {
    const onPop = () => setPath(clean(window.location.pathname));
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href') ?? '';
      if (!href.startsWith('/')) return; // external, mailto:, tel: and in-page "#..." are handled elsewhere
      e.preventDefault();
      navigate(href);
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('popstate', onPop); document.removeEventListener('click', onClick); };
  }, [navigate]);

  // After a route renders, honour the hash or reset scroll.
  useEffect(() => {
    const hash = window.location.hash;
    requestAnimationFrame(() => scrollToHash(hash));
  }, [path]);

  return <Ctx.Provider value={{ path, navigate }}>{children}</Ctx.Provider>;
}

export const useRouter = () => useContext(Ctx);

/** Optional helper: a plain anchor that marks itself as current. */
export function NavLink({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { path } = useRouter();
  const current = clean(new URL(href, 'http://x').pathname) === path && !href.includes('#');
  return <a href={href} aria-current={current ? 'page' : undefined} {...rest}>{children}</a>;
}

/** Sets <title>, meta description and canonical per page. */
export function usePageMeta(title: string, description: string, canonicalPath: string) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, attr: string, val: string, create: () => HTMLElement) => {
      let el = document.head.querySelector(sel) as HTMLElement | null;
      if (!el) { el = create(); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    set('meta[name="description"]', 'content', description, () => Object.assign(document.createElement('meta'), { name: 'description' }));
    set('link[rel="canonical"]', 'href', `https://iyanlabs.com${canonicalPath}`, () => Object.assign(document.createElement('link'), { rel: 'canonical' }));
    set('meta[property="og:title"]', 'content', title, () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:title'); return m; });
    set('meta[property="og:description"]', 'content', description, () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:description'); return m; });
    set('meta[property="og:url"]', 'content', `https://iyanlabs.com${canonicalPath}`, () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:url'); return m; });
  }, [title, description, canonicalPath]);
}
