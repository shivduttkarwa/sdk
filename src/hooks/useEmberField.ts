import { useEffect, type RefObject } from 'react';
import { mountEmberField } from '@/cores/emberField.core';

// Rising-spark canvas backdrop (contact hero). Skipped entirely under reduced motion —
// the page's static glow layers carry the mood instead.
export function useEmberField(canvasRef: RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    return mountEmberField(canvas);
  }, [canvasRef]);
}
