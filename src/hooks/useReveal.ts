import { useEffect } from 'react';

// B5: add `is-visible` to `.sdk-reveal` elements as they scroll in; self-unobserve.
// (The original also has a GSAP `.sdk-reveal` fade in B11 — both are preserved, per the port.)
export function useReveal() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll('.sdk-reveal').forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);
}
