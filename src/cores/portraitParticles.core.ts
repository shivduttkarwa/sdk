// /about hero — the portrait rendered as a field of GPU points that converge into the
// photograph on arrival and come apart again as the hero scrolls away.
//
// Draws POINTS, not a full-screen quad. That is the whole reason this exists rather than
// another crossfade: the homepage showcase and the /works stage are both quad shaders, so
// a third would read as the same trick a third time.
//
// Sampling is done on the CPU into static attribute buffers rather than by fetching the
// texture in the vertex shader. Vertex texture fetch is optional in WebGL1
// (MAX_VERTEX_TEXTURE_IMAGE_UNITS may legitimately be 0), and sampling up front also lets
// points that would be invisible be dropped before they ever reach the GPU.

export interface PortraitParticlesOptions {
  canvas: HTMLCanvasElement;
  /** Portrait to sample. */
  src: string;
  /**
   * Whether the cloud can run, reported SYNCHRONOUSLY during mount and again with `false`
   * if setup later fails. Callers use it to decide whether the fallback <img> is shown at
   * all — see the note on ordering in mountPortraitParticles.
   */
  onCapable?: (capable: boolean) => void;
}

// Grid resolution across the image. This has to be at least as fine as the cloud is drawn
// large, or the points cannot tile and the portrait reads as noise rather than a face.
// 420 across gives roughly 140k points after the mask — still cheap for a POINTS draw,
// and it is what makes the assembled state legible down to the shirt collar and tie.
const SAMPLE = 420;

// The photograph is a full frame with a busy background — windows, a lamp, framed art —
// so there is no luminance threshold that isolates the subject. Thresholding would in fact
// invert the intent: it would keep the bright window and drop the dark suit. Instead the
// whole frame is sampled and shaped by an ellipse, biased slightly above centre where the
// head sits, so the cloud fades out through the background rather than ending on a
// rectangular edge.
const MASK_CENTRE = { x: 0.5, y: 0.47 };
const MASK_RADIUS = { x: 0.46, y: 0.54 };
// Solid until 0.86 of the way out, then a short feather — so the portrait is drawn at full
// alpha almost everywhere instead of being dimmed from a third of the way out.
const MASK_FEATHER = 0.86;

// Fraction of the PORTRAIT BOX (not the canvas) the assembled portrait fills. The canvas
// is deliberately much larger than that box so scattered points have somewhere to go; see
// .abt-portrait__fx in the stylesheet.
const PORTRAIT_FILL = 0.93;

