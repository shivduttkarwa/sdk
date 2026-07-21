import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// C: the tech-stack pin (tech-stack-pinned.js). The original retry-boot loop only existed to
// wait for async CDN/DOM readiness that no longer applies — here the effect runs once after
// mount ([data-tech-pin] is guaranteed by JSX, gsap is always imported). The one-time global
// guard + image-load refresh + rAF refresh + matchMedia-once are preserved verbatim; created
// triggers/tweens/listeners are torn down and the guard reset on unmount.
export function useTechStackPin() {
  useEffect(() => {
    if (window.__sdkTechPinInitialized) return;

    const root = document.querySelector('[data-tech-pin]');
    if (!root) return;

    const cards = Array.from(root.querySelectorAll('[data-service-card]'));
    const portrait = root.querySelector('.sdk-tech-pin__portrait');
    const image = root.querySelector('[data-tech-pin-image]') as HTMLImageElement | null;
    const isMobile = window.matchMedia('(max-width: 980px)').matches;

    if (!cards.length) return;

    window.__sdkTechPinInitialized = true;

    const created: Killable[] = [];
    const tweens: Killable[] = [];

    if (portrait) {
      const t = gsap.fromTo(
        portrait,
        { autoAlpha: 0, xPercent: -5, scale: 1.04 },
        {
          autoAlpha: 1,
          xPercent: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 72%',
            once: true,
          },
        },
      );
      tweens.push(t);
      if (t.scrollTrigger) created.push(t.scrollTrigger);
    }

    // Left portrait is static (blended into the background) — no parallax.
    let onImgLoad: (() => void) | null = null;
    if (image && !image.complete) {
      onImgLoad = () => ScrollTrigger.refresh();
      image.addEventListener('load', onImgLoad, { once: true });
    }

    // Big heading animates in on enter (via useSectionTitles). On desktop it sits on the right
    // and clears out as the first card scrolls in; on mobile it stays pinned at the top.
    const intro = root.querySelector('[data-tech-intro]');
    if (intro && !isMobile) {
      const t = gsap.to(intro, {
        autoAlpha: 0,
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '16% top',
          scrub: true,
        },
      });
      tweens.push(t);
      if (t.scrollTrigger) created.push(t.scrollTrigger);
    }

    cards.forEach((card) => {
      const t = gsap.from(card, {
        yPercent: 15,
        scale: 1.25,
        rotation: gsap.utils.random(-25, 25, 5),
        ease: 'back.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'center center',
          scrub: 0.5,
        },
      });
      tweens.push(t);
      if (t.scrollTrigger) created.push(t.scrollTrigger);
    });

    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      if (image && onImgLoad) image.removeEventListener('load', onImgLoad);
      created.forEach((st) => st.kill());
      tweens.forEach((t) => t.kill());
      window.__sdkTechPinInitialized = false;
    };
  }, []);
}
