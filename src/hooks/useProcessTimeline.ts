import { useEffect } from 'react';
import { mountProcessTimeline } from '@/cores/processTimeline.core';

// B18c process/timeline. Runs once on mount, mirroring the original single init.
export function useProcessTimeline() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => mountProcessTimeline(), []);
}
