import { useEffect } from 'react';
import { mountHeroBlob } from '@/cores/heroBlob.core';

export function useHeroBlob() {
  // Run once on mount — mirrors the original single init. mountHeroBlob returns its disposer.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => mountHeroBlob(), []);
}
