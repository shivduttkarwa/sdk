import { useRef } from 'react';
import { usePreloader } from '@/hooks/usePreloader';

// DOM mirrored 1:1. The canvas matrix-rain + arc counter animation (original A2) runs via
// usePreloader, which owns the imperative core and its cleanup.
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLDivElement>(null);

  usePreloader({ canvasRef, arcRef, numRef, rootRef });

  return (
    <div className="sdk-preloader" id="sdk-preloader" aria-hidden="true" ref={rootRef}>
      <canvas className="sdk-preloader__canvas" id="plCanvas" ref={canvasRef}></canvas>
      <svg className="sdk-preloader__ring" viewBox="0 0 200 200" aria-hidden="true">
        <circle className="sdk-preloader__arc" cx="100" cy="100" r="88" id="plArc" ref={arcRef} />
      </svg>
      <div className="sdk-preloader__counter" id="plNum" ref={numRef}>
        0
      </div>
      <span className="sdk-preloader__brand">Shivdutt Karwa</span>
    </div>
  );
}
