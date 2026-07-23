import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// Hero intro reveal. The name lines + tagline slide up from under a mask (the same
// "from under the mask, staggered" motion as the section titles), and — on first visit —
// this is held back until the preloader lifts (via the `sdk:preloader-done` event) so the
// title animates in as the loader clears, rather than settling behind it. Both name copies
// (red primary + the smoke-revealed white one) are animated in lockstep so they never ghost.
export function useHeroAnimation() {
  useEffect(() => {
    const tweens: Killable[] = [];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const primary = gsap.utils.toArray<HTMLElement>(
      '.sdk-hero__name--primary .sdk-hero__line-inner',
    );
    const revealed = gsap.utils.toArray<HTMLElement>(
      '.sdk-hero__name--revealed .sdk-hero__line-inner',
    );
    const all = [...primary, ...revealed];
    // Corresponding line across both copies (0 = SHIVDUTT, 1 = KARWA, 2 = tagline/desc).
    const line = (i: number) => [primary[i], revealed[i]].filter(Boolean) as HTMLElement[];

    // Hidden under the mask until the reveal plays (visible immediately under reduced motion).
    gsap.set(all, { yPercent: reduce ? 0 : 110 });

    // Showcase headline inners animate independently (below the fold) — unchanged.
    tweens.push(
      gsap.from('.sdk-showcase__headline .inner', {
        yPercent: 105,
        duration: 1.2,
        stagger: 0.14,
        ease: 'power4.out',
        delay: 0.3,
      }),
    );

    let played = false;
    let fallback = 0;
    const play = () => {
      if (played) return;
      played = true;
      window.clearTimeout(fallback);
      window.removeEventListener('sdk:preloader-done', play);
      if (reduce) return;

      const tl = gsap.timeline();
      tl.to(line(0), { yPercent: 0, duration: 1, ease: 'power4.out' }, 0)
        .to(line(1), { yPercent: 0, duration: 1, ease: 'power4.out' }, 0.12)
        .to(line(2), { yPercent: 0, duration: 0.9, ease: 'power3.out' }, 0.3)
        .from(
          '.sdk-scroll-cue, .sdk-hero__m-cta',
          { opacity: 0, y: 14, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
          0.5,
        );
      tweens.push(tl);
    };

    // First visit: the preloader is on screen — wait for it to lift. Otherwise (navigating
    // back to Home) reveal right away. A fallback guards against the event never arriving.
    const preloader = document.getElementById('sdk-preloader');
    const preloaderActive = preloader && getComputedStyle(preloader).display !== 'none';
    if (preloaderActive) {
      window.addEventListener('sdk:preloader-done', play, { once: true });
      fallback = window.setTimeout(play, 9000);
    } else {
      fallback = window.setTimeout(play, 150);
    }

    return () => {
      window.removeEventListener('sdk:preloader-done', play);
      window.clearTimeout(fallback);
      tweens.forEach((t) => t.kill());
    };
  }, []);
}
