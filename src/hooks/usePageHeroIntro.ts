import { useLayoutEffect } from 'react';
import { gsap, CustomEase } from '@/lib/gsapSetup';

// The exact cubic-bezier the old CSS cascade used, so converting to a timeline changed
// the plumbing but not the motion.
const RISE_EASE = CustomEase.create('pageHeroRise', 'M0,0 C0.6,0.3 0.01,0.99 1,1');

// ─────────────────────────────────────────────────────────────────────────────
// Internal page hero entrance — TUNING KNOBS (all times in seconds)
// Works, Services, About, Contact and Project detail all run this one timeline.
// Each hero element rises into its own clip mask, one after the next; the hero title
// counts as one element PER LINE, so "Selected" and "Work" step in separately.
// Tweak these to taste; nothing else needs to change.
// ─────────────────────────────────────────────────────────────────────────────
const HERO_INTRO = {
  startDelay: 0.06, // pause after mount before the first element moves
  itemStagger: 0.1, // delay between successive hero elements (eyebrow → title → lead → …)
  lineStagger: 0.15, // delay between the title's own lines, within the title's slot

  duration: 0.95, // how long each element takes to rise and unmask
  ease: RISE_EASE,

  riseFrom: 115, // yPercent each element starts below its mask
  clipFrom: 'inset(0 0 100% 0)', // mask fully closed
  clipTo: 'inset(0 0 -12% 0)', // open, with headroom so descenders are not shaved
};

/**
 * Entrance timeline for the internal page heroes. Opt in by putting `data-hero-intro` on
 * the element wrapping the hero copy — its direct children animate in document order.
 *
 * This was a CSS `riseReveal` cascade whose timings lived in ~12 rules across two blocks,
 * with the delays (.06/.16/.26/.36/.46) hardcoded per nth-child and duplicated for every
 * page's selector. It also could not stagger the hero title's lines, because the <h1> is a
 * single child and CSS has no way to reach into it and offset each line. Both problems go
 * away with a real timeline: one knob block above, positions computed rather than written
 * out, and the title expanded into its lines as the timeline is built.
 */
export function usePageHeroIntro() {
  useLayoutEffect(() => {
    const wrapper = document.querySelector<HTMLElement>('[data-hero-intro]');
    if (!wrapper) return;
    // Reduced motion: no timeline at all, so every element simply renders where it rests.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const k = HERO_INTRO;
    const from = { opacity: 0, yPercent: k.riseFrom, clipPath: k.clipFrom };
    const to = {
      opacity: 1,
      yPercent: 0,
      clipPath: k.clipTo,
      duration: k.duration,
      ease: k.ease,
    };

    // The context owns every tween and, on revert, strips the inline styles GSAP wrote —
    // so a route change away mid-entrance cannot leave a hero stuck part-revealed.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      let at = k.startDelay;

      Array.from(wrapper.children).forEach((child) => {
        const lines = child.querySelectorAll<HTMLElement>('.sdk-hero-title__line');
        if (lines.length) {
          // The title occupies one slot per line, then hands off to the next element.
          lines.forEach((line, i) => tl.fromTo(line, from, to, at + i * k.lineStagger));
          at += (lines.length - 1) * k.lineStagger + k.itemStagger;
        } else {
          tl.fromTo(child, from, to, at);
          at += k.itemStagger;
        }
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);
}
