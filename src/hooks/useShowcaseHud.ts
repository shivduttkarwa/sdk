import { useEffect } from 'react';

// B6: live X/Y mouse readout in the showcase HUD.
export function useShowcaseHud() {
  useEffect(() => {
    const elX = document.getElementById('hudX');
    const elY = document.getElementById('hudY');
    if (!elX || !elY) return;

    const pad = (n: number) => String(Math.max(0, n)).padStart(3, '0');

    const onMove = (e: MouseEvent) => {
      elX.textContent = pad(Math.round(e.clientX));
      elY.textContent = pad(Math.round(e.clientY));
    };

    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);
}
