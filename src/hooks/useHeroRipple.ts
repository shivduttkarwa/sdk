import { useEffect, useRef, type RefObject } from 'react';
import { mountHeroRipple } from '@/cores/heroRipple.core';

/**
 * Runs the /contact hero backdrop as water.
 *
 * Nothing is reported back to React: the CSS backdrop paints underneath and the canvas
 * simply covers it when it comes up, so the failure path needs no state — without WebGL or
 * under reduced motion the hero is exactly the static one every other page has.
 */
export function useHeroRipple(canvasRef: RefObject<HTMLCanvasElement>, src: string) {
  const seen = useRef(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    seen.current = true;
    return mountHeroRipple({ canvas, src });
  }, [canvasRef, src]);
}
