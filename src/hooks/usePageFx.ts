import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapSetup';

// Scroll/pointer FX kit shared by the standalone pages (About, Services, Contact,
// Project detail). Elements inside the page root opt in via data attributes, so pages
// stay declarative JSX and every tween is owned (and reverted) by one gsap.context:
//
//   data-fx="rise" | "fade" | "clip" | "scale"  reveal once when scrolled into view
//   data-fx="draw" | "drawv"                    scaleX / scaleY line draw
//   data-fx-stagger                             reveal the element's CHILDREN, staggered
//   data-fx-delay="0.2"                         extra seconds before the reveal
//   data-parallax="0.15"                        scrubbed vertical drift (± that × 100px)
//   data-count="40" (+ data-count-suffix="+")   count up from 0 when in view
//   data-magnetic (or ="0.5" strength)          element follows the pointer, springs back
//
// Under prefers-reduced-motion everything is skipped — content renders static and
// visible, because reveals are gsap.from()s that never run.
export function usePageFx(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const magnetCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const once = (el: Element) => ({
        trigger: el,
        start: 'top 88%',
        once: true,
      });

      root.querySelectorAll<HTMLElement>('[data-fx]').forEach((el) => {
        const kind = el.dataset.fx;
        const delay = parseFloat(el.dataset.fxDelay ?? '0') || 0;
        const base = { duration: 1.05, ease: 'power3.out', delay, scrollTrigger: once(el) };
        if (kind === 'rise') gsap.from(el, { ...base, y: 64, opacity: 0 });
        else if (kind === 'fade') gsap.from(el, { ...base, opacity: 0, duration: 1.3 });
        else if (kind === 'scale') gsap.from(el, { ...base, scale: 1.08, opacity: 0, duration: 1.25 });
        else if (kind === 'clip')
          gsap.from(el, {
            ...base,
            clipPath: 'inset(0 0 100% 0)',
            y: 40,
            duration: 1.3,
            ease: 'power4.out',
          });
        else if (kind === 'draw')
          gsap.from(el, { ...base, scaleX: 0, transformOrigin: 'left center', ease: 'power2.inOut', duration: 1.2 });
        else if (kind === 'drawv')
          gsap.from(el, { ...base, scaleY: 0, transformOrigin: 'top center', ease: 'power2.inOut', duration: 1.4 });
      });

      root.querySelectorAll<HTMLElement>('[data-fx-stagger]').forEach((el) => {
        const children = Array.from(el.children);
        if (!children.length) return;
        gsap.from(children, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          delay: parseFloat(el.dataset.fxDelay ?? '0') || 0,
          scrollTrigger: once(el),
        });
      });

      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const depth = parseFloat(el.dataset.parallax ?? '0') || 0;
        gsap.fromTo(
          el,
          { y: -depth * 100 },
          {
            y: depth * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = parseFloat(el.dataset.count ?? '0') || 0;
        const suffix = el.dataset.countSuffix ?? '';
        const state = { value: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(state, {
          value: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: once(el),
          onUpdate: () => {
            el.textContent = `${Math.round(state.value)}${suffix}`;
          },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic ?? '') || 0.35;
        const toX = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
        const toY = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
        const onMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          toX((event.clientX - rect.left - rect.width / 2) * strength);
          toY((event.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => {
          toX(0);
          toY(0);
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        magnetCleanups.push(() => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
        });
      });
    }, root);

    // Deep links land here without Home's orchestrated refresh; re-measure once fonts
    // and layout have settled so `once` triggers fire at the right offsets.
    let cancelled = false;
    let raf = 0;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      magnetCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [rootRef]);
}
