// Centralized GSAP + ScrollTrigger registration. Every hook imports gsap/ScrollTrigger
// from here so the plugin is registered exactly once (registerPlugin is idempotent).
// The original loaded gsap + ScrollTrigger via CDN globals; these npm builds are the
// same 3.12.5 code.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
