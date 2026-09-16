// Home — crimson ink in black water. One body of ink drifts down the page and takes a
// different form beside each section, loosening into a cloud between them. A slice of the
// points render as code glyphs off a texture atlas, so the ink is written in code.

export interface InkWaterOptions {
  canvas: HTMLCanvasElement;
}

const SITES = 9;
const PLUMES = 3;
const FILAMENTS = 30;
const COUNT = { desktop: 58000, mobile: 21000 };
const INTRO_MS = 2600;
const TAU_MS = { place: 150, stir: 220, pointer: 70 };
const GLYPH = { mix: 0.055, px: 9, atlas: 512, cols: 8 };

// 64 cells; the most code-shaped tokens repeat at the tail so they come up more often.
const GLYPHS = [
  '{', '}', '(', ')', '[', ']', '<', '>',
  ';', ':', '=', '+', '-', '*', '/', '\\',
  '&', '|', '!', '?', '#', '$', '%', '@',
  '~', '^', '.', ',', '_', '0', '1', '`',
  '=>', '//', '&&', '||', '!=', '==', '<>', '{}',
  '[]', '()', '::', '++', '--', '->', '?.', '??',
  '**', '/*', '*/', '>_', '</', '/>', ';;', '{',
  '}', ';', '=>', '<', '>', '/', '0', '1',
];

