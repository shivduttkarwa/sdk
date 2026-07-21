import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

// B15 initTiHeading: the "Why I Build" heading text lives in JS. Split into `.sdk-intro__char`
// spans and reveal on scroll. Verbatim (including the original `toggleAction` typo, which GSAP
// ignores). The hook owns the (initially empty) `.sdk-intro__char-wrap` node.
export function useIntroHeading() {
  useEffect(() => {
    const wrap = document.querySelector('.sdk-intro__char-wrap');
    if (!wrap) return;

    const text = 'Why I Build';
    wrap.innerHTML = text
      .split('')
      .map((ch) =>
        ch === ' '
          ? '<span class="sdk-intro__char" style="display:inline-block;width:0.28em;"></span>'
          : `<span class="sdk-intro__char">${ch}</span>`,
      )
      .join('');

    const chars = wrap.querySelectorAll('.sdk-intro__char');

    const tween = gsap.from(chars, {
      yPercent: 110,
      stagger: 0.04,
      ease: 'power4.out',
      duration: 1,
      scrollTrigger: {
        trigger: '.sdk-intro__header',
        start: 'top 82%',
        // Original had a `toggleAction` typo, which GSAP ignored → fell back to the default
        // toggleActions 'play none none none'. Written explicitly here = byte-identical behavior.
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      wrap.innerHTML = '';
    };
  }, []);
}
