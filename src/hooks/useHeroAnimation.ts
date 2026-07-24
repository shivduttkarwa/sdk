import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// ─────────────────────────────────────────────────────────────────────────────
// Hero title reveal — TUNING KNOBS (all times in seconds)
// The title RESOLVES in: each letter simply fades up and sharpens from a soft blur,
// cascading letter-by-letter across the line — calm and elegant, no glyph scramble.
// The description below slides up as one line.
// Tweak these to taste; nothing else needs to change.
// ─────────────────────────────────────────────────────────────────────────────
const HERO_REVEAL = {
  startDelay: 0.0, // pause after the loader clears before anything moves

  lineGap: 0.3, // delay BETWEEN the two name lines
  charStagger: 0.055, // delay between characters within a line — the resolve cascade
  resolveDuration: 0.9, // how long each character takes to fade + un-blur into place
  resolveEase: 'power2.out', // easing of that fade/un-blur
  startBlur: 10, // px blur each character resolves from

  descGap: 0.5, // delay after the last name line before the description starts
  descDuration: 0.9,
  descEase: 'power3.out',

  cueDelay: 0.6, // scroll cue + CTA, measured from the reveal start
  cueDuration: 0.8,
  cueEase: 'power2.out',

  maskOffset: 110, // how far below its mask the description starts (yPercent)
};

export function useHeroAnimation() {
  useEffect(() => {
    const tweens: Killable[] = [];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const k = HERO_REVEAL;

    const primaryInners = gsap.utils.toArray<HTMLElement>(
      '.sdk-hero__name--primary .sdk-hero__line-inner',
    );
    const revealedInners = gsap.utils.toArray<HTMLElement>(
      '.sdk-hero__name--revealed .sdk-hero__line-inner',
    );
    const revealedName = document.querySelector<HTMLElement>('.sdk-hero__name--revealed');
    const nameLineCount = Math.max(0, primaryInners.length - 1);
    const descInner = primaryInners[nameLineCount];

    // Split a name line into per-character cells (same markup for both layers).
    const splitToCells = (inner: HTMLElement): HTMLElement[] => {
      const text = (inner.textContent ?? '').trim();
      inner.innerHTML = text
        .split('')
        .map(
          (ch) => `<span class="sdk-hero__char-wrap"><span class="sdk-hero__char">${ch}</span></span>`,
        )
        .join('');
      return gsap.utils.toArray<HTMLElement>(inner.querySelectorAll('.sdk-hero__char'));
    };

    // Split the primary (red) name lines — these carry the per-letter resolve cascade.
    const lines: HTMLElement[][] = [];
    for (let i = 0; i < nameLineCount; i++) {
      const chars = splitToCells(primaryInners[i]);
      chars.forEach((c) => {
        c.dataset.final = c.textContent ?? '';
      });
      lines.push(chars);
    }
    const allChars = lines.flat();

    // Mirror the split on the revealed (white) layer so its geometry is pixel-identical
    // to the primary. Otherwise the primary red is slightly wider and leaks out on the
    // left of each glyph as a ghost/shadow edge where the reveal circle uncovers it.
    const revealedLines: HTMLElement[][] = [];
    for (let i = 0; i < nameLineCount && i < revealedInners.length; i++) {
      revealedLines.push(splitToCells(revealedInners[i]));
    }

    // Showcase headline inners animate independently (below the fold) — unchanged.
    tweens.push(
      gsap.from('.sdk-showcase__headline .inner', {
        yPercent: 105,
        duration: 1.2,
        stagger: 0.14,
        ease: 'power4.out',
        delay: 0.3,
      }),
    );

    if (reduce) {
      allChars.forEach((c) => gsap.set(c, { opacity: 1, filter: 'none' }));
      if (descInner) gsap.set(descInner, { yPercent: 0 });
      if (revealedName) gsap.set(revealedName, { opacity: 1 });
      return () => tweens.forEach((t) => t.kill());
    }

    // Hidden until the reveal plays.
    gsap.set(allChars, { opacity: 0, filter: `blur(${k.startBlur}px)` });
    if (descInner) gsap.set(descInner, { yPercent: k.maskOffset });
    if (revealedName) gsap.set(revealedName, { opacity: 0 });

    let played = false;
    let fallback = 0;
    const play = () => {
      if (played) return;
      played = true;
      window.clearTimeout(fallback);
      window.removeEventListener('sdk:preloader-done', play);

      // Width-lock each cell to its glyph now that fonts are ready. This also gives the
      // revealed layer an exact width to copy (below) so the two layers align pixel-perfect.
      allChars.forEach((c) => {
        const wrap = c.parentElement as HTMLElement;
        wrap.style.width = `${Math.ceil(c.getBoundingClientRect().width)}px`;
      });

      // Copy those exact locked widths onto the revealed layer's matching cells so the
      // white text overlaps the red pixel-for-pixel — no leaking red ghost edge.
      revealedLines.forEach((chars, li) => {
        chars.forEach((c, ci) => {
          const src = lines[li]?.[ci];
          if (!src?.parentElement) return;
          (c.parentElement as HTMLElement).style.width = (src.parentElement as HTMLElement).style.width;
        });
      });

      const tl = gsap.timeline();

      lines.forEach((chars, li) => {
        chars.forEach((el, ci) => {
          const at = k.startDelay + li * k.lineGap + ci * k.charStagger;
          // Soft resolve: fade in and sharpen from blur in a staggered wave. No scramble.
          tl.to(
            el,
            { opacity: 1, filter: 'blur(0px)', duration: k.resolveDuration, ease: k.resolveEase },
            at,
          );
        });
      });

      const descStart = k.startDelay + Math.max(0, nameLineCount - 1) * k.lineGap + k.descGap;
      if (descInner) {
        tl.to(descInner, { yPercent: 0, duration: k.descDuration, ease: k.descEase }, descStart);
      }
      // Fade the smoke-revealed copy back in once the decode has resolved.
      if (revealedName) {
        tl.to(revealedName, { opacity: 1, duration: 0.6, ease: 'power2.out' }, descStart);
      }

      tl.from(
        '.sdk-scroll-cue, .sdk-hero__m-cta',
        { opacity: 0, y: 14, duration: k.cueDuration, stagger: 0.08, ease: k.cueEase },
        k.startDelay + k.cueDelay,
      );
      tweens.push(tl);
    };

    // First visit: wait for the preloader to lift; otherwise reveal shortly after mount.
    const preloader = document.getElementById('sdk-preloader');
    const preloaderActive = preloader && getComputedStyle(preloader).display !== 'none';
    if (preloaderActive) {
      window.addEventListener('sdk:preloader-done', play, { once: true });
      fallback = window.setTimeout(play, 9000);
    } else {
      fallback = window.setTimeout(play, 150);
    }

    return () => {
      window.removeEventListener('sdk:preloader-done', play);
      window.clearTimeout(fallback);
      tweens.forEach((t) => t.kill());
    };
  }, []);
}
