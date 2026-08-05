import { mountFluidReveal } from './fluidReveal.core';

// The Tech Stack instance of the fluid reveal — same solver as the stats row, pointed at
// the portrait column.
//
// Unlike the stats row (which paints hidden artwork INTO the wake) this one draws no image
// at all: the canvas is a dark veil laid over the existing <img>, and the wake erases it.
// The photo revealed is therefore the real portrait element, at its own framing — nothing
// is duplicated, there is no second copy to misalign, and no 2 MB texture upload.
//
// The .is-fluid class (added only once the sim is actually running) brightens the <img>
// from its dimmed resting values, because the veil now supplies that dimming instead. If
// WebGL is unavailable — or on mobile, where fluidReveal bails — the class is never added
// and the portrait keeps its original CSS exactly.

const RENDER_FS = `precision highp float;
    uniform sampler2D u_dye;
    uniform vec3 u_veil;
    uniform float u_veilAlpha;
    varying vec2 v_uv;
    void main(){
      float dye = clamp(texture2D(u_dye, v_uv).r, 0., 1.);
      float wake = smoothstep(0.018, 0.22, dye);
      // Opaque veil everywhere, erased where the wake has passed.
      gl_FragColor = vec4(u_veil, u_veilAlpha * (1. - wake));
    }`;

/** Veil colour — the page background, so the column reads unchanged at rest. */
const VEIL = [5 / 255, 3 / 255, 10 / 255];
/** How much of the portrait the veil hides before any pointer movement. */
const VEIL_ALPHA = 0.74;

export function mountTechWater(): () => void {
  const portrait = document.querySelector('.sdk-tech-pin__portrait');
  const sticky = document.querySelector('.sdk-tech-pin__sticky');
  if (!portrait) return () => {};

  const dispose = mountFluidReveal({
    host: portrait,
    canvasClass: 'sdk-tech-pin__canvas',
    images: [],
    renderFS: RENDER_FS,
    // Portrait column is roughly 3:4, so the grid is taller than the stats row's 256x96.
    // 128x192 keeps the per-frame cost (25 pressure iterations over 24,576 cells) identical.
    sim: { w: 128, h: 192 },
    // The column itself is pointer-events: none and only covers the left of the stage;
    // listening on the sticky lets the wake track the cursor across the whole section.
    pointerEl: sticky,
    splatRadius: 0.0035,
    setRenderUniforms: (prog, h) => {
      h.u3f(prog, 'u_veil', VEIL[0], VEIL[1], VEIL[2]);
      h.u1f(prog, 'u_veilAlpha', VEIL_ALPHA);
    },
  });

  // fluidReveal prepends synchronously, so a canvas here means the sim really started.
  const mounted = !!portrait.querySelector('.sdk-tech-pin__canvas');
  if (mounted) portrait.classList.add('is-fluid');

  return () => {
    dispose();
    portrait.classList.remove('is-fluid');
  };
}
