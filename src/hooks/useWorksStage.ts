import { useEffect, useState } from 'react';
import { mountWorksStage } from '@/cores/worksStage.core';

/**
 * Drives the /works WebGL stage and reports which project is frontmost.
 *
 * The core owns every per-frame write (CSS custom properties, canvas), so React is not in
 * the render loop at all — it re-renders only on the handful of frames where the active
 * project actually changes.
 */
export function useWorksStage(covers: string[]): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // setActive is a no-op when the value is unchanged, and the core only calls it on a
    // real change, so this cannot loop.
    const dispose = mountWorksStage({ covers, onActive: setActive });
    return dispose;
    // Covers come from the static projects module and never change identity in practice;
    // joining keeps the effect from re-mounting the whole GL context on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [covers.join('|')]);

  return active;
}
