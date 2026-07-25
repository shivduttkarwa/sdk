import { useEffect } from 'react';

// Handoff for Nav's bare section anchors (#services, #about, #contact) clicked on a route
// where the section doesn't exist: LenisContext stashes the anchor, routes home, and Home
// consumes it here once its layout has settled (same fonts.ready + double-rAF cadence as
// scrollOrchestrator, plus one more rAF so the initial ScrollTrigger.refresh — and the pin
// spacers it inserts — land first).
export const PENDING_ANCHOR_KEY = 'sdk-pending-anchor';

export function usePendingAnchor() {
  useEffect(() => {
    const href = sessionStorage.getItem(PENDING_ANCHOR_KEY);
    if (!href) return;
    sessionStorage.removeItem(PENDING_ANCHOR_KEY);

    let cancelled = false;
    const rafs: number[] = [];
    const chain = (steps: number, done: () => void) => {
      rafs.push(
        requestAnimationFrame(() => (steps > 1 ? chain(steps - 1, done) : done())),
      );
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      chain(3, () => {
        const target = document.querySelector(href);
        if (!target) return;
        const lenis = window.lenis;
        if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
        else (target as HTMLElement).scrollIntoView();
      });
    });

    return () => {
      cancelled = true;
      rafs.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);
}
