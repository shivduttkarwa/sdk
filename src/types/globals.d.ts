import type Lenis from 'lenis';

declare global {
  interface Window {
    /** The single Lenis smooth-scroll instance (parity with the original `window.lenis`). */
    lenis?: Lenis;
    /** One-time init guard for the tech-stack pin (parity with the original global). */
    __sdkTechPinInitialized?: boolean;
  }
}

export {};
