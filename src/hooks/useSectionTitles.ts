import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// B18a initSectionTitleAnims: for each `.sdk-stack-section`, split `[data-split]` elements into
// `.sdk-split-char` spans and reveal title chars + eyebrow + subtitle on scroll. Verbatim; the
// hooks own the (statically-texted) split nodes. Created timelines/triggers killed on unmount.
export function useSectionTitles() {
  useEffect(() => {
    const created: Killable[] = [];

    document.querySelectorAll('.sdk-stack-section').forEach((sec) => {
      sec.querySelectorAll('[data-split]').forEach((el) => {
        const text = (el.textContent ?? '').trim();
        el.innerHTML = text
          .split('')
          .map((ch) =>
            ch === ' '
              ? '<span style="display:inline-block;width:0.18em"></span>'
              : `<span class="sdk-char-wrap"><span class="sdk-split-char">${ch}</span></span>`,
          )
          .join('');
      });

      const chars = [...sec.querySelectorAll('.sdk-stack__title .sdk-split-char')];
      const eyebrow = sec.querySelector('.sdk-eyebrow');
      const subtitle = sec.querySelector('.sdk-stack__subtitle');

      // Was `once: true` — one play per page load. Next to the scrub/pin-driven neighbours
      // (intro heading, tech pin, work stories) that replay on every approach, a one-shot
      // title reads as having no animation at all from the second pass on. restart/reset:
      // play on every downward entry, re-arm only when scrolled back ABOVE the section
      // (enterBack stays `none` so returning from below doesn't replay mid-view).
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top 65%', toggleActions: 'restart none none reset' },
      });
      if (tl.scrollTrigger) created.push(tl.scrollTrigger);
      created.push(tl);

      if (eyebrow) tl.from(eyebrow, { y: 18, opacity: 0, duration: 0.6, ease: 'power3.out' });

      if (chars.length) {
        tl.from(chars, { yPercent: 110, duration: 1, stagger: 0.04, ease: 'power4.out' }, '-=0.2');
      }

      if (subtitle) {
        tl.from(subtitle, { y: 22, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55');
      }
    });

    return () => created.forEach((t) => t.kill());
  }, []);
}
