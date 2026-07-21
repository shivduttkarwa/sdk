import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsapSetup';

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

// eslint-disable-next-line react-refresh/only-export-components
export function useLenis(): LenisContextValue {
  return useContext(LenisContext);
}

/**
 * Faithful port of the original Lenis init (script.js B10). The original was gated on
 * `window.Lenis` (always present now) AND `prefers-reduced-motion`; under reduced motion the
 * whole block is skipped, leaving native scroll and non-smooth anchor jumps. Everything is
 * created once and torn down on unmount — the original never cleaned up, but React needs it.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // matchMedia gate evaluated once at init, matching the original (never re-bound on resize).
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    window.lenis = instance;

    instance.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      instance.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
    };
    document.addEventListener('click', onClick);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.off('scroll', ScrollTrigger.update);
      document.removeEventListener('click', onClick);
      instance.destroy();
      if (window.lenis === instance) window.lenis = undefined;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>;
}