// Capability is settled before this function returns, not when the image finishes
// loading. That ordering is the whole point: the fallback <img> used to be visible by
// default and hidden only once the cloud was ready, so arriving at the page showed the
// finished photograph, blanked it, and only then ran the convergence — giving away the
// reveal before it happened. The caller now hides the fallback in the same tick it mounts.
export function mountPortraitParticles({ canvas, src, onCapable }: PortraitParticlesOptions) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  let raf = 0;
  let disposed = false;
  let visible = false;
  let introStart = 0;
  let heroHeight = 1;
  /** The element the portrait is sized against — the canvas overflows well past it. */
  const box = canvas.parentElement as HTMLElement | null;

  // Both checks are synchronous, so the answer is known immediately. Only the image load
  // below is async, and it is the same file the <img> already requested.
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
    heroHeight = Math.max(1, canvas.closest('section')?.clientHeight ?? window.innerHeight);
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

  /** Read the image on a 2D canvas and turn it into static point attributes. */
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
    const scatter: number[] = [];
    const color: number[] = [];
    const seed: number[] = [];
    const imgAspect = img.width / img.height;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const u = (x + 0.5) / w;
        const v = (y + 0.5) / h;

        const dx = (u - MASK_CENTRE.x) / MASK_RADIUS.x;
        const dy = (v - MASK_CENTRE.y) / MASK_RADIUS.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const t = clamp((1 - d) / (1 - MASK_FEATHER));
        const mask = t * t * (3 - 2 * t);
        if (mask < 0.04) continue;

        const i = (y * w + x) * 4;
        // Portrait space: x spans +-0.5 * aspect, y is +-0.5 and points up. Jittered off
        // the exact grid: round points on a perfectly square lattice leave a dark diamond
        // at every four-way gap, which reads as a mesh laid over the face. A fraction of a
        // cell of noise breaks the regularity without moving any sample far enough to
        // matter, and it looks like scattered particles rather than a screen door.
        const jx = (Math.random() - 0.5) * 0.6;
        const jy = (Math.random() - 0.5) * 0.6;
        base.push((u - 0.5 + jx / w) * imgAspect, 0.5 - v + jy / h);

        // Scattered origin. Reaches far outside the portrait on purpose — the canvas is
        // sized to let points travel well past the portrait box, so assembling reads as a
        // cloud gathering in from open space rather than a blur tightening in place.
        const ang = Math.random() * Math.PI * 2;
        const rad = 0.8 + Math.random() * 1.5;
        scatter.push(Math.cos(ang) * rad * imgAspect, Math.sin(ang) * rad);

        color.push(lift(data[i]), lift(data[i + 1]), lift(data[i + 2]), mask);
        seed.push(Math.random());
      }
    }

    return {
      count: seed.length,
      base: new Float32Array(base),
      scatter: new Float32Array(scatter),
      color: new Float32Array(color),
      seed: new Float32Array(seed),
      imgAspect,
      sampleH: h,
    };
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
    attribute vec2 a_scatter;
    attribute vec4 a_color;
    attribute float a_seed;

    uniform float u_assemble;
    uniform float u_time;
    uniform float u_fit;
    uniform float u_aspect;
    uniform float u_pointScale;

    varying vec4 v_color;

    void main() {
      vec2 p = mix(a_scatter, a_base, u_assemble);

      // Drift only while the cloud is loose. It falls to nothing as the portrait forms —
      // a settled face must not shimmer, because any residual jitter at this point size
      // blurs exactly the detail the higher sample rate was added to recover.
      float ph = a_seed * 6.2831;
      float loose = 1.0 - u_assemble;
      p += vec2(sin(u_time * 0.6 + ph), cos(u_time * 0.5 + ph * 1.3)) * 0.05 * loose * loose;

      gl_Position = vec4(p.x * u_fit / u_aspect, p.y * u_fit, 0.0, 1.0);
      gl_PointSize = u_pointScale;
      v_color = a_color;
    }
  `;

  const FRAG = `
    precision mediump float;
    varying vec4 v_color;
    uniform float u_fade;

    void main() {
      // Round, and near-solid: feather only the outermost rim. Fading all the way to the
      // centre meant no point ever reached full opacity and the portrait stayed a haze.
      vec2 c = gl_PointCoord - 0.5;
      float d = dot(c, c);
      if (d > 0.25) discard;
      gl_FragColor = vec4(v_color.rgb, smoothstep(0.25, 0.19, d) * v_color.a * u_fade);
    }
  `;

  async function init() {
    const gl = glRef;
    if (!gl) throw new Error('WebGL unavailable');

    const img = await loadImage();
    if (disposed) throw new Error('Disposed during image load');
    const pts = sample(img);
    if (!pts.count) throw new Error('No points survived sampling');

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
    bind(pts.scatter, 'a_scatter', 2);
    bind(pts.color, 'a_color', 4);
    bind(pts.seed, 'a_seed', 1);

    const u = {
      assemble: gl.getUniformLocation(program, 'u_assemble'),
      time: gl.getUniformLocation(program, 'u_time'),
      fit: gl.getUniformLocation(program, 'u_fit'),
      aspect: gl.getUniformLocation(program, 'u_aspect'),
      pointScale: gl.getUniformLocation(program, 'u_pointScale'),
      fade: gl.getUniformLocation(program, 'u_fade'),
    };

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let cssW = canvas.clientWidth;
    let cssH = canvas.clientHeight;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        if (e.target === canvas) {
          cssW = e.contentRect.width;
          cssH = e.contentRect.height;
        }
      }
    });
    ro.observe(canvas);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.floor(cssW * dpr));
      const h = Math.max(2, Math.floor(cssH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl!.viewport(0, 0, w, h);
      }
      const aspect = w / Math.max(1, h);
      gl!.uniform1f(u.aspect, aspect);

      // The assembled portrait is sized against the PORTRAIT BOX, not the canvas, so the
      // canvas can be inflated to give scattered points room without the face growing to
      // match. Derived from the live element sizes rather than a constant duplicated in
      // the stylesheet — change the canvas inset and this simply follows.
      const boxW = box?.clientWidth || cssW;
      const boxH = box?.clientHeight || cssH;
      const targetH = PORTRAIT_FILL * Math.min(boxW / pts.imgAspect, boxH);
      const fit = (2 * targetH) / Math.max(1, cssH);
      gl!.uniform1f(u.fit, fit);

      // Size each point to the grid spacing it must cover: the portrait spans (fit / 2) of
      // the canvas vertically across sampleH rows, so that IS the gap between neighbours.
      // Circles on a square grid need 1.41x spacing just to touch at the diagonals, and
      // these have a soft rim, so 1.8x is what actually closes the interstices.
      const spacing = ((fit / 2) * h) / pts.sampleH;
      gl!.uniform1f(u.pointScale, Math.max(1.5, spacing * 1.8));
    }

    function render(time: number, assemble: number, fade: number) {
      resize();
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(program);
      gl!.uniform1f(u.assemble, assemble);
      gl!.uniform1f(u.time, time * 0.001);
      gl!.uniform1f(u.fade, fade);
      gl!.drawArrays(gl!.POINTS, 0, pts.count);
    }

    if (box) ro.observe(box);
    return { render, dispose: () => ro.disconnect() };
  }

  let renderer: { render: (t: number, a: number, f: number) => void; dispose: () => void } | null =
    null;

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) {
        if (!introStart) introStart = performance.now();
        if (!raf) raf = requestAnimationFrame(animate);
      }
    },
    { threshold: [0, 0.05] },
  );
  observer.observe(canvas);

  const onResize = () => measure();
  window.addEventListener('resize', onResize, { passive: true });

  function animate(time: number) {
    if (disposed) {
      raf = 0;
      return;
    }
    raf = 0;

    // Converge on arrival, then come apart again as the hero scrolls away.
    const introT = introStart ? clamp((time - introStart) / 2000) : 0;
    const intro = 1 - Math.pow(1 - introT, 3);
    const scrolled = clamp(window.scrollY / heroHeight);
    const assemble = intro * (1 - scrolled * 0.92);
    const fade = 1 - clamp((scrolled - 0.55) / 0.45);

    if (renderer && visible) renderer.render(time, assemble, fade);
    // Once settled and unscrolled there is nothing left to animate, so stop asking for
    // frames rather than redrawing 140k identical points forever.
    const settling = introT < 1 || scrolled > 0.001;
    if (visible && settling) raf = requestAnimationFrame(animate);
  }

  const onScroll = () => {
    if (visible && !raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  measure();

  if (!capable) {
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }

  init()
    .then((r) => {
      if (disposed) return;
      renderer = r;
      canvas.classList.add('is-live');
      if (!introStart && visible) introStart = performance.now();
      if (!raf) raf = requestAnimationFrame(animate);
    })
    .catch((err) => {
      if (disposed) return;
      // Capability was reported optimistically off the context probe alone, so anything
      // that fails afterwards — a decode error, sampling, shader compilation — has to
      // hand the fallback back rather than leave an empty canvas.
      console.warn('Portrait particles unavailable. Using image fallback.', err);
      onCapable?.(false);
    });

  return () => {
    disposed = true;
    observer.disconnect();
    renderer?.dispose();
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
