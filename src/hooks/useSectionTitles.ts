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

      // Trigger on the TITLE, not the section. Keying off the section made the reveal fire
      // at a different point for every section and every breakpoint, because the title sits
      // a different distance below its section's top (measured: #work 148px desktop / 106px
      // mobile, #services 342px / 96px — the last of which fired at 103% of the viewport,
      // i.e. entirely off-screen on desktop, so that title simply never appeared to animate).
      // Anchoring to the title itself means every heading reveals at the same point in its
      // own travel up the screen, identically on mobile and desktop, whatever the section
      // wraps it in — sticky pin, tall runway, or nothing.
      //
      // toggleActions (was `once: true` — one play per page load, which read as "no
      // animation" from the second pass on): restart on every downward entry, re-arm only
      // when scrolled back ABOVE it (enterBack stays `none` so returning from below doesn't
      // replay mid-view).
      // NB: no `invalidateOnRefresh` here. These are gsap.from() tweens, so invalidate
      // re-reads each element's CURRENT value as the tween's destination — and refreshes
      // (runInitialRefresh fires on fonts-ready and window load) land while the chars are
      // parked at yPercent 110, which bakes 110 in as the target. The reveal then animates
      // 110 -> 110 and the titles stay masked out permanently.
      const titleEl = sec.querySelector('.sdk-stack__title');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleEl ?? sec,
          start: 'top 88%',
          toggleActions: 'restart none none reset',
        },
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
