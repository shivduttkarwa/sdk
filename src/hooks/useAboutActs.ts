import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapSetup';

// ─────────────────────────────────────────────────────────────────────────────
// /about act choreography — TUNING KNOBS
// The page is a sequence of full-viewport acts rather than stacked sections. Acts marked
// `.abt-seq` pin and step through their own items as you scroll; the rest simply pass.
// ─────────────────────────────────────────────────────────────────────────────
const ACTS = {
  /** Scroll length per item in a pinned act, as a % of viewport height. */
  holdPerItem: 95,
  /** How sharply an item fades as the sequence moves off it.
   *  At 2 an item is spent exactly as the next begins, so only ever ONE beat is legible.
   *  Lower values overlap them, and two headlines readable at once reads as a bug rather
   *  than a transition. */
  falloff: 2,
  /** Vertical travel of an item across its window, in rem. */
  drift: 3.2,
  /** Extra scroll the belief act holds for, as a % of viewport height. The manifesto has
   *  to be readable at particle resolution, which takes longer than reading it as type. */
  beliefHold: 170,
};

/**
 * Pins each sequence act and cross-fades its items, and lights the fixed chapter rail.
 *
 * Items are stacked on top of each other and driven directly from scroll progress rather
 * than tweened: at any scroll position exactly one item is at full strength and its
 * neighbours are partway out, so scrubbing backwards is as correct as scrubbing forwards.
 *
 * Under reduced motion nothing pins and nothing is written — the acts render as a plain
 * stacked document, every item visible, which is why the CSS defaults each item to
 * opacity 1 rather than 0.
 */
export function useAboutActs(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Triggers are created in DOM ORDER, and every pin is registered before any
      // measurement is trusted. Pinning inserts a spacer, which pushes everything below it
      // down — so a trigger created before an earlier pin exists computes its start
      // against a page that is about to get taller, and fires in the wrong place. That is
      // exactly what happened here: the road act had already played out by the time it
      // reached the screen. The explicit refresh at the end settles every position once
      // all the spacers are in.

      // The belief act pins without stepping — it holds one thing still while the cloud
      // spells it out. First, because it sits above the sequences.
      const belief = root.querySelector<HTMLElement>('.abt-belief__pin');
      if (belief) {
        ScrollTrigger.create({
          trigger: belief,
          start: 'top top',
          end: `+=${ACTS.beliefHold}%`,
          pin: true,
          pinSpacing: true,
        });
      }

      root.querySelectorAll<HTMLElement>('.abt-seq').forEach((seq) => {
        const pin = seq.querySelector<HTMLElement>('.abt-seq__pin');
        const items = Array.from(seq.querySelectorAll<HTMLElement>('.abt-seq__item'));
        if (!pin || items.length < 2) return;

        const last = items.length - 1;
        // Start every item hidden except the first, so the act opens on its own opening
        // frame rather than on all of them at once before the first scroll event lands.
        items.forEach((el, i) => {
          el.style.opacity = i === 0 ? '1' : '0';
        });

        ScrollTrigger.create({
          trigger: seq,
          start: 'top top',
          end: `+=${items.length * ACTS.holdPerItem}%`,
          pin,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            // Progress maps across item indices, so the final item is fully resolved at
            // the end of the act rather than halfway through its own window.
            const head = self.progress * last;
            items.forEach((el, i) => {
              const d = head - i;
              const o = Math.max(0, 1 - Math.abs(d) * ACTS.falloff);
              el.style.opacity = o.toFixed(3);
              el.style.transform = `translateY(${(-d * ACTS.drift).toFixed(2)}rem)`;
              // Only the item in front should take clicks or be read out.
              el.classList.toggle('is-current', o > 0.5);
            });
          },
        });
      });

      // Chapter rail: one marker per act, lit while that act owns the viewport.
      const marks = Array.from(root.querySelectorAll<HTMLElement>('.abt-rail__mark'));
      root.querySelectorAll<HTMLElement>('[data-act]').forEach((act, i) => {
        ScrollTrigger.create({
          trigger: act,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => marks[i]?.classList.toggle('is-active', self.isActive),
        });
      });

      ScrollTrigger.refresh();
    }, root);

    // The page arrives behind a preloader and the portrait canvas mounts asynchronously,
    // both of which can settle layout after the triggers are built. One more refresh once
    // the webfonts land keeps every start and end honest.
    let cancelled = false;
    document.fonts?.ready
      .then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      })
      .catch(() => {
        /* fonts API unavailable — the refresh above already ran */
      });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [rootRef]);
}
