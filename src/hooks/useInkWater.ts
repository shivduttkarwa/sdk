import { useEffect, type RefObject } from 'react';
import { mountInkWater } from '@/cores/inkWater.core';

export function useInkWater(canvasRef: RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return mountInkWater({ canvas });
  }, [canvasRef]);
}