const VERT = `
  attribute vec4 a_seed;
  attribute vec4 a_seed2;
  attribute vec4 a_seed3;

  uniform vec2 u_view;
  uniform vec3 u_site[${SITES}];
  uniform float u_place;
  uniform float u_flow;
  uniform float u_time;
  uniform float u_stir;
  uniform float u_intro;
  uniform vec2 u_pointer;
  uniform float u_size;
  uniform float u_alpha;
  uniform float u_glyphMix;
  uniform float u_glyphPx;

  varying vec4 v_color;
  varying vec2 v_cell;
  varying float v_glyph;

  const float TAU = 6.28318530718;
  const float PI = 3.14159265359;

  float gT;
  float gFlow;
  float gU;
  float gRole;
  float gPlume;
  float gFid;
  float gG;

  float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

  vec3 siteAt(float id) {
    for (int i = 0; i < ${SITES}; i++) {
      if (float(i) == id) return u_site[i];
    }
    return u_site[${SITES - 1}];
  }

  vec3 rotX(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(v.x, c * v.y - s * v.z, s * v.y + c * v.z);
  }

  vec3 rotY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * v.x + s * v.z, v.y, c * v.z - s * v.x);
  }

  vec2 lens(vec3 v) { return v.xy / (1.0 + v.z * 0.3); }

  vec2 warp(vec2 p, float amt) {
    return p + vec2(sin(p.y * 4.3 + gT * 0.31 + sin(p.x * 2.3 - gT * 0.17) * 1.4),
                    cos(p.x * 3.9 - gT * 0.27 + sin(p.y * 2.7 + gT * 0.21) * 1.4)) * amt;
  }

  /* Ink is never even: beads travel along each thread, and a few threads carry most of it. */
  float weight(float x) {
    float clump = 0.3 + 1.2 * pow(0.5 + 0.5 * sin(x + hash(gFid * 6.37) * TAU), 3.0);
    return clump * (0.35 + 1.25 * pow(hash(gFid * 13.1), 2.0));
  }

  vec4 dress(vec2 c, vec2 fo, float a0, float spread) {
    if (gRole < 0.82) return vec4(c + fo, a0 * 1.5, 1.15 + 1.1 * a_seed2.w);
    float ang = a_seed2.y * TAU;
    vec2 j = vec2(cos(ang), sin(ang)) * a_seed.z * a_seed3.x;
    if (gRole < 0.985) return vec4(c + j * spread, a0 * 0.2, 2.6 + 2.2 * a_seed2.w);
    vec2 dr = vec2(sin(gT * 0.6 + a_seed2.z * TAU), cos(gT * 0.5 + a_seed2.x * TAU)) * 0.03;
    return vec4(c + j * spread * 3.0 + dr, a0, 1.0 + 0.8 * a_seed2.w);
  }

  vec4 formBloom(out float cap) {
    float t = gT;
    float plume = gPlume;
    float fid = gFid;
    cap = 0.0;

    /* Curve shape is keyed to the filament and cloud shape to the plume — never to the
       point, or the form scatters into noise. */
    float ph1 = hash(fid * 2.71);
    float ph2 = hash(fid * 5.19);
    float ph3 = hash(fid * 8.63);

    float age = fract(hash(fid * 1.371 + 3.7) + u_flow * (0.75 + 0.5 * hash(plume * 5.13)));
    float reach = pow(age, 0.45);
    float life = smoothstep(0.0, 0.055, age) * (1.0 - smoothstep(0.42, 1.0, age));

    float u = gU;
    float role = gRole;
    /* Length is heavily skewed short: the many stubby filaments pile up into the body of
       the bloom, the few long ones escape as tendrils. */
    float lr = hash(fid * 4.07);
    float len = 0.09 + lr * lr * 1.02;

    float fan = 2.0 * hash(fid * 1.93) - 1.0;
    float ang = hash(plume * 3.93) * TAU + sign(fan) * pow(abs(fan), 1.6) * 2.15
              + (step(0.5, a_seed3.y) * 2.0 - 1.0) * smoothstep(0.30, 0.95, u) * (0.16 + hash(fid * 3.31) * 0.24)
              + (step(0.5, a_seed3.z) * 2.0 - 1.0) * smoothstep(0.62, 1.0, u) * 0.15;
    vec2 d = vec2(cos(ang), sin(ang));
    vec2 n = vec2(-d.y, d.x);
    float meander = sin(u * 3.7 + ph1 * TAU + t * 0.21) * 0.24
                  + sin(u * 8.3 + ph2 * TAU + t * 0.33) * 0.10
                  + sin(u * 17.0 + ph3 * TAU + t * 0.47) * 0.035;

    vec2 p;
    float a;
    float size;

    if (role < 0.82) {
      float rad = (0.02 + len * pow(u, 0.85)) * reach;
      p = d * rad + n * meander * rad * 1.7;
      cap = smoothstep(0.66, 1.0, u);
      float roll = hash(fid * 7.77) * TAU + t * 0.42 + age * 3.0;
      p += (d * cos(roll) + n * sin(roll)) * cap * reach * len * (0.16 + hash(fid * 9.13) * 0.18);
      float th = (0.008 + 0.075 * pow(1.0 - u, 1.4)) * reach * (0.40 + len);
      p += n * gG * th + d * (a_seed3.x - 0.5) * th * 0.6;
      a = life * (0.5 + 0.5 * (1.0 - u)) * (1.0 + cap * 0.6) * 1.1
        * smoothstep(0.0, 0.095, rad) / (1.0 + 3.4 * rad * rad);
      size = 0.9 + 1.0 * a_seed2.w;
    } else if (role < 0.985) {
      float vr = (0.05 + 0.95 * pow(u, 0.6)) * reach * (0.30 + len);
      vec2 j = (vec2(a_seed.z, a_seed3.x) - 0.5) * 2.0;
      p = d * vr + n * meander * vr * 1.5 + j * (0.06 + 0.30 * pow(u, 0.8)) * reach * (0.3 + len);
      a = life * 0.16 / (1.0 + 1.6 * vr * vr);
      size = 2.6 + 2.2 * a_seed2.w;
    } else {
      float da = hash(fid * 4.41) * TAU + a_seed2.y * TAU;
      p = vec2(cos(da), sin(da)) * reach * (0.5 + a_seed2.x * 0.45)
        + vec2(sin(t * 0.6 + a_seed2.z * TAU), cos(t * 0.5 + a_seed2.x * TAU)) * 0.022;
      a = life * 0.7;
      size = 1.0 + 0.8 * a_seed2.w;
    }

    /* Differential rotation — the inside turns faster than the rim, so a tendril curls as
       it ages. Keyed to age, not to clock time, or the winding never stops and the whole
       bloom grinds into concentric rings. */
    float rr = length(p);
    float sw = (age * 1.3 + 0.10 * sin(t * 0.25 + hash(plume * 23.1) * TAU))
             / (0.28 + rr * 2.6) * (hash(plume * 19.3) > 0.5 ? 1.0 : -1.0);
    float cs = cos(sw), sn = sin(sw);
    p = vec2(p.x * cs - p.y * sn, p.x * sn + p.y * cs);

    float pa = hash(plume * 13.7) * TAU;
    p += vec2(cos(pa) * 0.12, sin(pa) * 0.09 + (plume - 1.0) * 0.18);
    p.y += age * 0.34 * (hash(fid * 11.41) - 0.15);
    p += vec2(sin(p.y * 3.1 + t * 0.21), cos(p.x * 2.7 + t * 0.17)) * 0.019;
    return vec4(p * vec2(0.80, 1.22), a, size);
  }

  vec4 formRing(out float cap) {
    float ph = hash(gFid * 2.71);
    float thread = floor(hash(gFid * 5.19) * 4.0);
    float phi = (gU + gFlow * 0.8) * TAU;
    float th = phi * 3.0 + gT * 0.9 + thread * TAU / 4.0 + (ph - 0.5) * 0.55;
    float R = 0.62 + 0.035 * sin(phi * 3.0 + gT * 0.7) + 0.02 * sin(phi * 5.0 - gT * 0.45);
    float r = (0.1 + 0.035 * sin(phi * 2.0 + gT * 0.4)) * (0.8 + 0.4 * hash(gFid * 8.63));
    vec3 v = vec3((R + r * cos(th)) * cos(phi), r * sin(th), (R + r * cos(th)) * sin(phi));
    v = rotX(v, 0.62 + 0.06 * sin(gT * 0.21));
    v = rotY(v, 0.22 * sin(gT * 0.13));
    float front = clamp(0.5 - v.z * 0.8, 0.0, 1.0);
    cap = smoothstep(0.55, 1.0, sin(th)) * front;
    vec2 fo = vec2(sin(phi * 7.0 + ph * TAU), cos(phi * 5.0 + ph * 9.0)) * 0.012 + vec2(gG * 0.01, 0.0);
    return dress(warp(lens(v), 0.025), fo, 0.55 * (0.4 + 0.8 * front) * weight(phi * 4.0), 0.14);
  }

  vec4 formPlume(out float cap) {
    float ph = hash(gFid * 2.71);
    float s = fract(gU + gFlow * 1.4 + ph * 0.1);
    float y = mix(0.9, -0.8, s);
    float lam = smoothstep(0.05, 0.4, s);
    float x = 0.02 * sin(gT * 0.4) + lam * 0.14 * sin(y * 5.0 + gT * 0.9 + sin(gT * 0.23) * 2.0);
    float spread = 0.006 + 0.22 * pow(s, 1.5);
    x += (hash(gFid * 9.13) - 0.5) * spread * 2.0 + sin(s * 11.0 + ph * TAU + gT * 0.4) * spread * 0.5;
    vec2 c = vec2(x, y);
    float eddy = smoothstep(0.25, 0.9, s);
    float ea = s * 14.0 + ph * TAU - gT * 1.1;
    c += vec2(cos(ea), sin(ea) * 0.8) * eddy * 0.13 * (0.4 + hash(gFid * 4.41));
    cap = eddy * 0.5;
    float a0 = 0.6 * smoothstep(0.0, 0.08, s) * (1.0 - smoothstep(0.7, 1.0, s)) * (0.45 + 0.8 * s) * weight(s * 36.0);
    return dress(warp(c, 0.015 + 0.06 * s * s), vec2(gG * 0.004, 0.0), a0, 0.05 + 0.12 * s);
  }

  vec4 formWhirl(out float cap) {
    float arm = mod(gFid, 3.0);
    float ph = hash(gFid * 2.71);
    float s = fract(gU + gFlow * 1.0 + ph * 0.29);
    float r = 0.04 + 0.92 * pow(1.0 - s, 0.8);
    float spread = (hash(gFid * 9.13) - 0.5) * (0.25 + 0.5 * r) + sin(s * 9.0 + ph * TAU) * 0.05;
    float ang = arm * TAU / 3.0 + spread - 2.6 * log(r) + gT * 0.16 + gG * 0.05;
    vec2 c = vec2(cos(ang), sin(ang)) * r;
    c.y = c.y * 0.58 + 0.16 * pow(1.0 - r, 4.0);
    cap = smoothstep(0.55, 0.95, s);
    float a0 = 0.55 * smoothstep(0.0, 0.14, s) * (1.0 - smoothstep(0.8, 1.0, s))
             * (0.3 + 0.7 * smoothstep(0.0, 0.35, r)) * weight(s * 26.0 + arm);
    return dress(warp(c, 0.022), vec2(0.0, gG * 0.006), a0, 0.12);
  }

  vec4 formKnot(out float cap) {
    float ph = hash(gFid * 2.71);
    float thread = floor(hash(gFid * 5.19) * 3.0);
    float s = (gU + gFlow * 0.45) * TAU;
    vec3 k = vec3(sin(s) + 2.0 * sin(2.0 * s), cos(s) - 2.0 * cos(2.0 * s), -sin(3.0 * s)) * 0.24;
    vec3 tg = normalize(vec3(cos(s) + 4.0 * cos(2.0 * s), -sin(s) + 4.0 * sin(2.0 * s), -3.0 * cos(3.0 * s)));
    vec3 nm = normalize(vec3(tg.y, -tg.x, 0.0));
    vec3 bn = cross(tg, nm);
    float tube = 0.055 * (0.75 + 0.5 * hash(gFid * 8.63));
    float ta = s * 4.0 + thread * TAU / 3.0 + (ph - 0.5) * 0.6 + gT * 0.5;
    vec3 v = k + (nm * cos(ta) + bn * sin(ta)) * tube;
    v = rotY(v, gT * 0.14);
    v = rotX(v, 0.45 + 0.2 * sin(gT * 0.09));
    float front = clamp(0.5 - v.z * 1.6, 0.0, 1.0);
    cap = smoothstep(0.6, 1.0, front) * 0.8;
    return dress(warp(lens(v), 0.02), vec2(gG * 0.006, 0.0), 0.55 * (0.35 + 0.85 * front) * weight(s * 5.0), 0.1);
  }

  vec4 formStreet(out float cap) {
    float ph = hash(gFid * 2.71);
    float L = 0.44;
    /* Parity comes from the vortex's own index, so the alternation survives the wrap. */
    float k = mod(gFid, 6.0);
    float slot = mod(k + gFlow * 2.2, 6.0);
    float yk = -1.2 + slot * L;
    float side = -cos(PI * k);
    float grow = 0.8 + 0.3 * slot / 6.0;
    float xk = side * 0.13 * grow;
    float lat = hash(gFid * 5.19) - 0.5;
    float s = fract(gU + gFlow * 1.5 + ph * 0.1);
    vec2 c;
    if (s < 0.4) {
      float q = s / 0.4;
      vec2 p0 = vec2(-side * 0.05 + lat * 0.06, yk - L * 0.95);
      vec2 p1 = vec2(side * 0.22 + lat * 0.05, yk - L * 0.45);
      vec2 p2 = vec2(xk + side * (0.15 + lat * 0.03) * grow, yk);
      c = mix(mix(p0, p1, q), mix(p1, p2, q), q);
    } else {
      float q = (s - 0.4) / 0.6;
      float rr = (0.15 + lat * 0.03) * grow * pow(1.0 - q, 1.3) + 0.008;
      float an = (side > 0.0 ? 0.0 : PI) + side * q * TAU * 1.7;
      c = vec2(xk + rr * cos(an), yk + rr * sin(an) * 0.92);
    }
    cap = smoothstep(0.75, 1.0, s) * 0.7;
    float a0 = 0.55 * smoothstep(0.0, 0.1, s) * (1.0 - smoothstep(0.92, 1.0, s)) * weight(s * 30.0)
             * smoothstep(-1.2, -0.85, yk) * (1.0 - smoothstep(0.95, 1.4, yk));
    return dress(warp(c, 0.02), vec2(gG * 0.006, 0.0), a0, 0.1);
  }

  vec4 formPair(out float cap) {
    float ph = hash(gFid * 2.71);
    float side = mod(gFid, 2.0) * 2.0 - 1.0;
    float arm = mod(floor(gFid / 2.0), 2.0);
    float orb = gT * 0.2;
    float big = side > 0.0 ? 1.0 : 0.62;
    vec2 ctr = vec2(cos(orb), sin(orb) * 0.7) * (side > 0.0 ? 0.2 : -0.32);
    float s = fract(gU + gFlow * 1.2 + ph * 0.2);
    float r = (0.02 + 0.66 * pow(1.0 - s, 1.2)) * big;
    float ang = orb + arm * PI + (side > 0.0 ? 0.0 : 2.3) - (side > 0.0 ? 2.2 : 3.0) * log(r / (0.68 * big))
              + (hash(gFid * 9.13) - 0.5) * (0.25 + 0.6 * r) + sin(s * 9.0 + ph * TAU) * 0.06;
    vec2 c = ctr + vec2(cos(ang), sin(ang) * 0.62) * r * (1.0 + 0.5 * smoothstep(0.3, 0.68, r));
    cap = smoothstep(0.6, 1.0, s);
    float a0 = 0.55 * smoothstep(0.0, 0.12, s) * (1.0 - smoothstep(0.85, 1.0, s))
             * (0.35 + 0.65 * smoothstep(0.0, 0.2, r)) * weight(s * 26.0 + arm);
    return dress(warp(c, 0.022), vec2(gG * 0.006, 0.0), a0, 0.1);
  }

  vec4 formWave(out float cap) {
    float ph = hash(gFid * 2.71);
    float lat = hash(gFid * 5.19) - 0.5;
    float s = fract(gU + gFlow * 1.1 + ph * 0.08);
    float ang = 0.9 - s * TAU * 1.15 + 0.12 * sin(gT * 0.25);
    float r = 0.06 + 0.9 * pow(1.0 - s, 0.9) + lat * 0.3 * (1.0 - s) * (1.0 - s)
            + sin(s * 13.0 + ph * TAU + gT * 0.5) * 0.012;
    vec2 dir = vec2(cos(ang), sin(ang));
    float spray = step(0.72, hash(gFid * 7.9)) * smoothstep(0.3, 0.65, s);
    vec2 c = vec2(-0.05, -0.1) + vec2(dir.x, dir.y * 0.85) * r + dir * spray * 0.3 * hash(gFid * 4.41);
    cap = smoothstep(0.35, 0.6, s) * 0.8;
    float a0 = 0.55 * smoothstep(0.0, 0.1, s) * (1.0 - smoothstep(0.85, 1.0, s))
             * (1.0 - 0.5 * spray) * weight(s * 30.0);
    return dress(warp(c, 0.022), vec2(gG * 0.006, 0.0), a0, 0.1);
  }

  vec4 formGlobe(out float cap) {
    float ph = hash(gFid * 2.71);
    float thread = floor(hash(gFid * 5.19) * 3.0);
    float s = fract(gU + gFlow * 0.5);
    float th = PI * (0.5 + 0.42 * sin(s * TAU * (3.0 + thread) + thread * 1.7 + gT * 0.05)) + (ph - 0.5) * 0.22;
    float lon = s * TAU * (3.0 - thread * 0.5) + thread * 2.1 + (hash(gFid * 8.63) - 0.5) * 0.3;
    float R = 0.5 * (1.0 + 0.03 * sin(gT * 0.9)) * (0.94 + 0.12 * hash(gFid * 4.41));
    vec3 v = vec3(sin(th) * cos(lon), cos(th), sin(th) * sin(lon)) * R;
    v = rotY(v, gT * 0.15);
    v = rotX(v, 0.5 + 0.15 * sin(gT * 0.11));
    float front = clamp(0.5 - v.z * 1.5, 0.0, 1.0);
    cap = smoothstep(0.65, 1.0, front) * 0.8;
    float a0 = 0.5 * (0.2 + 1.0 * front) * weight(s * 40.0);
    return dress(warp(lens(v), 0.018), vec2(0.0), a0, 0.1);
  }

  vec4 form(float k, out float cap) {
    if (k < 0.5) return formBloom(cap);
    if (k < 1.5) return formRing(cap);
    if (k < 2.5) return formPair(cap);
    if (k < 3.5) return formPlume(cap);
    if (k < 4.5) return formWhirl(cap);
    if (k < 5.5) return formKnot(cap);
    if (k < 6.5) return formStreet(cap);
    if (k < 7.5) return formWave(cap);
    return formGlobe(cap);
  }

  void main() {
    float t = u_time;
    gT = t;
    gFlow = u_flow;
    gU = a_seed.x;
    gRole = a_seed.w;
    gPlume = floor(a_seed3.w * ${PLUMES}.0);
    gFid = floor(a_seed.y * ${FILAMENTS}.0) + gPlume * ${FILAMENTS}.0;
    float g = (a_seed.z - 0.5) * 2.0;
    gG = g * g * g;

    float f = floor(u_place);
    float fb = min(f + 1.0, ${SITES - 1}.0);
    float tp = smoothstep(0.0, 1.0, clamp((u_place - f) * 1.5 - a_seed2.z * 0.5, 0.0, 1.0));
    vec3 ka = siteAt(f);
    vec3 kb = siteAt(fb);

    float capA = 0.0;
    float capB = 0.0;
    vec4 A = vec4(0.0);
    vec4 B = vec4(0.0);
    if (tp < 0.999) A = form(f, capA);
    if (tp > 0.001) B = form(fb, capB);

    float grow = mix(0.12, 1.0, u_intro);
    vec2 pa = ka.xy + A.xy * grow * ka.z;
    vec2 pb = kb.xy + B.xy * grow * kb.z;
    vec2 pv = mix(pa, pb, tp);
    float a = mix(A.z, B.z, tp);
    float size = mix(A.w, B.w, tp);
    float cap = mix(capA, capB, tp);

    /* Each point bows off the straight path by its own amount, so the ink sweeps across as a stream. */
    float loose = sin(PI * tp);
    pv += vec2(pa.y - pb.y, pb.x - pa.x) * loose * (a_seed2.x - 0.5) * 0.55;
    pv += vec2(sin(a_seed2.y * TAU + t * 0.7), cos(a_seed3.y * TAU + t * 0.6))
        * loose * a_seed.z * 0.06 * mix(ka.z, kb.z, tp);
    a *= 1.0 - 0.3 * loose;

    /* Pigment grain — an even alpha across the mass reads as clay, not ink. */
    a *= (0.6 + 0.55 * hash(a_seed.z * 977.0 + a_seed2.w)) * u_intro * u_alpha;

    pv.y -= u_stir * (58.0 + 96.0 * a_seed2.w);
    pv.x += sin(pv.y * 0.007 + t * 0.6 + a_seed2.w * TAU) * u_stir * 30.0;

    /* The pointer stirs the water rather than shoving it. */
    vec2 dd = pv - u_pointer;
    float r2 = dot(dd, dd);
    float w = exp(-r2 / 57800.0);
    float rl = sqrt(max(r2, 1.0));
    pv += (vec2(-dd.y, dd.x) / rl) * w * 64.0 + (dd / rl) * w * 15.0;
    a = min(a * (1.0 + w * 0.55), 1.0);

    if (a < 0.004) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      v_color = vec4(0.0);
      return;
    }

    /* Filament and droplet points can carry a glyph; the mist stays soft dots so the ink
       keeps a body to sit in. Held off the hot core, where big sprites would overlap into
       a slab, and off any point the ink itself is about to cull, or they read as litter. */
    float role = gRole;
    float u = gU;
    float isGlyph = step(fract(a_seed2.x * 71.3), u_glyphMix)
                  * clamp(step(role, 0.82) + step(0.985, role), 0.0, 1.0)
                  * step(0.25, u) * step(0.05, a) * step(loose, 0.35);
    float gi = floor(fract(a_seed3.z * 53.17) * ${GLYPH.cols * GLYPH.cols}.0);
    v_cell = vec2(mod(gi, ${GLYPH.cols}.0), floor(gi / ${GLYPH.cols}.0)) / ${GLYPH.cols}.0;
    v_glyph = isGlyph;
    a = min(mix(a, a * 1.35, isGlyph), 1.0);

    float dens = clamp(a * 2.6, 0.0, 1.0);
    vec3 water = vec3(0.15, 0.06, 0.30);
    vec3 deep = vec3(0.40, 0.03, 0.11);
    vec3 blood = vec3(0.80, 0.10, 0.19);
    vec3 rose = vec3(1.0, 0.44, 0.45);
    vec3 col = mix(water, deep, smoothstep(0.0, 0.26, dens));
    col = mix(col, blood, smoothstep(0.16, 0.62, dens));
    col = mix(col, rose, smoothstep(0.62, 1.0, dens) * (0.4 + 0.6 * cap));
    col = mix(col, vec3(1.0, 0.66, 0.58), isGlyph * 0.45);

    gl_Position = vec4(pv.x / u_view.x * 2.0 - 1.0, 1.0 - pv.y / u_view.y * 2.0, 0.0, 1.0);
    gl_PointSize = mix(u_size * size,
                       u_glyphPx * (0.55 + 0.75 * a_seed2.w) * (0.55 + 0.6 * clamp(a * 2.2, 0.0, 1.0)),
                       isGlyph);
    v_color = vec4(col * a, a);
  }
`;

