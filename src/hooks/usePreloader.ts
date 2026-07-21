import { useLayoutEffect, type RefObject } from 'react';
import { mountPreloader } from '@/cores/preloader.core';

interface PreloaderRefs {
  canvasRef: RefObject<HTMLCanvasElement>;
  arcRef: RefObject<SVGCircleElement>;
  numRef: RefObject<HTMLDivElement>;
  rootRef: RefObject<HTMLDivElement>;
}

// useLayoutEffect so the rain/arc start before first paint, minimizing the gap vs the
// original (which ran at parse time).
export function usePreloader({ canvasRef, arcRef, numRef, rootRef }: PreloaderRefs) {
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const arc = arcRef.current;
    const num = numRef.current;
    const root = rootRef.current;
    if (!canvas || !arc || !num || !root) return;
    return mountPreloader({ canvas, arc, num, root });
    // Run once on mount — mirrors the original single init.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
