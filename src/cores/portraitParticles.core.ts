// /about — one point cloud that carries the whole page, taking a different form at every
// step of the story.
//
//   0  portrait      the opening, anchored to the hero's portrait box
//   1  words         the manifesto — the portrait SPIRALS into it, galaxy-style
//   2  star birth    road · 2019 — accretion streams feeding a small breathing sun
//   3  constellation road · 2021 — sixteen stars wired into a network, packets running
//   4  orbits        road · 2023 — a whole system: sun, rings, planets, one comet
//   5  galaxy        road · now  — four arms in differential spin, a core, a halo
//   6  crystal       code · precision — a breathing lattice, light on its lines
//   7  black hole    code · motion — photon ring, accretion spirals, polar jets
//   8  river         code · story — an endless braided figure-eight of current
//   9  storm         arsenal — meteors and their tails through still stars
//  10  watermark     the close, behind the contact block
//
// One sky, many objects: every form is space seen through a builder's eyes, in constant
// internal motion — falling, orbiting, streaming — with the points twinkling and scaling
// by depth while the cloud is abstract.
//
// The whole sequence is driven by ONE continuous number, u_shape. The shader blends
// between floor(u_shape) and floor(u_shape) + 1, so every step morphs into the next
// instead of cross-fading, and — because that number is a pure function of scroll
// position — scrolling back up replays the morph exactly in reverse with no extra work.
// An earlier version carried a separate weight per act, which could neither express a
// shape per step nor reverse cleanly, since overlapping weights do not retrace.
//
// The canvas is a FIXED full-viewport layer, not a box inside a section: an absolutely
// positioned canvas would have to be as tall as the document, past the maximum
// renderbuffer size on a page this long.
//
// Draws POINTS, not a full-screen quad — the homepage showcase and the /works stage are
// both quad shaders. Sampling is done on the CPU into static buffers rather than by vertex
// texture fetch, which is optional in WebGL1 (MAX_VERTEX_TEXTURE_IMAGE_UNITS may be 0).

export interface PortraitParticlesOptions {
  /** Fixed, full-viewport canvas. */
  canvas: HTMLCanvasElement;
  /** Element the assembled hero portrait is positioned and sized against. */
  anchor: HTMLElement;
  /** Section the spelled-out manifesto belongs to. */
  textAnchor: HTMLElement;
  /** Portrait to sample. */
  src: string;
  /** Manifesto lines the cloud spells out. */
  lines: string[];
  /**
   * Whether the cloud can run, reported SYNCHRONOUSLY during mount and again with `false`
   * if setup later fails, so the caller can decide whether the fallback <img> is shown at
   * all rather than showing it and taking it away.
   */
  onCapable?: (capable: boolean) => void;
}

// Grid resolution across the image. Raised with the portrait's on-screen size: at 420 the
// points had to be drawn far wider than their spacing to close the gaps, and that overlap
// is what softened the face.
const SAMPLE = 500;
// The ellipse must fit INSIDE the source frame. At centre .47 / radius .54 it reached to
// v = -0.07, above the top of the photograph — and since no samples exist there, the mask
// ended abruptly at the image edge and the assembled portrait had a flat cut across its
// crown. Centred with a radius that stays inside 0..1, it closes properly all the way
// round.
const MASK_CENTRE = { x: 0.5, y: 0.5 };
const MASK_RADIUS = { x: 0.46, y: 0.47 };
const MASK_FEATHER = 0.86;

const PORTRAIT_FILL = 1.2;
const WATERMARK_FILL = 1.15;
const TEXT_WIDTH = 0.78;

/** Shape indices, so the scroll map below reads as the story rather than as numbers. */
const S = {
  portrait: 0,
  words: 1,
  roadFirst: 2,
  roadLast: 5,
  codeFirst: 6,
  codeLast: 8,
  storm: 9,
  watermark: 10,
};

/** Alpha per kind of form. The abstract shapes sit behind live copy; the portrait is it. */
const ALPHA = { portrait: 1, words: 1, abstract: 0.62, watermark: 0.32 };

/** How quickly the rendered shape chases the scroll-derived one. Lower drifts more.
 *  0.075 read as the cloud reacting late rather than being carried — it took roughly half
 *  a second to catch a change, which on a page this scroll-linked feels like lag. */
const SHAPE_EASE = 0.14;