const FRAG = `
  precision mediump float;
  uniform sampler2D u_atlas;
  varying vec4 v_color;
  varying vec2 v_cell;
  varying float v_glyph;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    /* Sampled unconditionally — a texture fetch inside a branch is undefined here. */
    vec2 uv = v_cell + clamp(gl_PointCoord, 0.02, 0.98) * ${1 / GLYPH.cols};
    float mask = mix(smoothstep(0.25, 0.015, dot(c, c)), texture2D(u_atlas, uv).a, v_glyph);
    if (mask < 0.012) discard;
    gl_FragColor = v_color * mask;
  }
`;

function drawAtlas(cv: HTMLCanvasElement) {
  const cell = GLYPH.atlas / GLYPH.cols;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, GLYPH.atlas, GLYPH.atlas);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  GLYPHS.forEach((ch, i) => {
    const size = ch.length > 1 ? cell * 0.5 : cell * 0.76;
    ctx.font = `600 ${size}px "Space Grotesk", ui-monospace, Menlo, Consolas, monospace`;
    ctx.fillText(
      ch,
      (i % GLYPH.cols) * cell + cell / 2,
      Math.floor(i / GLYPH.cols) * cell + cell / 2,
    );
  });
}

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a || 1));
  return t * t * (3 - 2 * t);
};

