import { useLayoutEffect, useState, type RefObject } from 'react';
import { mountPortraitParticles } from '@/cores/portraitParticles.core';

/**
 * Mounts the /about portrait point cloud and reports whether the fallback <img> is needed.
 *
 * useLayoutEffect, not useEffect, and that matters: the core settles capability
 * synchronously, so the state flip lands before the browser paints. With useEffect there
 * is a painted frame in between, which is exactly the flash this is here to avoid — the
 * photograph appearing, disappearing, and only then assembling from particles.
 *
 * Returns true only when the cloud cannot run (no WebGL, reduced motion, or a failure
 * during setup), which is when the plain photograph should be shown instead.
 */
export function usePortraitParticles(canvasRef: RefObject<HTMLCanvasElement>, src: string) {
  const [needsFallback, setNeedsFallback] = useState(false);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return mountPortraitParticles({
      canvas,
      src,
      onCapable: (capable) => setNeedsFallback(!capable),
    });
  }, [canvasRef, src]);

  return needsFallback;
}
