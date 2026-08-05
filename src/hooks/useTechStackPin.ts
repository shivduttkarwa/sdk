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

    // The heading animates in on enter (via useSectionTitles) and then STAYS: it holds the
    // left of the stage while the cards cycle through on the right. It used to scrub to
    // autoAlpha 0 between 'top top' and '16% top', which made sense when the heading and the
    // cards shared the right-hand side and had to take turns — with them on opposite sides
    // there is nothing to clear out of the way, and fading it left the stage half empty.

    // Cards 02-04 drop in from the upper RIGHT and rotate upright as they land, so they
    // share one direction of travel. (Rotation used to be gsap.utils.random(-25, 25), which
    // sent each card in at a different angle — the reason they read as unrelated.) Card 01
    // is excluded and just fades up; see below.
    const FALL_FROM = {
      xPercent: 45,
      yPercent: -70,
      rotation: 20,
      scale: 1.1,
      autoAlpha: 0,
    } as const;

    cards.forEach((card, i) => {
      const t =
        i === 0
          ? // Card 01 does NOT use the drop — it simply fades up a little. It is the card
            // already sitting at rest when the section arrives, so throwing it in from off
            // screen fought that. The drop belongs to 02-04, which actually travel in.
            gsap.from(card, {
              autoAlpha: 0,
              y: 46,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                // 'top 45%' fired while the heading was still rising, so the card arrived
                // first; 25% puts it clearly after the title has landed.
                trigger: root,
                start: 'top 25%',
                toggleActions: 'play none none reverse',
              },
            })
          : // 02-04 genuinely travel up the runway, so theirs stays scrubbed to the scroll.
            gsap.from(card, {
              ...FALL_FROM,
              ease: 'power2.out',
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
