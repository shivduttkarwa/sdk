import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

// B20c: flip-style per-char hover animation on `.sdk-email-link`. Verbatim tweens; the hook
// rebuilds each line's char spans and owns them. Listeners removed + tweens killed on unmount.
export function useEmailHover() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll('.sdk-email-link').forEach((link) => {
      const text = (link as HTMLElement).dataset.text || (link.textContent ?? '').trim();
      const baseLine = link.querySelector('.sdk-email-line--base');
      const hoverLine = link.querySelector('.sdk-email-line--hover');
      if (!baseLine || !hoverLine) return;

      function buildChars(target: Element) {
        target.innerHTML = '';
        [...text].forEach((letter) => {
          const span = document.createElement('span');
          if (letter === ' ') {
            span.className = 'sdk-email-char sdk-email-char--space';
            span.innerHTML = '&nbsp;';
          } else {
            span.className = 'sdk-email-char';
            span.textContent = letter;
          }
          target.appendChild(span);
        });
      }

      buildChars(baseLine);
      buildChars(hoverLine);

      const baseChars = baseLine.querySelectorAll('.sdk-email-char');
      const hoverChars = hoverLine.querySelectorAll('.sdk-email-char');

      gsap.set(baseChars, { yPercent: 0, scaleY: 1, rotateX: 0, z: 0, transformOrigin: '50% 0%' });
      gsap.set(hoverChars, {
        yPercent: 26,
        scaleY: 0.08,
        rotateX: -82,
        z: -40,
        transformOrigin: '50% 100%',
      });

      function onEnter() {
        gsap.killTweensOf([baseChars, hoverChars]);
        gsap.to(baseChars, {
          yPercent: -28,
          scaleY: 0.08,
          rotateX: 82,
          z: -40,
          duration: 0.78,
          ease: 'expo.out',
          stagger: { each: 0.018, from: 'start' },
          transformOrigin: '50% 0%',
        });
        gsap.to(hoverChars, {
          yPercent: 0,
          scaleY: 1,
          rotateX: 0,
          z: 0,
          duration: 0.78,
          ease: 'expo.out',
          stagger: { each: 0.018, from: 'start' },
          transformOrigin: '50% 100%',
        });
      }

      function onLeave() {
        gsap.killTweensOf([baseChars, hoverChars]);
        gsap.to(baseChars, {
          yPercent: 0,
          scaleY: 1,
          rotateX: 0,
          z: 0,
          duration: 0.78,
          ease: 'expo.out',
          stagger: { each: 0.014, from: 'end' },
          transformOrigin: '50% 0%',
        });
        gsap.to(hoverChars, {
          yPercent: 26,
          scaleY: 0.08,
          rotateX: -82,
          z: -40,
          duration: 0.78,
          ease: 'expo.out',
          stagger: { each: 0.014, from: 'end' },
          transformOrigin: '50% 100%',
        });
      }

      link.addEventListener('mouseenter', onEnter);
      link.addEventListener('mouseleave', onLeave);
      link.addEventListener('focus', onEnter);
      link.addEventListener('blur', onLeave);

      cleanups.push(() => {
        link.removeEventListener('mouseenter', onEnter);
        link.removeEventListener('mouseleave', onLeave);
        link.removeEventListener('focus', onEnter);
        link.removeEventListener('blur', onLeave);
        gsap.killTweensOf([baseChars, hoverChars]);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
