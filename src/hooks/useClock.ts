import { useEffect } from 'react';

// B7: live IST (Asia/Kolkata) clock in the showcase.
export function useClock() {
  useEffect(() => {
    const elH = document.getElementById('scH');
    const elM = document.getElementById('scM');
    const elS = document.getElementById('scS');
    if (!elH || !elM || !elS) return;

    const pad = (n: number) => String(n).padStart(2, '0');

    function tick() {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      elH!.textContent = pad(now.getHours());
      elM!.textContent = pad(now.getMinutes());
      elS!.textContent = pad(now.getSeconds());
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
}
