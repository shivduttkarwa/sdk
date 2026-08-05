import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// B11: pin `.sdk-showcase`, scrub-expand #heroVideoWrap to fullscreen while the headline
// inners slide out; refresh ScrollTrigger on visualViewport resize; GSAP fade-up for every
// `.sdk-reveal`. Verbatim tween/trigger definitions; created triggers + tweens killed on
// unmount, visualViewport listener + debounce removed.
export function useShowcasePin() {
  useEffect(() => {
    const created: Killable[] = [];
    const tweens: Killable[] = [];

    const heroWrap = document.getElementById('heroVideoWrap');
    const showcaseSection = document.querySelector('.sdk-showcase');
    const runway = document.getElementById('showcaseRunway');
    if (heroWrap && showcaseSection && runway) {
      const topInner = showcaseSection.querySelector('.sdk-showcase__headline--top .inner');
      const bottomInner = showcaseSection.querySelector('.sdk-showcase__headline--bottom .inner');
      // No ScrollTrigger pin: CSS sticky holds the section inside the runway (see
      // Showcase.tsx), so the hold is compositor-applied and exact at any touch velocity —
      // a ScrollTrigger pin on native touch scroll landed a frame late on fast flicks, and
      // every compensation (anticipatePin, syncTouch) traded one artifact for another on a
      // real device. This trigger only drives the expansion scrub across the runway, which
      // spans [sticky engage .. sticky release] — the exact window the pin used to cover.
      // Touch has no Lenis smoothing (wheel-only), so mobile takes a short catch-up scrub
      // to iron raw finger deltas out of the layout animation; desktop keeps `true`
      // because Lenis's lerp already smooths it (same split as useIntroBody).
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: runway,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isMobile ? 0.6 : true,
          invalidateOnRefresh: true,
        },
      });
      if (tl.scrollTrigger) created.push(tl.scrollTrigger);
      tweens.push(tl);

      tl.to(
        heroWrap,
        {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          ease: 'none',
        },
        0,
      );

      if (topInner && bottomInner) {
        tl.to(
          topInner,
          {
            yPercent: -115,
            opacity: 0,
            ease: 'none',
          },
          0,
        );
        tl.to(
          bottomInner,
          {
            yPercent: 115,
            opacity: 0,
            ease: 'none',
          },
          0,
        );
      }
    }

    // Refresh GSAP on real viewport reflows (orientation, keyboard) — but NOT on browser
    // chrome show/hide. The chrome collapse fires this on the user's first downward flick,
    // and the unconditional refresh() it used to trigger recalced every trigger on the page
    // mid-momentum — the "jerk" approaching the showcase. Chrome deltas are height-only and
    // ≲100px; orientation changes width and keyboards move height by 250px+, so gating on
    // (width changed OR height delta > 150) passes exactly the reflows that need a refresh.
    let vvRefreshTimer: number | undefined;
    let vvW = window.visualViewport?.width ?? window.innerWidth;
    let vvH = window.visualViewport?.height ?? window.innerHeight;
    const onVvResize = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      if (Math.abs(vv.width - vvW) < 1 && Math.abs(vv.height - vvH) < 150) return;
      clearTimeout(vvRefreshTimer);
      vvRefreshTimer = window.setTimeout(() => {
        vvW = vv.width;
        vvH = vv.height;
        ScrollTrigger.refresh();
      }, 100);
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onVvResize);
    }

    gsap.utils.toArray<HTMLElement>('.sdk-reveal').forEach((el) => {
      const t = gsap.fromTo(
        el,
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        },
      );
      tweens.push(t);
      if (t.scrollTrigger) created.push(t.scrollTrigger);
    });

    return () => {
      created.forEach((st) => st.kill());
      tweens.forEach((t) => t.kill());
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onVvResize);
      }
      clearTimeout(vvRefreshTimer);
    };
  }, []);
}
