import { useEffect } from 'react';

// B2: hide the floating hero CTA while the hero is on screen; show it once scrolled past.
export function useHeroCtaVisibility() {
  useEffect(() => {
    const hero = document.getElementById('home');
    const heroCta = document.querySelector('.sdk-hero__cta');
    if (!hero || !heroCta) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroCta.classList.toggle('is-hidden', !entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
}
