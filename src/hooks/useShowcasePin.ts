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
    if (heroWrap && showcaseSection) {
      const topInner = showcaseSection.querySelector('.sdk-showcase__headline--top .inner');
      const bottomInner = showcaseSection.querySelector('.sdk-showcase__headline--bottom .inner');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: showcaseSection,
          start: 'top top',
          end: '+=100%',
          scrub: true,
          pin: true,
          pinSpacing: true,
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

    // Refresh GSAP when mobile browser chrome shows/hides (changes visual viewport height)
    let vvRefreshTimer: number | undefined;
    const onVvResize = () => {
      clearTimeout(vvRefreshTimer);
      vvRefreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 100);
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
