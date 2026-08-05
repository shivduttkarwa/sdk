import { useEffect } from 'react';
import { mountTechWater } from '@/cores/techWater.core';

// Mounts the Tech Stack portrait's fluid reveal once and returns its disposer.
export function useTechWater() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => mountTechWater(), []);
}
