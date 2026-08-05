// Centralized GSAP + ScrollTrigger registration. Every hook imports gsap/ScrollTrigger
// from here so the plugin is registered exactly once (registerPlugin is idempotent).
// The original loaded gsap + ScrollTrigger via CDN globals; these npm builds are the
// same 3.12.5 code.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browser chrome (URL bar) collapsing on the first downward flick fires a window
// resize, and ScrollTrigger's default handler answers with a full refresh() — recalcing
// every trigger on the page mid-momentum, which reads as a hitch right as the showcase
// pin approaches. This flag makes ScrollTrigger ignore touch-device height-only resizes;
// real reflows (orientation, keyboard) still refresh via the visualViewport listener in
// useShowcasePin, which gates on exactly those.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
