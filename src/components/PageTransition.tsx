import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapSetup';

// Page transition: the outgoing page lifts up and fades behind a dark dim overlay, the route
// swaps while hidden, then the incoming page rises from below and fades in — after which its
// hero headings cascade in via the SplitText-style line reveal (see `riseReveal` in the
// stylesheet). Core motion uses cubic-bezier(.60,.30,.01,.99). Honors reduced-motion.
const EASE = 'cubic-bezier(.60,.30,.01,.99)';

export default function PageTransition() {
  const dimRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  useEffect(() => {
    const dim = dimRef.current;
    if (!dim) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const swap = (href: string) => {
      window.location.hash = href;
      const lenis = window.lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#/"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      // Same-route click (the logo on Home, or the current page's nav link): scroll back
      // to the top instead of a dead click. '' and '#/' are both Home.
      if (href === (window.location.hash || '#/')) {
        event.preventDefault();
        if (animating.current) return;
        const lenis = window.lenis;
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
      event.preventDefault();
      if (animating.current) return;

      const pageView = document.getElementById('page-view');
      if (reduce || !pageView) {
        swap(href);
        return;
      }

      animating.current = true;
      dim.style.pointerEvents = 'auto';

      gsap
        .timeline({
          defaults: { ease: EASE },
          onComplete: () => {
            gsap.set(pageView, { clearProps: 'transform,opacity' });
            gsap.set(dim, { opacity: 0 });
            dim.style.pointerEvents = 'none';
            animating.current = false;
            // The incoming page's ScrollTriggers were measured while #page-view was still
            // translated by the transition; re-measure now that the transform is cleared.
            ScrollTrigger.refresh();
          },
        })
        // Lift the current page away + dim in.
        .to(pageView, { y: -130, opacity: 0, duration: 0.42 }, 0)
        .to(dim, { opacity: 0.5, duration: 0.42 }, 0)
        // Swap route while covered, then drop the (now-hidden) new page below the fold.
        .add(() => swap(href), 0.44)
        .set(pageView, { y: 130, opacity: 0 }, 0.46)
        // Rise the new page up into place + dim out.
        .to(pageView, { y: 0, opacity: 1, duration: 0.72 }, 0.5)
        .to(dim, { opacity: 0, duration: 0.55 }, 0.5);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return <div className="page-dim" ref={dimRef} aria-hidden="true"></div>;
}
