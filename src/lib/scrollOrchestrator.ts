import { ScrollTrigger } from './gsapSetup';

// The original relied on parse-order + a tech-pin retry-boot loop + GSAP's built-in
// load/resize auto-refresh to measure ScrollTriggers against the final layout. In React
// everything mounts after DOMContentLoaded, so we coordinate a single deterministic refresh
// once fonts are ready and layout has settled, plus one more on full window `load` to catch
// late images. Individual hooks (e.g. tech-pin) still refresh on their own image loads,
// exactly as the original did.
export function runInitialRefresh(): () => void {
  const refresh = () => ScrollTrigger.refresh();

  let raf1 = 0;
  let raf2 = 0;
  const fontsReady =
    (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ??
    Promise.resolve();

  fontsReady.then(() => {
    // Two rAFs so layout (fonts applied) has fully settled before measuring.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(refresh);
    });
  });

  const onLoad = () => refresh();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', onLoad, { once: true });
  }

  return () => {
    if (raf1) cancelAnimationFrame(raf1);
    if (raf2) cancelAnimationFrame(raf2);
    window.removeEventListener('load', onLoad);
  };
}
