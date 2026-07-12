(function () {
  const MAX_BOOT_TRIES = 80;

  function initPinnedTechStack() {
    if (window.__sdkTechPinInitialized) return true;

    const root = document.querySelector('[data-tech-pin]');
    if (!root || !window.gsap || !window.ScrollTrigger) return false;

    const cards = Array.from(root.querySelectorAll('[data-service-card]'));
    const portrait = root.querySelector('.sdk-tech-pin__portrait');
    const image = root.querySelector('[data-tech-pin-image]');
    const isMobile = window.matchMedia('(max-width: 980px)').matches;

    if (!cards.length) return false;

    window.__sdkTechPinInitialized = true;
    gsap.registerPlugin(ScrollTrigger);

    if (isMobile) {
      gsap.set(cards, { clearProps: 'all' });
      return true;
    }

    if (portrait) {
      gsap.fromTo(portrait,
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
            once: true
          }
        }
      );
    }

    // Left portrait is static (blended into the background) — no parallax.
    if (image && !image.complete) {
      image.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }

    // Big right-side heading animates in on enter (via initSectionTitleAnims), then
    // clears out as the section pins and the first card scrolls in.
    const intro = root.querySelector('[data-tech-intro]');
    if (intro) {
      gsap.to(intro, {
        autoAlpha: 0,
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '16% top',
          scrub: true
        }
      });
    }

    cards.forEach((card) => {
      gsap.from(card, {
        yPercent: 15,
        scale: 1.25,
        rotation: gsap.utils.random(-25, 25, 5),
        ease: 'back.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'center center',
          scrub: 0.5
        }
      });
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return true;
  }

  function boot(triesLeft) {
    if (initPinnedTechStack()) return;
    if (triesLeft <= 0) return;
    window.setTimeout(() => boot(triesLeft - 1), 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => boot(MAX_BOOT_TRIES), { once: true });
  } else {
    boot(MAX_BOOT_TRIES);
  }
})();
