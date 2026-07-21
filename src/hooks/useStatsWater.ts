import { useEffect } from 'react';
import { mountStatsWater } from '@/cores/statsWater.core';

// Mounts the stats-row fluid sim once and returns its disposer for cleanup.
export function useStatsWater() {
  // Run once on mount — mirrors the original single init IIFE.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => mountStatsWater(), []);
}
