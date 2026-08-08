// /about — one point cloud that carries the whole page, taking a different form at every
// step of the story.
//
//   0  portrait      the opening, anchored to the hero's portrait box
//   1  words         the manifesto, spelled out
//   2  sphere        road · 2019
//   3  torus         road · 2021
//   4  wave          road · 2023
//   5  galaxy        road · now
//   6  lattice       code · precision
//   7  vortex        code · motion
//   8  ribbon        code · story
//   9  helix         arsenal
//  10  watermark     the close, behind the contact block
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

const SAMPLE = 420;
const MASK_CENTRE = { x: 0.5, y: 0.47 };
const MASK_RADIUS = { x: 0.46, y: 0.54 };
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
  helix: 9,
  watermark: 10,
};

/** Alpha per kind of form. The abstract shapes sit behind live copy; the portrait is it. */
const ALPHA = { portrait: 1, words: 1, abstract: 0.62, watermark: 0.32 };

/** How quickly the rendered shape chases the scroll-derived one. Lower drifts more. */
const SHAPE_EASE = 0.075;

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

    if (y < B.top) {
      return S.portrait + smoothstep(B.top - viewH * 0.85, B.top, y);
    }
    if (y < R.top) {
      return S.words + smoothstep(B.top + B.height - viewH * 1.25, R.top, y);
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
      S.helix + smoothstep(contactTopDoc - viewH * 1.1, contactTopDoc - viewH * 0.25, y)
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
    /* Perspective projection. Depth is kept in the divide so forms that turn actually read
       as solid rather than as flat outlines. */
    vec2 project(vec3 q, float shift, float k) {
      float persp = 1.0 / (1.9 - q.z);
      return vec2(shift + q.x * persp * k / u_aspect, q.y * persp * k);
    }

    vec2 portraitAt(vec2 anchorPos, float scale) {
      return anchorPos + vec2(a_base.x * scale / u_aspect, a_base.y * scale);
    }
    vec2 wordsAt() {
      return vec2(a_text.x * u_textScale / u_aspect, a_text.y * u_textScale);
    }

    /* ---- road ---- */
    vec2 sphereAt() {
      /* acos of a uniform variable spreads points evenly over the surface; using the angle
         directly would crowd them at the poles. */
      float phi = acos(2.0 * a_seed.y - 1.0);
      float th = a_seed.x * 2.0 * PI + u_time * 0.18;
      vec3 q = vec3(sin(phi) * cos(th), cos(phi), sin(phi) * sin(th)) * 0.60;
      return project(rotY(q, 0.0), SIDE, 1.55);
    }
    vec2 torusAt() {
      float a = a_seed.x * 2.0 * PI;
      float b = a_seed.y * 2.0 * PI + u_time * 0.22;
      float R = 0.44; float r = 0.17;
      vec3 q = vec3((R + r * cos(b)) * cos(a), r * sin(b), (R + r * cos(b)) * sin(a));
      return project(rotX(rotY(q, u_time * 0.14), 1.02), SIDE, 1.55);
    }
    vec2 waveAt() {
      float n = 92.0;
      float i = floor(a_seed.x * (n * n - 1.0));
      float gx = mod(i, n) / (n - 1.0) - 0.5;
      float gz = floor(i / n) / (n - 1.0) - 0.5;
      float h = sin(gx * 9.0 + u_time * 0.9) * 0.075 + cos(gz * 7.5 + u_time * 0.7) * 0.075;
      vec3 q = vec3(gx * 1.25, h, gz * 1.25);
      return project(rotX(q, 1.02), SIDE, 1.5);
    }
    vec2 galaxyAt() {
      float arm = floor(a_seed.y * 3.0);
      float u = a_seed.x;
      float r = 0.07 + u * 0.70;
      /* Angle grows with radius, which is what gives the arms their sweep. */
      float ang = u * 4.2 + arm * (2.0 * PI / 3.0) + u_time * 0.16
                + (fract(a_seed.y * 17.0) - 0.5) * 0.42;
      return vec2(SIDE + cos(ang) * r / u_aspect, sin(ang) * r);
    }

    /* ---- code ---- */
    vec2 latticeAt() {
      float n = 11.0;
      float i = floor(a_seed.x * (n * n * n - 1.0));
      vec3 g = vec3(mod(i, n), mod(floor(i / n), n), floor(i / (n * n))) / (n - 1.0) - 0.5;
      g += (vec3(a_seed.y, fract(a_seed.y * 37.0), fract(a_seed.x * 17.0)) - 0.5) * 0.012;
      return project(rotY(g, u_time * 0.22), 0.0, 1.9);
    }
    vec2 vortexAt() {
      float r = 0.10 + a_seed.x * 0.62;
      /* Inner points turn faster than outer ones, so the field shears as it spins. */
      float ang = a_seed.y * 2.0 * PI + u_time * 0.75 / (0.28 + r);
      return vec2(cos(ang) * r / u_aspect, sin(ang) * r);
    }
    vec2 ribbonAt() {
      float t = a_seed.x * 2.0 * PI;
      float w = (a_seed.y - 0.5) * 0.30;
      /* Named twist, not half: half is a RESERVED WORD in GLSL ES, and using it fails the
         whole program to compile rather than just this function. */
      float twist = t * 0.5 + u_time * 0.16;
      float R = 0.44;
      vec3 q = vec3((R + w * cos(twist)) * cos(t), w * sin(twist), (R + w * cos(twist)) * sin(t));
      return project(rotX(q, 0.62), 0.0, 1.7);
    }

    /* ---- arsenal ---- */
    vec2 helixAt() {
      float role = a_seed.y;
      float isRung = step(0.78, role);
      float isB = step(0.39, role) * (1.0 - isRung);
      float axis = a_seed.x;
      /* Rung points snap to discrete stations; left continuous they spread between the
         strands as a faint sheet instead of a ladder. */
      float snapped = (floor(axis * 30.0) + 0.5) / 30.0;
      float ay = (mix(axis, snapped, isRung) * 2.0 - 1.0) * 1.35;
      float ang = ay * 5.5 + u_time * 0.35;
      float xA = 0.30 * sin(ang) / u_aspect;
      float xB = 0.30 * sin(ang + PI) / u_aspect;
      float rungT = (role - 0.78) / 0.22;
      float ax = mix(0.30 * sin(ang + isB * PI) / u_aspect, mix(xA, xB, rungT), isRung);
      ax += (fract(role * 91.0) - 0.5) * 0.05 / u_aspect * (1.0 - isRung * 0.8);
      return vec2(SIDE + ax, ay);
    }

    vec2 shapeAt(float id) {
      if (id < 0.5) return portraitAt(u_heroAnchor, u_heroScale);
      if (id < 1.5) return wordsAt();
      if (id < 2.5) return sphereAt();
      if (id < 3.5) return torusAt();
      if (id < 4.5) return waveAt();
      if (id < 5.5) return galaxyAt();
      if (id < 6.5) return latticeAt();
      if (id < 7.5) return vortexAt();
      if (id < 8.5) return ribbonAt();
      if (id < 9.5) return helixAt();
      return portraitAt(u_footAnchor, u_footScale);
    }

    /* Point size per form: glyph strokes are far narrower than facial features, and the
       watermark is drawn several times larger than the hero portrait. */
    float sizeAt(float id) {
      if (id < 0.5) return 1.0;
      if (id < 1.5) return 0.82;
      if (id < 9.5) return 0.9;
      return u_footScale / max(u_heroScale, 0.001);
    }

    void main() {
      float f = floor(u_shape);
      float t = smoothstep(0.0, 1.0, u_shape - f);

      vec2 p = mix(shapeAt(f), shapeAt(f + 1.0), t);
      float size = mix(sizeAt(f), sizeAt(f + 1.0), t);

      /* Opening convergence: the cloud gathers in from a scattered ring on arrival. */
      float ang = a_seed.x * 6.2831;
      float rad = 0.9 + a_seed.y * 1.5;
      p = mix(vec2(cos(ang) * rad / u_aspect, sin(ang) * rad), p, u_intro);

      gl_Position = vec4(p, 0.0, 1.0);
      gl_PointSize = u_pointScale * size;
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
      gl!.uniform1f(u.lift, words);

      // Size each point to the spacing it must cover at hero scale. 1.8x closes the
      // interstices — circles on a square grid need 1.41x just to touch at the diagonals,
      // and these have soft rims.
      const spacing = ((heroScale / 2) * h) / pts.sampleH;
      gl!.uniform1f(u.pointScale, Math.max(1.5, spacing * 1.8));

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
