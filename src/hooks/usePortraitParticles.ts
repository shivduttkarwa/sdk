import { useLayoutEffect, useState, type RefObject } from 'react';
import { mountPortraitParticles } from '@/cores/portraitParticles.core';

/**
 * Mounts the /about portrait point cloud and reports whether the fallback <img> is needed.
 *
 * Takes two elements: the fixed full-viewport `canvas` the cloud draws on, and the
 * `anchor` the assembled hero portrait is positioned and sized against. They are separate
 * because the cloud travels the length of the page while the portrait still has to line up
 * with a specific box in the hero.
 *
 * useLayoutEffect, not useEffect, and that matters: the core settles capability
 * synchronously, so the state flip lands before the browser paints. With useEffect there
 * is a painted frame in between, which is exactly the flash this avoids — the photograph
 * appearing, disappearing, and only then assembling from particles.
 *
 * Returns true only when the cloud cannot run (no WebGL, reduced motion, or a failure
 * during setup), which is when the plain photograph should be shown instead.
 */
export function usePortraitParticles(
  canvasRef: RefObject<HTMLCanvasElement>,
  anchorRef: RefObject<HTMLElement>,
  src: string,
) {
  const [needsFallback, setNeedsFallback] = useState(false);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    if (!canvas || !anchor) return;
    return mountPortraitParticles({
      canvas,
      anchor,
      src,
      onCapable: (capable) => setNeedsFallback(!capable),
    });
  }, [canvasRef, anchorRef, src]);

  return needsFallback;
}
