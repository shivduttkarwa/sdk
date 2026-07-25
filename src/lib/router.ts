import { useSyncExternalStore } from 'react';

// Tiny hash-based router. Hash routing (not the History API) is deliberate: the site
// deploys to GitHub Pages from /docs with `base: './'` and no server-side rewrite, so
// deep links and refreshes to `#/works/real-gold` resolve against the single index.html
// without a 404 fallback hack. Route hashes always start with `#/`; bare anchors like
// `#services` stay in-page scroll targets (see LenisContext), so the two never collide.

export type Route =
  | { name: 'home' }
  | { name: 'works' }
  | { name: 'about' }
  | { name: 'services' }
  | { name: 'contact' }
  | { name: 'project'; slug: string };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '');
  if (path === '/works') return { name: 'works' };
  if (path === '/about') return { name: 'about' };
  if (path === '/services') return { name: 'services' };
  if (path === '/contact') return { name: 'contact' };
  const match = path.match(/^\/works\/([\w-]+)$/);
  if (match) return { name: 'project', slug: match[1] };
  return { name: 'home' };
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getSnapshot(): string {
  return window.location.hash;
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getSnapshot, () => '');
  return parseHash(hash);
}
