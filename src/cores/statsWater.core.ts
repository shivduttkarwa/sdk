import { mountFluidReveal } from './fluidReveal.core';

// The stats-row instance of the fluid reveal. The solver lives in fluidReveal.core (a
// verbatim extraction of the original `initStatsWater` IIFE, script.js 389–754); this file
// is only the original's configuration — same three reveal images, same 256x96 sim grid,
// same composite shader splitting them across horizontal thirds, one per stat column.
//
// Desktop only; the mobile gate lives in fluidReveal.core. Below 900px the stats section
// uses the ledger layout instead (see the ≤900px CSS + useStatsCounters' mobile fork).

const RENDER_FS = `precision highp float;
    uniform sampler2D u_dye, u_bg0, u_bg1, u_bg2;
    varying vec2 v_uv;
    void main(){
      float dye = clamp(texture2D(u_dye, v_uv).r, 0., 1.);
      float seg = 1./3.;
      vec3 c0 = texture2D(u_bg0, vec2(v_uv.x/seg,             v_uv.y)).rgb;
      vec3 c1 = texture2D(u_bg1, vec2((v_uv.x-seg)/seg,       v_uv.y)).rgb;
      vec3 c2 = texture2D(u_bg2, vec2((v_uv.x-2.*seg)/seg,    v_uv.y)).rgb;
      vec3 bg = mix(mix(c0,c1,step(seg,v_uv.x)),c2,step(2.*seg,v_uv.x)) * 0.88;
      gl_FragColor = vec4(bg, smoothstep(0.018, 0.22, dye));
    }`;

export function mountStatsWater(): () => void {
  const row = document.querySelector('.sdk-stats__row');
  if (!row) return () => {};

  return mountFluidReveal({
    host: row,
    canvasClass: 'sdk-stats__canvas',
    images: ['assets/stats-1.webp', 'assets/stats-2.webp', 'assets/stats-3.webp'],
    renderFS: RENDER_FS,
    sim: { w: 256, h: 96 },
  });
}
