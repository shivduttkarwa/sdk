import { useEffect } from 'react';
import { mountSelectedWork } from '@/cores/selectedWork.core';

export function useSelectedWork() {
  // runs once, mirrors original single init
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => mountSelectedWork(), []);
}
