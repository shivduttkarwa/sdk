import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

// B16 initTextIntro: split `.sdk-intro__body` into per-word spans (preserving the inner
// <em class="sdk-intro__highlight">) and clip-reveal them on scrub. Font-gated and re-run-safe
// via dataset.orig — copied verbatim. The hook owns the node; async setup is guarded by a
// mounted flag, and the timeline is killed on unmount.
export function useIntroBody() {
  useEffect(() => {
    const textEl = document.querySelector('.sdk-intro__body') as HTMLElement | null;
    if (!textEl) return;

    let disposed = false;
    let animTl: gsap.core.Timeline | null = null;

    function splitIntoWords() {
      const el = textEl as HTMLElement;
      const nodes = Array.from(el.childNodes);
      let html = '';
      nodes.forEach((node) => {
        if (node.nodeType === 3) {
          (node.textContent ?? '').split(/(\s+)/).forEach((part) => {
            if (/^\s+$/.test(part)) {
              html += part;
            } else if (part) {
              html += `<span class="sdk-intro__word">${part}</span>`;
            }
          });
        } else if (node.nodeType === 1) {
          const cls = (node as HTMLElement).className;
          const parts = (node.textContent ?? '').split(/(\s+)/);
          const words = parts.filter((p) => p && !/^\s+$/.test(p));
          let wi = 0;
          parts.forEach((part) => {
            if (/^\s+$/.test(part)) {
              html += part;
            } else if (part) {
              const isLast = wi === words.length - 1;
              html += `<span class="sdk-intro__word${isLast ? ' ' + cls : ''}">${part}</span>`;
              wi++;
            }
          });
        }
      });
      el.innerHTML = html;
    }

    function setup() {
      if (disposed) return;
      const el = textEl as HTMLElement;
      if (animTl) {
        animTl.kill();
        animTl = null;
      }
      el.innerHTML = el.dataset.orig || el.innerHTML;
      if (!el.dataset.orig) el.dataset.orig = el.innerHTML;

      splitIntoWords();

      const words = el.querySelectorAll('.sdk-intro__word');

      animTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.sdk-intro',
          start: 'top 30%',
          end: 'top -20%',
          scrub: 1.2,
        },
      });

      const dur = 0.25;
      words.forEach((word, i) => {
        animTl!.fromTo(
          word,
          { clipPath: 'inset(-20% 105% -20% 0%)', opacity: 0.05, filter: 'blur(10px)', skewX: -4 },
          {
            clipPath: 'inset(-20% 0%   -20% 0%)',
            opacity: 1,
            filter: 'blur(0px)',
            skewX: 0,
            ease: 'power2.out',
            duration: dur,
          },
          i * dur,
        );
      });
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(setup);
    } else {
      setTimeout(setup, 400);
    }

    return () => {
      disposed = true;
      if (animTl) {
        animTl.scrollTrigger?.kill();
        animTl.kill();
      }
    };
  }, []);
}