export function mountPortraitParticles({
  canvas,
  anchor,
  textAnchor,
  src,
  lines,
  onCapable,
}: PortraitParticlesOptions) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smoothstep = (a: number, b: number, v: number) => {
    const t = clamp((v - a) / (b - a || 1));
    return t * t * (3 - 2 * t);
  };

  let raf = 0;
  let disposed = false;
  let introStart = 0;
  let shape = S.portrait;
  let settled = false;

  let viewW = window.innerWidth;
  let viewH = window.innerHeight;
  let anchorTopDoc = 0;
  let anchorLeft = 0;
  let anchorW = 1;
  let anchorH = 1;
  let contactTopDoc = Number.POSITIVE_INFINITY;

  type Box = { top: number; height: number };
  const acts: Record<string, Box> = {
    belief: { top: 0, height: 1 },
    road: { top: 0, height: 1 },
    code: { top: 0, height: 1 },
    arsenal: { top: 0, height: 1 },
  };

  const glRef = reduceMotion
    ? null
    : (canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null);
  const capable = !!glRef;
  onCapable?.(capable);

  function measure() {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    const r = anchor.getBoundingClientRect();
    anchorTopDoc = r.top + window.scrollY;
    anchorLeft = r.left;
    anchorW = Math.max(1, r.width);
    anchorH = Math.max(1, r.height);
    for (const id of Object.keys(acts)) {
      const el = document.querySelector<HTMLElement>(`[data-act="${id}"]`);
      if (!el) continue;
      const b = el.getBoundingClientRect();
      acts[id] = { top: b.top + window.scrollY, height: Math.max(1, b.height) };
    }
    const contact = document.getElementById('contact');
    contactTopDoc = contact
      ? contact.getBoundingClientRect().top + window.scrollY
      : Number.POSITIVE_INFINITY;
  }

  /**
   * Scroll position to a continuous shape index.
   *
   * Piecewise and strictly increasing, which is what makes the journey reversible: it is a
   * pure function of scrollY, so going back up produces exactly the values it produced on
   * the way down, in reverse.
   *
   * The stepped ranges use the same arithmetic the DOM sequences use — a pinned act starts
   * at its own top and runs for (height - viewport) — so the cloud changes shape on
   * precisely the scroll where the copy changes beat.
   */
  function shapeFor(y: number): number {
    const B = acts.belief;
    const R = acts.road;
    const C = acts.code;
    const A = acts.arsenal;
    const rEnd = R.top + R.height - viewH;
    const cEnd = C.top + C.height - viewH;

    // From the very first pixel of scroll, so the portrait begins coming apart exactly
    // when the page starts moving. Reaching 1 at the belief act's top means the words are
    // fully gathered the moment that act takes the screen.
    if (y < B.top) {
      return S.portrait + smoothstep(0, B.top, y);
    }
    // Words hold for the whole of the belief pin, then morph across the last viewport into
    // the first road form. Both ends line up exactly with the branch boundaries, so there
    // is no step in the sequence where it hands over.
    if (y < R.top) {
      return S.words + smoothstep(B.top + B.height - viewH, R.top, y);
    }
    if (y < rEnd) {
      const steps = S.roadLast - S.roadFirst;
      return S.roadFirst + steps * clamp((y - R.top) / Math.max(1, R.height - viewH));
    }
    if (y < C.top) {
      return S.roadLast + smoothstep(rEnd, C.top, y);
    }
    if (y < cEnd) {
      const steps = S.codeLast - S.codeFirst;
      return S.codeFirst + steps * clamp((y - C.top) / Math.max(1, C.height - viewH));
    }
    if (y < A.top) {
      return S.codeLast + smoothstep(cEnd, A.top, y);
    }
    return (
      S.storm + smoothstep(contactTopDoc - viewH * 1.1, contactTopDoc - viewH * 0.25, y)
    );
  }

  function loadImage(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /** Gamma lift for one 0-255 channel, so shadow detail survives as points. */
  const lift = (c: number) => Math.min(1, Math.pow(c / 255, 0.86) * 1.12);

  function sample(img: HTMLImageElement) {
    const w = SAMPLE;
    const h = Math.max(1, Math.round((SAMPLE * img.height) / img.width));
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2D context unavailable for sampling');
    ctx.drawImage(img, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);

    const base: number[] = [];
    const color: number[] = [];
    const seed: number[] = [];
    const imgAspect = img.width / img.height;

    // The photograph is a full frame with a busy background, so no luminance threshold
    // isolates the subject — it would keep the bright window and drop the dark suit. The
    // whole frame is sampled and shaped by an ellipse instead.
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const u = (x + 0.5) / w;
        const v = (y + 0.5) / h;
        const dx = (u - MASK_CENTRE.x) / MASK_RADIUS.x;
        const dy = (v - MASK_CENTRE.y) / MASK_RADIUS.y;
        const t = clamp((1 - Math.sqrt(dx * dx + dy * dy)) / (1 - MASK_FEATHER));
        const mask = t * t * (3 - 2 * t);
        if (mask < 0.04) continue;

        const i = (y * w + x) * 4;
        // Jittered off the exact grid: round points on a square lattice leave a dark
        // diamond at every four-way gap, which reads as a mesh laid over the face.
        const jx = (Math.random() - 0.5) * 0.6;
        const jy = (Math.random() - 0.5) * 0.6;
        base.push((u - 0.5 + jx / w) * imgAspect, 0.5 - v + jy / h);
        color.push(lift(data[i]), lift(data[i + 1]), lift(data[i + 2]), mask);
        // TWO independent randoms. Deriving a shape's jitter from the same value that sets
        // its position along an axis makes the jitter a function of that position, and the
        // form repeats itself into a visible comb.
        seed.push(Math.random(), Math.random());
      }
    }

    return {
      count: seed.length / 2,
      base: new Float32Array(base),
      color: new Float32Array(color),
      seed: new Float32Array(seed),
      imgAspect,
      sampleH: h,
    };
  }

  /** Rasterise the manifesto and collect every lit pixel as a target position. */
  async function sampleText(copy: string[]) {
    try {
      // Measuring before the webface loads silently falls back to a system font, and the
      // glyph shapes the points settle into would not match the ones the page uses.
      await document.fonts.ready;
    } catch {
      /* fonts API unavailable — the fallback face is still legible */
    }

    // Raster proportions decide the block's SHAPE, which governs its height once fitted to
    // the viewport width: a wide sheet with a small face lands the copy as a broad,
    // shallow block instead of a near-square one taller than the screen.
    const W = 1600;
    const SIZE = 62;
    const LH = 1.32;
    const FONT = `700 ${SIZE}px "Bricolage Grotesque", sans-serif`;

    const c = document.createElement('canvas');
    let ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2D context unavailable for text');

    ctx.font = FONT;
    const wrapped: string[] = [];
    for (const line of copy) {
      let cur = '';
      for (const word of line.split(' ')) {
        const test = cur ? `${cur} ${word}` : word;
        if (cur && ctx.measureText(test).width > W - 140) {
          wrapped.push(cur);
          cur = word;
        } else {
          cur = test;
        }
      }
      if (cur) wrapped.push(cur);
    }

    const H = Math.ceil(wrapped.length * SIZE * LH) + 40;
    c.width = W;
    c.height = H;
    // Resizing a canvas resets its context, so the font has to be set again here.
    ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.font = FONT;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    wrapped.forEach((line, i) => ctx!.fillText(line, W / 2, 20 + (i + 0.5) * SIZE * LH));

    const { data } = ctx.getImageData(0, 0, W, H);
    const hits: number[] = [];
    const aspect = W / H;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (data[(y * W + x) * 4 + 3] > 128) {
          hits.push(((x + 0.5) / W - 0.5) * aspect, 0.5 - (y + 0.5) / H);
        }
      }
    }
    if (!hits.length) throw new Error('Text rasterised to nothing');
    return { hits: new Float32Array(hits), count: hits.length / 2, aspect };
  }

  /**
   * One glyph position per point, picked from the point's own seed rather than its index:
   * index order follows the portrait's scan lines, so consecutive points would map to
   * consecutive glyph pixels and the face would smear across the text rather than dissolve
   * into it. Points outnumber lit pixels several times over, and the sub-pixel scatter is
   * what turns that stacking into weight rather than a visible stack.
   */
  function textTargets(seed: Float32Array, count: number, text: Float32Array, n: number) {
    const out = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const k = Math.min(n - 1, Math.floor(seed[i * 2] * n));
      out[i * 2] = text[k * 2] + (Math.random() - 0.5) * 0.005;
      out[i * 2 + 1] = text[k * 2 + 1] + (Math.random() - 0.5) * 0.005;
    }
    return out;
  }


  function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sh) ?? 'shader compile failed');
    }
    return sh;
  }

  const VERT = `
    attribute vec2 a_base;
    attribute vec2 a_text;
    attribute vec4 a_color;
    attribute vec2 a_seed;

    uniform vec2 u_heroAnchor;
    uniform float u_heroScale;
    uniform vec2 u_footAnchor;
    uniform float u_footScale;
    uniform float u_textScale;
    uniform float u_shape;
    uniform float u_intro;
    uniform float u_time;
    uniform float u_aspect;
    uniform float u_pointScale;

    varying vec4 v_color;
    varying float v_kind;

    const float PI = 3.14159265;
    /* Shapes that share the page with left-aligned copy sit to the right of it. */
    const float SIDE = 0.34;

    vec3 rotY(vec3 q, float a) {
      float c = cos(a); float s = sin(a);
      return vec3(q.x * c - q.z * s, q.y, q.x * s + q.z * c);
    }
    vec3 rotX(vec3 q, float a) {
      float c = cos(a); float s = sin(a);
      return vec3(q.x, q.y * c - q.z * s, q.y * s + q.z * c);
    }
    /* Depth of the last projected point, captured so main() can scale gl_PointSize with
       it: nearer points draw larger, which is most of what makes the 3D forms read as
       volumes instead of flat scatters. 0.5263 is the neutral value at z = 0. */
    float g_persp = 0.5263;
    /* Perspective projection. Depth is kept in the divide so forms that turn actually read
       as solid rather than as flat outlines. */
    vec2 project(vec3 q, float shift, float k) {
      float persp = 1.0 / (1.9 - q.z);
      g_persp = persp;
      return vec2(shift + q.x * persp * k / u_aspect, q.y * persp * k);
    }

    vec2 portraitAt(vec2 anchorPos, float scale) {
      return anchorPos + vec2(a_base.x * scale / u_aspect, a_base.y * scale);
    }
    vec2 wordsAt() {
      return vec2(a_text.x * u_textScale / u_aspect, a_text.y * u_textScale);
    }

    /* ---- road ---- */

    float hash1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

    /* 2019 · first lines of code — a STAR IS BORN. Dust on five spiral streams falling
       inward to feed a small breathing sun, sparks flung off the poles as it ignites.
       Where it all began. */
    vec2 starAt() {
      float role = a_seed.y;
      float s = a_seed.x;
      vec3 q;
      if (role < 0.30) {
        /* The core, breathing. */
        float a = fract(role * 91.0) * 6.2832;
        float b = (fract(role * 173.0) - 0.5) * 3.1416;
        float rr = pow(s, 1.8) * 0.16 * (1.0 + 0.06 * sin(u_time * 2.2));
        q = vec3(cos(b) * cos(a), sin(b), cos(b) * sin(a)) * rr;
      } else if (role < 0.86) {
        /* The accretion swirl: dust spiralling inward, forever replaced. */
        float k = floor(fract(role * 51.0) * 5.0);
        float infall = fract(s * 1.7 + u_time * 0.05);
        float rr = mix(0.75, 0.10, infall);
        float ang = k * 1.2566 + infall * 7.0 + u_time * 0.25;
        float h = (fract(role * 173.0) + fract(role * 311.0) - 1.0) * 0.05 * rr;
        q = vec3(cos(ang) * rr, h, sin(ang) * rr);
      } else {
        /* Ignition sparks off both poles. */
        float k = floor(s * 30.0);
        float up = fract(u_time * 0.3 + hash1(k * 3.3));
        float sgn = step(0.5, fract(role * 57.0)) * 2.0 - 1.0;
        float a = hash1(k * 7.7) * 6.2832 + u_time;
        float rr = 0.02 + up * 0.06;
        q = vec3(cos(a) * rr, sgn * (0.10 + up * 0.45), sin(a) * rr);
      }
      return project(rotY(rotX(q, 0.55), u_time * 0.14), SIDE, 1.55);
    }

    /* 2021 · going professional — a CONSTELLATION. Sixteen bright stars wired into a
       network, dotted chords between them, packets of light running the wires: the first
       clients arriving, drawn the way the sky draws its stories. */
    vec3 starPos(float i) {
      float a = hash1(i * 3.31 + 0.7) * 6.2832;
      float b = (hash1(i * 7.13 + 2.1) - 0.5) * 2.6;
      return vec3(cos(b) * cos(a), sin(b), cos(b) * sin(a)) * 0.55;
    }
    vec2 constAt() {
      float role = a_seed.y;
      float s = a_seed.x;
      vec3 q;
      if (role < 0.45) {
        /* The stars themselves: dense little suns. */
        float i = floor(s * 16.0);
        float ang = fract(role * 91.0) * 6.2832;
        float rr = pow(fract(role * 173.0), 1.6) * 0.030;
        q = starPos(i) + vec3(cos(ang) * rr, sin(ang) * rr, (fract(role * 311.0) - 0.5) * 0.03);
      } else if (role < 0.86) {
        /* The wires: dotted chords between paired stars. */
        float e = floor(fract(role * 37.0) * 18.0);
        float t2 = (floor(s * 42.0) + 0.5) / 42.0;
        q = mix(starPos(mod(e, 16.0)), starPos(mod(e * 7.0 + 3.0, 16.0)), t2);
        q += (vec3(fract(role * 173.0), fract(role * 311.0), fract(role * 97.0)) - 0.5) * 0.008;
      } else {
        /* Packets running the wires: the network waking up. */
        float e = floor(fract(role * 53.0) * 18.0);
        float t2 = fract(u_time * 0.22 + hash1(e * 9.1) + (fract(role * 131.0) - 0.5) * 0.04);
        q = mix(starPos(mod(e, 16.0)), starPos(mod(e * 7.0 + 3.0, 16.0)), t2);
      }
      return project(rotY(rotX(q, 0.30), u_time * 0.11), SIDE, 1.5);
    }

    /* 2023 · full-stack, full-story — a WHOLE SYSTEM. A small sun, four tilted orbits,
       planets riding them (the inner ones faster, as Kepler insists), and a comet on a
       long ellipse with its tail streaming behind. Owning the whole arc, literally. */
    vec2 orbitsAt() {
      float role = a_seed.y;
      float s = a_seed.x;
      vec3 q;
      if (role < 0.22) {
        /* The sun. */
        float a = fract(role * 91.0) * 6.2832;
        float b = (fract(role * 173.0) - 0.5) * 3.1416;
        float rr = pow(s, 1.7) * 0.11 * (1.0 + 0.05 * sin(u_time * 1.8));
        q = vec3(cos(b) * cos(a), sin(b), cos(b) * sin(a)) * rr;
      } else if (role < 0.62) {
        /* Four dotted orbit rings, each tilted its own way. */
        float k = floor(fract(role * 51.0) * 4.0);
        float R2 = 0.20 + k * 0.15;
        float a = (floor(s * 130.0) + 0.5) / 130.0 * 6.2832;
        q = rotX(vec3(cos(a) * R2, 0.0, sin(a) * R2 * 0.94), 0.10 + k * 0.09);
        q += (vec3(fract(role * 173.0), fract(role * 311.0), fract(role * 97.0)) - 0.5)
           * 0.006;
      } else if (role < 0.92) {
        /* The planets: glowing beads on their rings. */
        float k = floor(fract(role * 37.0) * 4.0);
        float R2 = 0.20 + k * 0.15;
        float a = u_time * (0.55 / (0.4 + k * 0.28)) + k * 2.2;
        vec3 c = rotX(vec3(cos(a) * R2, 0.0, sin(a) * R2 * 0.94), 0.10 + k * 0.09);
        float ang = fract(role * 91.0) * 6.2832;
        float rr = pow(fract(role * 173.0), 1.5) * (0.020 + k * 0.007);
        q = c + vec3(cos(ang) * rr, sin(ang) * rr, (fract(role * 311.0) - 0.5) * rr);
      } else {
        /* The comet, tail streaming back along its path. */
        float a = fract(u_time * 0.05) * 6.2832;
        vec3 c = vec3(cos(a) * 0.72 + 0.22, 0.0, sin(a) * 0.30);
        vec3 back = normalize(vec3(sin(a) * 0.72, 0.0, -cos(a) * 0.30));
        float tr = pow(fract(role * 131.0), 1.6) * 0.14;
        q = rotX(c + back * tr, 0.35);
        q.y += (fract(role * 173.0) - 0.5) * 0.02 * (0.3 + tr * 4.0);
      }
      return project(rotY(rotX(q, 0.42), 0.3 + sin(u_time * 0.07) * 0.3), SIDE, 1.5);
    }

    /* now · cinematic work — a GALAXY. Four arms in differential rotation (the inside
       runs faster, so the swirl visibly winds), a dense core, a thin halo. The work went
       cinematic; the form goes to scale. */
    vec2 galaxyAt() {
      float role = a_seed.y;
      float s = a_seed.x;
      vec3 q;
      if (role < 0.72) {
        float arm = floor(fract(role * 51.0) * 4.0);
        float u = s;
        float rr = 0.09 + 0.58 * u;
        float ang = u * 4.6 + arm * 1.5708 + u_time * (0.34 - u * 0.22)
                  + (fract(role * 91.0) - 0.5) * (0.5 + u * 0.9) * 0.55;
        float h = (fract(role * 173.0) + fract(role * 311.0) - 1.0) * 0.05 * (1.0 - u * 0.6);
        q = vec3(cos(ang) * rr, h, sin(ang) * rr);
      } else if (role < 0.88) {
        /* The core: a small dense sun. */
        float a = fract(role * 91.0) * 6.2832;
        float b = (fract(role * 173.0) - 0.5) * 3.1416;
        float rr = pow(fract(s * 7.7), 1.7) * 0.14;
        q = vec3(cos(b) * cos(a), sin(b) * 0.6, cos(b) * sin(a)) * rr;
      } else {
        /* Halo stars. */
        float a = fract(s * 97.0) * 6.2832;
        float b = (fract(role * 57.0) - 0.5) * 3.1416;
        float rr = 0.30 + fract(s * 211.0) * 0.45;
        q = vec3(cos(b) * cos(a), sin(b) * 0.5, cos(b) * sin(a)) * rr;
      }
      return project(rotX(q, 1.0), SIDE, 1.5);
    }

    /* ---- code ---- */

    /* 精 precision — a CRYSTAL. A cubic lattice of glowing nodes with a spherical wave
       breathing through it, and light running its lines. Order you can watch working. */
    vec2 latticeAt() {
      float role = a_seed.y;
      float s = a_seed.x;
      float N = 9.0;
      float SP = 0.135;
      vec3 g;
      if (role < 0.58) {
        float i = floor(s * N * N * N);
        g = vec3(mod(i, N), mod(floor(i / N), N), floor(i / (N * N)));
        g = (g - (N - 1.0) * 0.5) * SP;
        g += (vec3(fract(role * 173.0), fract(role * 311.0), fract(role * 97.0)) - 0.5)
           * 0.016;
      } else {
        /* Light running the lattice lines, all three axes at once. */
        float k = floor(fract(role * 37.0) * N * N);
        vec2 cell = vec2(mod(k, N), floor(k / N));
        float run = fract(s + u_time * 0.05) * (N - 1.0);
        float axis = floor(fract(role * 91.0) * 3.0);
        g = axis < 0.5 ? vec3(run, cell.x, cell.y)
          : axis < 1.5 ? vec3(cell.x, run, cell.y)
                       : vec3(cell.x, cell.y, run);
        g = (g - (N - 1.0) * 0.5) * SP;
      }
      float d = length(g);
      g *= 1.0 + 0.055 * sin(d * 8.0 - u_time * 1.5);
      return project(rotY(rotX(g, 0.42), u_time * 0.12), 0.0, 1.45);
    }

    /* 動 motion — a BLACK HOLE, face on. The photon ring, an accretion disc of dust on
       tightening spirals (faster the deeper it falls), plunge streaks that cross the gap
       and vanish, and the jets off both poles. The act's copy sits inside the shadow —
       the one place the light never leaves. */
    vec2 holeAt() {
      float role = a_seed.y;
      float s = a_seed.x;
      vec2 p;
      if (role < 0.30) {
        /* The photon ring: the last light that ever gets out. */
        float a = s * 6.2832 + u_time * 0.05;
        float rr = 0.58 + (fract(role * 173.0) + fract(role * 311.0) - 1.0) * 0.022;
        p = vec2(cos(a), sin(a)) * rr;
      } else if (role < 0.78) {
        /* The accretion disc: seven spiral streams, forever replaced. */
        float k = floor(fract(role * 51.0) * 7.0);
        float infall = fract(s * 2.3 + u_time * 0.045 + k * 0.14);
        float rr = mix(1.20, 0.64, infall);
        float a = k * 0.8976 + infall * 5.5 + u_time * (0.30 / rr);
        p = vec2(cos(a), sin(a) * 0.92) * rr;
        p += (vec2(fract(role * 173.0), fract(role * 311.0)) - 0.5) * 0.05 * rr;
      } else if (role < 0.90) {
        /* The plunge: streaks crossing the gap, swallowed by the shadow. */
        float k = floor(fract(role * 67.0) * 10.0);
        float infall = fract(u_time * 0.16 + hash1(k * 5.3) + (fract(role * 131.0) - 0.5) * 0.06);
        float a = hash1(k * 3.7) * 6.2832 + u_time * 0.05 + infall * 2.2;
        p = vec2(cos(a), sin(a)) * mix(0.60, 0.34, infall);
      } else {
        /* The jets: what the hole cannot keep, thrown out both poles. */
        float sgn = step(0.5, fract(role * 57.0)) * 2.0 - 1.0;
        float k = floor(s * 20.0);
        float up = fract(u_time * 0.22 + hash1(k * 7.1) + (fract(role * 131.0) - 0.5) * 0.05);
        p = vec2((fract(role * 173.0) + fract(role * 311.0) - 1.0) * (0.015 + up * 0.10),
                 sgn * (0.64 + up * 0.85));
      }
      return project(vec3(p, 0.0), 0.0, 1.45);
    }

    /* 物語 story — the RIVER. An endless figure-eight of current, three strands braided
       around the path, weaving over and under itself where it crosses. A story that
       never runs out. */
    vec2 riverAt() {
      float role = a_seed.y;
      float s = a_seed.x;
      float tau = (s + u_time * 0.045) * 6.2832;
      float den = 1.0 + sin(tau) * sin(tau);
      vec3 q = vec3(0.82 * cos(tau) / den,
                    0.62 * sin(tau) * cos(tau) / den,
                    0.16 * sin(2.0 * tau));
      float strand = floor(fract(role * 13.0) * 3.0);
      float wob = tau * 3.0 + strand * 2.0944 + u_time * 0.6;
      float mist = step(0.86, fract(role * 57.0));
      float tube = mix(0.020, 0.065, mist) * (0.5 + fract(role * 173.0));
      q += vec3(cos(wob), sin(wob), sin(wob * 0.7)) * tube;
      return project(rotX(q, 0.25), 0.0, 1.5);
    }

    /* ---- arsenal ---- */

    /* arsenal — the STORM. Meteors with real tails, all falling the same way through a
       field of still stars. What I wield, as weather. */
    vec2 stormAt() {
      float role = a_seed.y;
      float s = a_seed.x;
      vec2 p;
      if (role < 0.78) {
        float k = floor(s * 30.0);
        vec2 dir = vec2(-0.794, -0.607);
        float speed = 0.10 + hash1(k * 7.7) * 0.12;
        float prog = fract(u_time * speed + hash1(k * 3.1));
        vec2 start = vec2(-0.6 + hash1(k * 5.3) * 4.6, 0.9 + hash1(k * 9.7) * 1.4);
        vec2 head = start + dir * prog * 3.6;
        /* The tail: dense at the head, loosening as it falls behind. */
        float trail = pow(fract(role * 29.0), 1.4);
        p = head - dir * trail * (0.22 + hash1(k * 11.3) * 0.30)
          + vec2(fract(role * 173.0) - 0.5, fract(role * 311.0) - 0.5) * 0.03
            * (0.2 + trail);
      } else {
        /* The night behind: many points folded onto FEW stars (bright, twinkling), spread
           past every edge of the screen so the field has no visible border. */
        float k = floor(s * 1400.0);
        p = vec2((hash1(k * 3.7) - 0.5) * 6.0, (hash1(k * 8.3) - 0.5) * 3.4)
          + vec2(fract(role * 173.0) - 0.5, fract(role * 311.0) - 0.5) * 0.012;
      }
      return project(vec3(p, 0.0), 0.10, 1.5);
    }

    vec2 shapeAt(float id) {
      if (id < 0.5) return portraitAt(u_heroAnchor, u_heroScale);
      if (id < 1.5) return wordsAt();
      if (id < 2.5) return starAt();
      if (id < 3.5) return constAt();
      if (id < 4.5) return orbitsAt();
      if (id < 5.5) return galaxyAt();
      if (id < 6.5) return latticeAt();
      if (id < 7.5) return holeAt();
      if (id < 8.5) return riverAt();
      if (id < 9.5) return stormAt();
      return portraitAt(u_footAnchor, u_footScale);
    }

    /* Point size per form: glyph strokes are far narrower than facial features, and the
       watermark is drawn several times larger than the hero portrait. The abstract forms
       draw FINE — the sparkle of a point cloud only exists while points stay points; at
       portrait size they fuse into grey clay. */
    float sizeAt(float id) {
      if (id < 0.5) return 1.0;
      if (id < 1.5) return 0.82;
      if (id < 9.5) return 0.55;
      return u_footScale / max(u_heroScale, 0.001);
    }

    void main() {
      float f = floor(u_shape);
      float t = smoothstep(0.0, 1.0, u_shape - f);

      g_persp = 0.5263;
      vec2 pa = shapeAt(f);
      float da = g_persp;
      g_persp = 0.5263;
      vec2 pb = shapeAt(f + 1.0);
      float db = g_persp;

      vec2 p;
      if (f < 0.5) {
        /* The portrait does not slide into the words — it spirals into them. Each point
           orbits its own landing glyph while it closes in, at its own number of turns,
           with a puff of stardust at mid-flight: the face breaks into a galaxy and the
           galaxy settles into the manifesto. Still a pure function of scroll, so rolling
           back up rewinds the same swirl. */
        vec2 d = (pa - pb) * vec2(u_aspect, 1.0);
        float ang2 = t * mix(2.2, 4.6, fract(a_seed.y * 3.7));
        float cs = cos(ang2);
        float sn = sin(ang2);
        d = vec2(d.x * cs - d.y * sn, d.x * sn + d.y * cs) * (1.0 - t);
        p = pb + d / vec2(u_aspect, 1.0);
        p += vec2(fract(a_seed.x * 91.0) - 0.5, fract(a_seed.y * 131.0) - 0.5)
           * 0.05 * sin(t * 3.1416);
      } else {
        p = mix(pa, pb, t);
      }
      float size = mix(sizeAt(f), sizeAt(f + 1.0), t);

      /* Opening convergence: the cloud gathers in from a scattered ring on arrival. */
      float ang = a_seed.x * 6.2831;
      float rad = 0.9 + a_seed.y * 1.5;
      p = mix(vec2(cos(ang) * rad / u_aspect, sin(ang) * rad), p, u_intro);

      /* While the cloud is abstract, points size with their depth and twinkle on their
         own clocks; the portrait, words and watermark stay exact and still. */
      float ab = clamp(min(u_shape - 1.0, 10.0 - u_shape), 0.0, 1.0);
      float depth = mix(da, db, t) * 1.9;
      float tw = 1.0 + 0.45 * ab * sin(u_time * (1.5 + a_seed.y * 4.0) + a_seed.x * 60.0);

      gl_Position = vec4(p, 0.0, 1.0);
      gl_PointSize = u_pointScale * size * mix(1.0, depth, ab) * tw;
      v_color = a_color;
      v_kind = u_shape;
    }
  `;

  const FRAG = `
    precision mediump float;
    varying vec4 v_color;
    varying float v_kind;
    uniform float u_alpha;
    uniform float u_lift;

    void main() {
      // Round, and near-solid: feather only the outermost rim. Fading to the centre meant
      // no point reached full opacity and the forms stayed a haze.
      vec2 c = gl_PointCoord - 0.5;
      float d = dot(c, c);
      if (d > 0.25) discard;
      // Lifted toward the page's cream while the cloud is letterforms: these points carry
      // the photograph's charcoal, which reads as a face against dark but disappears as
      // dark-on-dark type.
      vec3 rgb = mix(v_color.rgb, mix(v_color.rgb, vec3(0.96, 0.94, 0.90), 0.62), u_lift);
      gl_FragColor = vec4(rgb, smoothstep(0.25, 0.19, d) * v_color.a * u_alpha);
    }
  `;

  async function init() {
    const gl = glRef;
    if (!gl) throw new Error('WebGL unavailable');

    const img = await loadImage();
    if (disposed) throw new Error('Disposed during image load');
    const pts = sample(img);
    if (!pts.count) throw new Error('No points survived sampling');
    const txt = await sampleText(lines);
    if (disposed) throw new Error('Disposed during text layout');
    const textAttr = textTargets(pts.seed, pts.count, txt.hits, txt.count);

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed');
    }
    gl.useProgram(program);

    const bind = (data: Float32Array, name: string, size: number) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    bind(pts.base, 'a_base', 2);
    bind(textAttr, 'a_text', 2);
    bind(pts.color, 'a_color', 4);
    bind(pts.seed, 'a_seed', 2);

    const u = {
      heroAnchor: gl.getUniformLocation(program, 'u_heroAnchor'),
      heroScale: gl.getUniformLocation(program, 'u_heroScale'),
      footAnchor: gl.getUniformLocation(program, 'u_footAnchor'),
      footScale: gl.getUniformLocation(program, 'u_footScale'),
      textScale: gl.getUniformLocation(program, 'u_textScale'),
      shape: gl.getUniformLocation(program, 'u_shape'),
      intro: gl.getUniformLocation(program, 'u_intro'),
      time: gl.getUniformLocation(program, 'u_time'),
      aspect: gl.getUniformLocation(program, 'u_aspect'),
      pointScale: gl.getUniformLocation(program, 'u_pointScale'),
      alpha: gl.getUniformLocation(program, 'u_alpha'),
      lift: gl.getUniformLocation(program, 'u_lift'),
    };

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.floor(viewW * dpr));
      const h = Math.max(2, Math.floor(viewH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl!.viewport(0, 0, w, h);
      }
      return { h, aspect: w / Math.max(1, h) };
    }

    function render(time: number, sh: number, intro: number) {
      const { h, aspect } = resize();
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(program);

      const cx = anchorLeft + anchorW / 2;
      const cy = anchorTopDoc + anchorH / 2 - window.scrollY;
      // Capped so a tall column on a short screen cannot push the portrait off both edges.
      const heroPx = Math.min(
        PORTRAIT_FILL * Math.min(anchorW / pts.imgAspect, anchorH),
        0.88 * viewH,
      );
      const heroScale = (2 * heroPx) / viewH;

      gl!.uniform2f(u.heroAnchor, (cx / viewW) * 2 - 1, 1 - (cy / viewH) * 2);
      gl!.uniform1f(u.heroScale, heroScale);
      gl!.uniform2f(u.footAnchor, 0, -0.04);
      gl!.uniform1f(u.footScale, 2 * WATERMARK_FILL);
      // Solving through the aspect keeps the text block the same share of the screen on
      // any window; a fixed height would overrun a narrow one and look lost on a wide one.
      gl!.uniform1f(u.textScale, (TEXT_WIDTH * 2 * aspect) / txt.aspect);
      gl!.uniform1f(u.shape, sh);
      gl!.uniform1f(u.intro, intro);
      gl!.uniform1f(u.time, time * 0.001);
      gl!.uniform1f(u.aspect, aspect);

      // Alpha and the cream lift both follow the shape index, so they arrive and leave in
      // step with the form they belong to rather than on their own schedule.
      const near = (a: number, b: number) => Math.max(0, 1 - Math.abs(a - b));
      const words = near(sh, S.words);
      const portrait = near(sh, S.portrait);
      const mark = near(sh, S.watermark);
      const abstract = Math.max(0, 1 - portrait - words - mark);
      gl!.uniform1f(
        u.alpha,
        ALPHA.portrait * portrait +
          ALPHA.words * words +
          ALPHA.watermark * mark +
          ALPHA.abstract * abstract,
      );
      // The illustrated forms lift most of the way to cream too: left in the photograph's
      // charcoal they read as dust; lifted, they read as drawn light.
      gl!.uniform1f(u.lift, Math.max(words, abstract * 0.85));

      // Size each point to the spacing it must cover at hero scale. Circles on a square
      // grid need 1.41x just to touch at the diagonals; 1.6x closes the interstices with a
      // little to spare. Every step above that is overlap, and overlap is blur — the
      // finer grid above is what allows this to come down from 1.8.
      const spacing = ((heroScale / 2) * h) / pts.sampleH;
      gl!.uniform1f(u.pointScale, Math.max(1.4, spacing * 1.6));

      gl!.drawArrays(gl!.POINTS, 0, pts.count);
    }

    return { render };
  }

  let renderer: { render: (t: number, sh: number, intro: number) => void } | null = null;

  const onResize = () => {
    measure();
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('resize', onResize, { passive: true });

  const onScroll = () => {
    settled = false;
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Pin spacers, images and font swaps all change these boxes well after mount, so
  // re-measure on layout changes rather than on every scroll event.
  const layoutObserver = new ResizeObserver(() => {
    measure();
    settled = false;
    if (!raf) raf = requestAnimationFrame(animate);
  });
  layoutObserver.observe(document.body);
  layoutObserver.observe(anchor);
  layoutObserver.observe(textAnchor);

  function animate(time: number) {
    if (disposed) {
      raf = 0;
      return;
    }
    raf = 0;

    const introT = introStart ? clamp((time - introStart) / 2000) : 0;
    const intro = 1 - Math.pow(1 - introT, 3);

    // Eased toward the scroll-derived value rather than snapped to it: the lag is what
    // makes a fast flick read as the cloud being carried along instead of teleporting.
    // Easing preserves reversibility — the target is still a pure function of scroll.
    const target = shapeFor(window.scrollY);
    shape += (target - shape) * SHAPE_EASE;
    const chasing = Math.abs(target - shape) > 0.0004;
    if (!chasing) shape = target;

    if (renderer) renderer.render(time, shape, intro);

    // Every abstract form turns under its own clock, so anything but a settled portrait,
    // word block or watermark keeps the loop alive.
    const still =
      Math.abs(shape - S.portrait) < 0.01 ||
      Math.abs(shape - S.words) < 0.01 ||
      Math.abs(shape - S.watermark) < 0.01;
    settled = still && !chasing && introT >= 1;
    if (!settled) raf = requestAnimationFrame(animate);
  }

  measure();
  shape = shapeFor(window.scrollY);

  if (!capable) {
    return () => {
      disposed = true;
      layoutObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }

  init()
    .then((r) => {
      if (disposed) return;
      renderer = r;
      canvas.classList.add('is-live');
      introStart = performance.now();
      if (!raf) raf = requestAnimationFrame(animate);
    })
    .catch((err) => {
      if (disposed) return;
      // Capability was reported optimistically from the context probe alone, so anything
      // failing afterwards has to hand the fallback back rather than leave a blank canvas.
      console.warn('Portrait particles unavailable. Using image fallback.', err);
      onCapable?.(false);
    });

  return () => {
    disposed = true;
    layoutObserver.disconnect();
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    try {
      glRef?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      /* already gone */
    }
  };
}
