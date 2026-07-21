import { useEffect } from 'react';
import { mountShowcaseWater } from '@/cores/showcaseWater.core';

// Mounts the showcase-section fluid sim once and returns its disposer for cleanup.
export function useShowcaseWater() {
  // Run once on mount — mirrors the original single init IIFE.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => mountShowcaseWater(), []);
}
