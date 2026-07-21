import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

// B9 startHeroAnimation: intro reveal of hero name lines, scroll cue / status / tagline,
// and showcase headline inners. Verbatim tweens; original guarded on window.gsap (always
// present now). Killed on unmount.
export function useHeroAnimation() {
  useEffect(() => {
    const tweens = [
      gsap.from('.sdk-hero__name-line', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.1,
      }),
      gsap.from('.sdk-scroll-cue, .sdk-hero__status, .sdk-hero__tagline', {
        opacity: 0,
        y: 14,
        duration: 1,
        stagger: 0.07,
        ease: 'power2.out',
        delay: 0.6,
      }),
      gsap.from('.sdk-showcase__headline .inner', {
        yPercent: 105,
        duration: 1.2,
        stagger: 0.14,
        ease: 'power4.out',
        delay: 0.3,
      }),
    ];
    return () => tweens.forEach((t) => t.kill());
  }, []);
}
