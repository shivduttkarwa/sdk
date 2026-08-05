import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// Reveal + live counter for the testimonials section.
//
// Deliberately scroll-TRIGGERED, not scroll-scrubbed, and with no pin: the page already
// carries three pinned/sticky stages, and every scroll-smoothness problem this project has
// hit came from JS driving layout against the scroller. Everything here is a one-shot
// timeline per quote plus an IntersectionObserver.
export function useTestimonials() {
  useEffect(() => {
    const section = document.getElementById('voices');
    if (!section) return;

    const created: Killable[] = [];
    const voices = [...section.querySelectorAll<HTMLElement>('[data-voice]')];

    voices.forEach((voice) => {
      const rule = voice.querySelector('.sdk-voice__rule');
      const index = voice.querySelector('.sdk-voice__index');
      const quote = voice.querySelector('.sdk-voice__quote');
      const by = voice.querySelector('.sdk-voice__by');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: voice,
          start: 'top 82%',
          toggleActions: 'restart none none reset',
        },
      });
      if (tl.scrollTrigger) created.push(tl.scrollTrigger);
      created.push(tl);

      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: 'power3.inOut' },
          0,
        );
      }
      if (index) {
        tl.fromTo(index, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.1);
      }
      if (quote) {
        // Wipe up from under a mask. The end state overshoots on every edge for the same
        // reason .sdk-intro__word does: the quote carries italic <em> runs whose glyphs
        // overhang the text box, and landing the clip on 0% shaves their tails off.
        tl.fromTo(
          quote,
          { clipPath: 'inset(0% 0% 100% 0%)', y: 18 },
          { clipPath: 'inset(-14% -6% -14% -2%)', y: 0, duration: 1.05, ease: 'power4.out' },
          0.12,
        );
      }
      if (by) {
        tl.fromTo(by, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.5);
      }
    });

    // Counter follows whichever quote is crossing the middle of the viewport. The tight
    // rootMargin means at most one entry is "intersecting" at a time.
    const counter = section.querySelector('[data-voices-counter]');
    let io: IntersectionObserver | undefined;
    if (counter && voices.length) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const i = voices.indexOf(entry.target as HTMLElement);
            if (i < 0) return;
            const next = String(i + 1).padStart(2, '0');
            if (counter.textContent === next) return;
            counter.textContent = next;
            gsap.fromTo(counter, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          });
        },
        { rootMargin: '-45% 0px -45% 0px' },
      );
      voices.forEach((v) => io!.observe(v));
    }

    return () => {
      created.forEach((t) => t.kill());
      io?.disconnect();
    };
  }, []);
}
