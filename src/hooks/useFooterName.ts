import { useEffect } from 'react';

// B18d initFooterName: fit the giant `#cfName` signature to the viewport width by measuring
// its natural width at 10px then scaling. Verbatim; resize listener removed on unmount.
export function useFooterName() {
  useEffect(() => {
    const el = document.getElementById('cfName');
    if (!el) return;
    const node = el;

    function fit() {
      node.style.fontSize = '10px';
      node.style.width = 'max-content';
      const textW = node.offsetWidth;
      node.style.width = '';
      const vw = document.documentElement.clientWidth;
      node.style.fontSize = Math.floor(((10 * vw) / textW) * 0.84) + 'px';
    }

    fit();
    window.addEventListener('resize', fit, { passive: true });
    return () => window.removeEventListener('resize', fit);
  }, []);
}
