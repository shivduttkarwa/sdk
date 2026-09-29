import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// B11: pin `.sdk-showcase`; desktop scrub dissolves the words and raises a laptop + phone
// playing the reel, mobile scrub grows #heroVideoWrap to 90% of the screen while the
// headline inners slide out; refresh ScrollTrigger on visualViewport resize; GSAP fade-up for every
// `.sdk-reveal`. Verbatim tween/trigger definitions; created triggers + tweens killed on
// unmount, visualViewport listener + debounce removed.
export function useShowcasePin() {
  useEffect(() => {
    const created: Killable[] = [];
    const tweens: Killable[] = [];
    const mm = gsap.matchMedia();

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
      const kinetic = showcaseSection.querySelector('.sdk-showcase__kinetic-wrap');
      const scrollTrigger = (scrub: number | boolean, onUpdate?: (self: ScrollTrigger) => void) => ({
        trigger: runway,
        start: 'top top',
        end: 'bottom bottom',
        scrub,
        invalidateOnRefresh: true,
        onUpdate,
      });

      // Desktop: the words dissolve first, then a laptop and a phone rise in playing the reel.
      mm.add('(min-width: 901px)', () => {
        const laptop = showcaseSection.querySelector('.sdk-device--laptop');
        const phone = showcaseSection.querySelector('.sdk-device--phone');
        const videos = [...showcaseSection.querySelectorAll<HTMLVideoElement>('.sdk-device__video')];
        videos.forEach((v) => (v.preload = 'auto'));

        let shown = false;
        let onScreen = false;
        let playing = false;
        const sync = () => {
          const on = shown && onScreen;
          if (on === playing) return;
          playing = on;
          videos.forEach((v) => (on ? v.play().catch(() => {}) : v.pause()));
        };
        const io = new IntersectionObserver((entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
          sync();
        });
        io.observe(showcaseSection);

        const tl = gsap.timeline({
          scrollTrigger: scrollTrigger(true, (self) => {
            shown = self.progress > 0.25;
            sync();
          }),
        });
        if (topInner) tl.to(topInner, { yPercent: -45, opacity: 0, filter: 'blur(14px)', ease: 'none', duration: 0.34 }, 0);
        if (bottomInner) tl.to(bottomInner, { yPercent: 45, opacity: 0, filter: 'blur(14px)', ease: 'none', duration: 0.34 }, 0);
        if (kinetic) tl.to(kinetic, { opacity: 0, scale: 0.9, filter: 'blur(16px)', ease: 'none', duration: 0.3 }, 0.02);
        if (laptop) tl.fromTo(laptop, { opacity: 0, x: -80, y: 100, scale: 0.92 }, { opacity: 1, x: 0, y: 0, scale: 1, ease: 'power2.out', duration: 0.42 }, 0.3);
        if (phone) tl.fromTo(phone, { opacity: 0, x: 100, y: 100, rotate: 4 }, { opacity: 1, x: 0, y: 0, rotate: 0, ease: 'power2.out', duration: 0.42 }, 0.4);
        tl.to({}, { duration: 0.16 });

        return () => {
          io.disconnect();
          videos.forEach((v) => v.pause());
        };
      });

      // Mobile: the reel card grows to 90% of the screen while the words dissolve.
      mm.add('(max-width: 900px)', () => {
        const video = heroWrap.querySelector('video');
        if (video) {
          video.preload = 'auto';
          video.play().catch(() => {});
        }
        const tl = gsap.timeline({ scrollTrigger: scrollTrigger(0.6) });
        tl.to(heroWrap, { width: '90vw', height: '90svh', borderRadius: '1.5rem', ease: 'none' }, 0);
        if (topInner) tl.to(topInner, { yPercent: -115, opacity: 0, ease: 'none' }, 0);
        if (bottomInner) tl.to(bottomInner, { yPercent: 115, opacity: 0, ease: 'none' }, 0);
        if (kinetic) tl.to(kinetic, { opacity: 0, filter: 'blur(12px)', ease: 'none', duration: 0.6 }, 0);

        return () => video?.pause();
      });
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

    // Full-screen blend layers over a playing video force a re-composite every video frame.
    const root = document.documentElement;
    const reelObserver = new IntersectionObserver((entries) => {
      root.classList.toggle('sdk-reel-live', entries.some((entry) => entry.isIntersecting));
    });
    if (showcaseSection) reelObserver.observe(showcaseSection);

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
      mm.revert();
      reelObserver.disconnect();
      root.classList.remove('sdk-reel-live');
      created.forEach((st) => st.kill());
      tweens.forEach((t) => t.kill());
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onVvResize);
      }
      clearTimeout(vvRefreshTimer);
    };
  }, []);
}
