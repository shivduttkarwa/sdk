import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// ─────────────────────────────────────────────────────────────────────────────
// Hero title reveal — TUNING KNOBS (all times in seconds)
// The title DECODES in: each letter flickers through random katakana / code glyphs
// (echoing the preloader's matrix rain) and locks into place with a blur→sharp resolve,
// cascading across the line. The description below slides up as one line.
// Tweak these to taste; nothing else needs to change.
// ─────────────────────────────────────────────────────────────────────────────
const HERO_REVEAL = {
  startDelay: 0.0, // pause after the loader clears before anything moves

  lineGap: 0.3, // delay BETWEEN the two name lines
  charStagger: 0.045, // delay between characters within a line — the decode cascade
  scrambleDuration: 0.7, // how long each character scrambles before locking to its letter
  scrambleRate: 0.55, // 0–1 chance to swap glyph each frame (higher = faster flicker)
  startBlur: 8, // px blur each character resolves from

  descGap: 0.5, // delay after the last name line before the description starts
  descDuration: 0.9,
  descEase: 'power3.out',

  cueDelay: 0.6, // scroll cue + CTA, measured from the reveal start
  cueDuration: 0.8,
  cueEase: 'power2.out',

  maskOffset: 110, // how far below its mask the description starts (yPercent)
};

// Glyph pool for the scramble — katakana + code symbols, matching the preloader rain.
const GLYPHS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフ01<>{}[]/=+*#'.split('');
const randGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

export function useHeroAnimation() {
  useEffect(() => {
    const tweens: Killable[] = [];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const k = HERO_REVEAL;

    const primaryInners = gsap.utils.toArray<HTMLElement>(
      '.sdk-hero__name--primary .sdk-hero__line-inner',
    );
    const revealedName = document.querySelector<HTMLElement>('.sdk-hero__name--revealed');
    const nameLineCount = Math.max(0, primaryInners.length - 1);
    const descInner = primaryInners[nameLineCount];

    // Split the primary name lines into per-character cells.
    const lines: HTMLElement[][] = [];
    for (let i = 0; i < nameLineCount; i++) {
      const inner = primaryInners[i];
      const text = (inner.textContent ?? '').trim();
      inner.innerHTML = text
        .split('')
        .map(
          (ch) => `<span class="sdk-hero__char-wrap"><span class="sdk-hero__char">${ch}</span></span>`,
        )
        .join('');
      const chars = gsap.utils.toArray<HTMLElement>(inner.querySelectorAll('.sdk-hero__char'));
      chars.forEach((c) => {
        c.dataset.final = c.textContent ?? '';
      });
      lines.push(chars);
    }
    const allChars = lines.flat();

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

      // Width-lock each cell to its final glyph now that fonts are ready — keeps the
      // variable-width scramble glyphs from reflowing the title.
      allChars.forEach((c) => {
        const wrap = c.parentElement as HTMLElement;
        wrap.style.width = `${Math.ceil(c.getBoundingClientRect().width)}px`;
      });

      const tl = gsap.timeline();

      lines.forEach((chars, li) => {
        chars.forEach((el, ci) => {
          const at = k.startDelay + li * k.lineGap + ci * k.charStagger;
          const final = el.dataset.final ?? el.textContent ?? '';
          const proxy = { p: 0 };
          // Scramble: flicker random glyphs, then lock to the final letter.
          tl.to(
            proxy,
            {
              p: 1,
              duration: k.scrambleDuration,
              ease: 'none',
              onStart: () => {
                el.style.opacity = '1';
              },
              onUpdate: () => {
                if (Math.random() < k.scrambleRate) el.textContent = randGlyph();
              },
              onComplete: () => {
                el.textContent = final;
              },
            },
            at,
          );
          // Resolve blur → sharp in parallel.
          tl.to(el, { filter: 'blur(0px)', duration: k.scrambleDuration, ease: 'power2.out' }, at);
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