type Box = { left: number; top: number; width: number; height: number };

export function mountInkWater({ canvas }: InkWaterOptions) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  }) as WebGLRenderingContext | null;
  if (!gl) return () => {};

  const mobile = matchMedia('(max-width: 900px)').matches;
  const N = mobile ? COUNT.mobile : COUNT.desktop;

  let disposed = false;
  let raf = 0;
  let viewW = window.innerWidth;
  let viewH = window.innerHeight;
  let place = 0;
  let flow = 0;
  let stir = 0;
  let prevScroll = window.scrollY;
  let prevTime = 0;
  let introStart = 0;
  let pointer = { x: -9999, y: -9999 };
  const pointerTarget = { x: -9999, y: -9999 };
  const ease = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);

  const SECTIONS = [
    '#home',
    '#showcaseRunway',
    '#intro',
    '#stats',
    '#work',
    '#services',
    '#about',
    '#voices',
    '#contact',
  ];
  let tops: number[] = [];
  let boxes: Record<string, Box> = {};
  const sites = new Float32Array(SITES * 3);

  function box(sel: string): Box | null {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top + window.scrollY, width: r.width, height: r.height };
  }

  function measure() {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    const next: Record<string, Box> = {};
    for (const sel of [...SECTIONS, '.sdk-process__spine-col', '.sdk-contact__panel']) {
      const b = box(sel);
      if (b) next[sel] = b;
    }
    boxes = next;
    tops = SECTIONS.map((sel) => boxes[sel]?.top ?? Number.POSITIVE_INFINITY);
  }

  function placeFor(y: number) {
    let v = 0;
    for (let i = 1; i < SITES; i++) {
      v += smoothstep(tops[i] - viewH * 0.95, tops[i] - viewH * 0.25, y);
    }
    return v;
  }

  /** Viewport-space release point (x, y, radius px) per section, kept clear of the copy. */
  function placeSites(scroll: number) {
    const W = viewW;
    const H = viewH;
    const m = Math.min(W, H);
    const set = (i: number, x: number, y: number, s: number) => {
      sites[i * 3] = x;
      sites[i * 3 + 1] = y;
      sites[i * 3 + 2] = s;
    };
    const doc = (sel: string, fx: number, fy: number) => {
      const b = boxes[sel];
      return b
        ? { x: b.left + fx * b.width, y: b.top + fy * b.height - scroll }
        : { x: W / 2, y: H / 2 };
    };
    const hero = doc('#home', mobile ? 0.5 : 0.80, mobile ? 0.28 : 0.24);
    set(0, hero.x, hero.y, mobile ? m * 0.80 : H * 0.56);
    set(1, W / 2, H * 0.5, mobile ? m * 0.85 : H * 0.62);
    const intro = doc('#intro', mobile ? 0.5 : 0.8, mobile ? 0.78 : 0.72);
    set(2, intro.x, intro.y, mobile ? m * 0.72 : H * 0.5);
    const stats = doc('#stats', mobile ? 0.5 : 0.17, mobile ? 0.5 : 0.28);
    set(3, stats.x, stats.y, mobile ? m * 0.75 : H * 0.54);
    set(4, W * 0.5, H * 0.5, mobile ? m * 0.85 : H * 0.64);
    set(5, mobile ? W * 0.5 : W * 0.19, mobile ? H * 0.4 : H * 0.44, mobile ? m * 0.82 : H * 0.56);
    const spine = boxes['.sdk-process__spine-col'];
    set(6, spine ? spine.left + spine.width / 2 : W * 0.5, H * 0.5, mobile ? m * 0.8 : H * 0.6);
    const voices = doc('#voices', mobile ? 0.5 : 0.20, mobile ? 0.14 : 0.30);
    set(7, voices.x, voices.y, mobile ? m * 0.7 : H * 0.5);
    const panel = boxes['.sdk-contact__panel'];
    const contact = panel
      ? { x: panel.left + panel.width * 0.76, y: panel.top + panel.height * 0.6 - scroll }
      : doc('#contact', 0.5, 0.45);
    set(8, contact.x, contact.y, mobile ? m * 0.72 : H * 0.46);
  }

  const program = gl.createProgram()!;
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sh) ?? 'shader compile failed');
    }
    return sh;
  };
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed');
    }
  } catch (err) {
    console.warn('Ink unavailable.', err);
    return () => {};
  }
  gl.useProgram(program);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const u = {
    view: gl.getUniformLocation(program, 'u_view'),
    site: gl.getUniformLocation(program, 'u_site'),
    place: gl.getUniformLocation(program, 'u_place'),
    flow: gl.getUniformLocation(program, 'u_flow'),
    time: gl.getUniformLocation(program, 'u_time'),
    stir: gl.getUniformLocation(program, 'u_stir'),
    intro: gl.getUniformLocation(program, 'u_intro'),
    pointer: gl.getUniformLocation(program, 'u_pointer'),
    size: gl.getUniformLocation(program, 'u_size'),
    alpha: gl.getUniformLocation(program, 'u_alpha'),
    glyphMix: gl.getUniformLocation(program, 'u_glyphMix'),
    glyphPx: gl.getUniformLocation(program, 'u_glyphPx'),
    atlas: gl.getUniformLocation(program, 'u_atlas'),
  };

  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = GLYPH.atlas;
  atlasCanvas.height = GLYPH.atlas;
  const atlas = gl.createTexture();
  function uploadAtlas() {
    drawAtlas(atlasCanvas);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, atlas);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, atlasCanvas);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
  }
  uploadAtlas();
  gl.uniform1i(u.atlas, 0);
  // Space Grotesk arrives from Google Fonts after first paint; redraw once it lands.
  document.fonts?.ready
    .then(() => {
      if (!disposed) uploadAtlas();
    })
    .catch(() => {});

  const seed = new Float32Array(N * 4);
  const seed2 = new Float32Array(N * 4);
  const seed3 = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) {
    seed[i] = Math.random();
    seed2[i] = Math.random();
    seed3[i] = Math.random();
  }
  const bind = (data: Float32Array, name: string) => {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
  };
  bind(seed, 'a_seed');
  bind(seed2, 'a_seed2');
  bind(seed3, 'a_seed3');

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(2, Math.floor(viewW * dpr));
    const h = Math.max(2, Math.floor(viewH * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
    return dpr;
  }

  function render(time: number) {
    const dpr = resize();
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);

    const introT = introStart ? clamp((time - introStart) / INTRO_MS) : 0;
    const intro = 1 - Math.pow(1 - introT, 3);
    const dt = prevTime ? Math.min(100, time - prevTime) : 16;
    prevTime = time;

    const scroll = window.scrollY;
    const target = placeFor(scroll);
    place += (target - place) * ease(dt, TAU_MS.place);

    const vel = ((scroll - prevScroll) / dt) * 1000;
    prevScroll = scroll;
    const stirTarget = Math.max(-1, Math.min(1, vel / (viewH * 3.4)));
    stir += (stirTarget - stir) * ease(dt, TAU_MS.stir);

    // Scrolling adds energy to the tank, so the ink sheds filaments faster while it moves.
    flow += (dt / 1000) * (0.028 + 0.16 * Math.abs(stir));

    const pk = ease(dt, TAU_MS.pointer);
    pointer = {
      x: pointer.x + (pointerTarget.x - pointer.x) * pk,
      y: pointer.y + (pointerTarget.y - pointer.y) * pk,
    };

    placeSites(scroll);
    gl!.uniform2f(u.view, viewW, viewH);
    gl!.uniform3fv(u.site, sites);
    gl!.uniform1f(u.place, place);
    gl!.uniform1f(u.flow, flow);
    gl!.uniform1f(u.time, time * 0.001);
    gl!.uniform1f(u.stir, stir);
    gl!.uniform1f(u.intro, intro);
    gl!.uniform2f(u.pointer, pointer.x, pointer.y);
    gl!.uniform1f(u.size, dpr * (mobile ? 0.9 : 1));
    gl!.uniform1f(u.alpha, 0.78);
    gl!.uniform1f(u.glyphMix, GLYPH.mix);
    gl!.uniform1f(u.glyphPx, GLYPH.px * dpr);
    gl!.drawArrays(gl!.POINTS, 0, N);
  }

  function animate(time: number) {
    raf = 0;
    if (disposed) return;
    render(time);
    raf = requestAnimationFrame(animate);
  }

  const onPointer = (e: PointerEvent) => {
    pointerTarget.x = e.clientX;
    pointerTarget.y = e.clientY;
  };
  const onPointerOut = () => {
    pointerTarget.x = -9999;
    pointerTarget.y = -9999;
  };
  const startIntro = () => {
    if (!introStart) introStart = performance.now();
  };

  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('pointerleave', onPointerOut);
  document.addEventListener('pointerleave', onPointerOut);
  const layoutObserver = new ResizeObserver(measure);
  layoutObserver.observe(document.body);

  const preloader = document.getElementById('sdk-preloader');
  const waiting = preloader && getComputedStyle(preloader).display !== 'none';
  let introTimer = 0;
  if (waiting) {
    window.addEventListener('sdk:preloader-done', startIntro, { once: true });
    introTimer = window.setTimeout(startIntro, 9500);
  } else {
    introTimer = window.setTimeout(startIntro, 200);
  }

  measure();
  place = placeFor(window.scrollY);
  canvas.classList.add('is-live');
  raf = requestAnimationFrame(animate);

  return () => {
    disposed = true;
    clearTimeout(introTimer);
    if (raf) cancelAnimationFrame(raf);
    layoutObserver.disconnect();
    window.removeEventListener('resize', measure);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('pointerleave', onPointerOut);
    document.removeEventListener('pointerleave', onPointerOut);
    window.removeEventListener('sdk:preloader-done', startIntro);
    try {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      /* already gone */
    }
  };
}
