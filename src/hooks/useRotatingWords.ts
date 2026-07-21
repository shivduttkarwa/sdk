import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

type Recipe = {
  in: (el: Element) => void;
  out: (el: Element, done: () => void) => void;
};

// B8 initRotatingWords: cycle the `.sdk-showcase__kinetic-word` elements with four GSAP
// "recipe" in/out animations, swapping every 2700ms. The hook owns each word's per-char
// spans. Recipes are verbatim; only the recursive setTimeout gets a disposed guard + a
// tracked id so it can be cancelled on unmount.
export function useRotatingWords() {
  useEffect(() => {
    const words = document.querySelectorAll('.sdk-showcase__kinetic-word');
    if (!words.length) return;

    const DISPLAY_MS = 2700;

    words.forEach((el) => {
      const text = (el.textContent ?? '').trim();
      (el as HTMLElement).dataset.text = text;
      el.innerHTML = [...text]
        .map((ch) => `<span class="sdk-kinetic__char" data-ch="${ch}">${ch}</span>`)
        .join('');
    });

    gsap.set(words, { opacity: 0, xPercent: -50, yPercent: -50 });

    const recipes: Recipe[] = [
      {
        in(el) {
          const chars = el.querySelectorAll('.sdk-kinetic__char');
          gsap.set(el, { opacity: 1, x: 0 });
          gsap.fromTo(
            chars,
            { x: -80, opacity: 0, filter: 'blur(12px)' },
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.42,
              stagger: 0.048,
              ease: 'power4.out',
            },
          );
        },
        out(el, done) {
          gsap.to(el, {
            x: 120,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.3,
            ease: 'power3.in',
            onComplete() {
              gsap.set(el, { x: 0, opacity: 0, filter: 'blur(0px)' });
              done();
            },
          });
        },
      },

      {
        in(el) {
          gsap.set(el, { opacity: 1, y: 0, scaleY: 1, transformOrigin: '50% 50%' });
          gsap.fromTo(
            el,
            { y: -90, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(3)' },
          );
        },
        out(el, done) {
          gsap.set(el, { transformOrigin: '50% 100%' });
          gsap.to(el, {
            scaleY: 0,
            opacity: 0,
            duration: 0.28,
            ease: 'power3.in',
            onComplete() {
              gsap.set(el, { scaleY: 1, opacity: 0, transformOrigin: '50% 50%' });
              done();
            },
          });
        },
      },

      {
        in(el) {
          const chars = [...el.querySelectorAll('.sdk-kinetic__char')];
          const mid = (chars.length - 1) / 2;
          gsap.set(el, { opacity: 1 });
          const tl = gsap.timeline();
          chars.forEach((ch, i) => {
            tl.fromTo(
              ch,
              { x: (i - mid) * 95, opacity: 0, filter: 'blur(8px)' },
              { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'expo.out' },
              0,
            );
          });
        },
        out(el, done) {
          const chars = [...el.querySelectorAll('.sdk-kinetic__char')];
          const mid = (chars.length - 1) / 2;
          const tl = gsap.timeline({
            onComplete() {
              gsap.set(el, { opacity: 0 });
              gsap.set(chars, { x: 0, filter: 'blur(0px)' });
              done();
            },
          });
          chars.forEach((ch, i) => {
            tl.to(
              ch,
              {
                x: (i - mid) * 95,
                opacity: 0,
                filter: 'blur(8px)',
                duration: 0.38,
                ease: 'expo.in',
              },
              0,
            );
          });
        },
      },

      {
        in(el) {
          const chars = el.querySelectorAll('.sdk-kinetic__char');
          gsap.set(el, { opacity: 1 });
          gsap.fromTo(
            chars,
            { y: 75, opacity: 0, rotation: 12 },
            {
              y: 0,
              opacity: 1,
              rotation: 0,
              duration: 0.85,
              stagger: 0.085,
              ease: 'elastic.out(1, 0.42)',
            },
          );
        },
        out(el, done) {
          const chars = el.querySelectorAll('.sdk-kinetic__char');
          gsap.to(chars, {
            y: 60,
            opacity: 0,
            rotation: -10,
            duration: 0.26,
            stagger: 0.04,
            ease: 'power2.in',
            onComplete() {
              gsap.set(el, { opacity: 0 });
              gsap.set(chars, { y: 0, rotation: 0 });
              done();
            },
          });
        },
      },
    ];

    let current = 0;
    let disposed = false;
    let timeoutId = 0;

    function scheduleCycle() {
      timeoutId = window.setTimeout(cycle, DISPLAY_MS);
    }

    function cycle() {
      if (disposed) return;
      const prev = current;
      current = (current + 1) % words.length;
      recipes[prev].out(words[prev], () => {
        if (disposed) return;
        recipes[current].in(words[current]);
        scheduleCycle();
      });
    }

    recipes[0].in(words[0]);
    scheduleCycle();

    return () => {
      disposed = true;
      clearTimeout(timeoutId);
      words.forEach((el) => {
        gsap.killTweensOf(el);
        gsap.killTweensOf(el.querySelectorAll('.sdk-kinetic__char'));
        el.textContent = (el as HTMLElement).dataset.text ?? el.textContent;
      });
    };
  }, []);
}
