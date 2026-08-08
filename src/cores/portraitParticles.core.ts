// /about — the portrait as a field of GPU points that follows the whole page.
//
// Three states, blended by scroll position:
//   hero     the assembled portrait, anchored to the hero's portrait box
//   band     a slim vertical DNA helix that travels down the page as you scroll
//   footer   the portrait again, much larger and dimmed, behind the contact block
//
// The canvas is a FIXED full-viewport layer, not a box inside the hero. That is what lets
// the cloud travel the length of the page: an absolutely positioned canvas would have to
// be as tall as the document (past the maximum renderbuffer size on a long page), and one
// confined to the hero would clip the streak the moment it left.
//
// Draws POINTS, not a full-screen quad — the homepage showcase and the /works stage are
// both quad shaders, so a third would read as the same trick a third time. Sampling is
// done on the CPU into static buffers rather than by vertex texture fetch, which is
// optional in WebGL1 (MAX_VERTEX_TEXTURE_IMAGE_UNITS may legitimately be 0).

export interface PortraitParticlesOptions {
  /** Fixed, full-viewport canvas. */
  canvas: HTMLCanvasElement;
  /** Element the assembled hero portrait is positioned and sized against. */
  anchor: HTMLElement;
  /** Portrait to sample. */
  src: string;
  /**
   * Whether the cloud can run, reported SYNCHRONOUSLY during mount and again with `false`
   * if setup later fails. Callers use it to decide whether the fallback <img> is shown at
   * all — see the note on ordering above mountPortraitParticles.
   */
  onCapable?: (capable: boolean) => void;
}

// Grid resolution across the image. Must be at least as fine as the cloud is drawn large
// or the points cannot tile and the portrait reads as noise. 420 across gives ~140k points
// after masking — cheap for a POINTS draw, and what makes the assembled face legible.
const SAMPLE = 420;

// The photograph is a full frame with a busy background — windows, a lamp, framed art — so
// no luminance threshold isolates the subject; it would keep the bright window and drop
// the dark suit. The whole frame is sampled and shaped by an ellipse instead.
const MASK_CENTRE = { x: 0.5, y: 0.47 };
const MASK_RADIUS = { x: 0.46, y: 0.54 };
const MASK_FEATHER = 0.86;

/**
 * Height of the hero portrait as a fraction of its anchor box. Over 1 on purpose: the box
 * only reserves the hero's grid column, and the canvas is a full-viewport layer, so the
 * portrait is free to overflow it. At 0.93 it sat well inside the column and read small.
 */
const PORTRAIT_FILL = 1.2;
/** Height of the footer portrait as a fraction of the viewport — deliberately oversized. */
const WATERMARK_FILL = 1.15;

// Scroll windows, as a fraction of total page scroll.
const HERO_OUT = { from: 0.02, to: 0.14 }; // portrait -> streak
const FOOT_IN = { from: 0.78, to: 0.97 }; // streak -> watermark

// Alpha per state. The helix and the watermark both sit behind live copy, so neither runs
// at full strength — though the helix is slim and offset to one side, so it can carry more
// presence than a full-width band could.
const BAND_ALPHA = 0.6;
const WATERMARK_ALPHA = 0.32;

interface State {
  wHero: number;
  wFoot: number;
  bandShift: number;
  travel: number;
  alpha: number;
}

// Capability is settled before this function returns, not when the image finishes loading.
// That ordering matters: the fallback <img> used to be visible by default and hidden only
// once the cloud was ready, so arriving showed the finished photograph, blanked it, and
// only then converged — giving the reveal away before it happened.
export function mountPortraitParticles({
  canvas,
  anchor,
  src,
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

  // Cached layout, so no frame reads the DOM.
  let viewW = window.innerWidth;
  let viewH = window.innerHeight;
  let scrollSpan = 1;
  let anchorTopDoc = 0;
  let anchorLeft = 0;
  let anchorW = 1;
  let anchorH = 1;

  // Both checks are synchronous, so the answer is known immediately. Only the image load
  // is async, and it is the same file the fallback <img> already requested.
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
    scrollSpan = Math.max(1, document.documentElement.scrollHeight - viewH);
    const r = anchor.getBoundingClientRect();
    anchorTopDoc = r.top + window.scrollY;
    anchorLeft = r.left;
    anchorW = Math.max(1, r.width);
    anchorH = Math.max(1, r.height);
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
        // TWO independent randoms, not one. Deriving the band's vertical jitter from
        // the same value that sets its x makes the jitter a function of x, so the
        // streak repeats itself ~91 times across its width and reads as a comb.
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
    attribute vec4 a_color;
    attribute vec2 a_seed;

    uniform vec2 u_heroAnchor;
    uniform float u_heroScale;
    uniform vec2 u_footAnchor;
    uniform float u_footScale;
    uniform float u_bandShift;
    uniform float u_travel;
    uniform float u_wHero;
    uniform float u_wFoot;
    uniform float u_time;
    uniform float u_aspect;
    uniform float u_pointScale;

    varying vec4 v_color;

    const float PI = 3.14159265;
    // Strand swing, relative to viewport HEIGHT. Slim on purpose — this is a ribbon
    // running down the page, not a structure spanning it.
    const float HELIX_AMP = 0.30;
    // Rungs are snapped onto this many discrete positions along the axis. Left continuous
    // they spread evenly between the strands and read as a faint sheet rather than a
    // ladder — quantising the axis is what turns them into bars.
    const float RUNGS = 30.0;

    // The portrait laid out around an anchor, at a height given in clip units. Dividing x
    // by the aspect is what keeps the face square on a wide viewport.
    vec2 portraitAt(vec2 anchorPos, float scale) {
      return anchorPos + vec2(a_base.x * scale / u_aspect, a_base.y * scale);
    }

    void main() {
      // The expanded state is a LINE, not a cloud: seed spreads points along x, well past
      // both edges, with only a shallow vertical spread. A faint echo of the portrait's
      // own y keeps the streak from reading as uniform noise.
      // ---- Expanded state: a DNA double helix laid on its side ----
      // Axis runs horizontally; the strands swing the full height of the viewport, so the
      // structure is top-to-bottom while the sequence reads left-to-right.
      //
      // Roles come from seed.y, split into three bands. Deliberately NOT derived from
      // seed.x: that value sets a point's position ALONG the axis, so anything derived
      // from it would be constant for every point sharing an x — a rung would collapse to
      // a single dot instead of a bar.
      float role = a_seed.y;
      float isRung = step(0.78, role);
      float isStrandB = step(0.39, role) * (1.0 - isRung);

      // Strand points sit anywhere along the axis; rung points snap to the nearest of
      // RUNGS discrete stations, which is what makes them bars instead of a wash.
      float axis = a_seed.x;
      float snapped = (floor(axis * RUNGS) + 0.5) / RUNGS;
      // The axis runs VERTICALLY, so travel moves the helix down the screen with scroll.
      float ay = (mix(axis, snapped, isRung) * 2.0 - 1.0) * 1.4 + u_travel;
      float ang = ay * 5.5 + u_time * 0.35;
      float off = isStrandB * PI;

      // Swing is horizontal now. Divided by the aspect so the helix keeps the same
      // proportions on any viewport — measured against height, an amplitude in clip x
      // would otherwise stretch wider the wider the window gets.
      float xA = HELIX_AMP * sin(ang) / u_aspect;
      float xB = HELIX_AMP * sin(ang + PI) / u_aspect;
      // Position along a rung, remapped from the rung's own slice of the role range.
      float rungT = (role - 0.78) / 0.22;

      float ax = mix(HELIX_AMP * sin(ang + off) / u_aspect, mix(xA, xB, rungT), isRung);
      // Strands carry some thickness; rungs stay tight so they read as bars.
      ax += (fract(role * 91.0) - 0.5) * 0.05 / u_aspect * (1.0 - isRung * 0.8);

      // Depth around the axis. Without it both strands draw identically and the helix
      // flattens into a plain sine wave — this is what makes one strand pass behind.
      float z = mix(cos(ang + off), mix(cos(ang), cos(ang + PI), rungT), isRung);
      float depth = 0.42 + 0.58 * (z * 0.5 + 0.5);

      vec2 band = vec2(u_bandShift + ax, ay);

      vec2 p = mix(band, portraitAt(u_heroAnchor, u_heroScale), u_wHero);
      p = mix(p, portraitAt(u_footAnchor, u_footScale), u_wFoot);

      // How much of the helix is showing — depth shading applies only to it, never to the
      // assembled portrait or the watermark.
      float bandW = (1.0 - u_wHero) * (1.0 - u_wFoot);

      gl_Position = vec4(p, 0.0, 1.0);
      // Points grow with the watermark so the larger portrait stays as dense as the hero,
      // and shrink slightly on the far side of the helix.
      gl_PointSize = u_pointScale
        * mix(1.0, u_footScale / max(u_heroScale, 0.001), u_wFoot)
        * mix(1.0, 0.7 + 0.5 * depth, bandW);
      v_color = vec4(a_color.rgb, a_color.a * mix(1.0, depth, bandW));
    }
  `;

  const FRAG = `
    precision mediump float;
    varying vec4 v_color;
    uniform float u_alpha;

    void main() {
      // Round, and near-solid: feather only the outermost rim. Fading to the centre meant
      // no point reached full opacity and the portrait stayed a haze.
      vec2 c = gl_PointCoord - 0.5;
      float d = dot(c, c);
      if (d > 0.25) discard;
      gl_FragColor = vec4(v_color.rgb, smoothstep(0.25, 0.19, d) * v_color.a * u_alpha);
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
    bind(pts.color, 'a_color', 4);
    bind(pts.seed, 'a_seed', 2);

    const u = {
      heroAnchor: gl.getUniformLocation(program, 'u_heroAnchor'),
      heroScale: gl.getUniformLocation(program, 'u_heroScale'),
      footAnchor: gl.getUniformLocation(program, 'u_footAnchor'),
      footScale: gl.getUniformLocation(program, 'u_footScale'),
      bandShift: gl.getUniformLocation(program, 'u_bandShift'),
      travel: gl.getUniformLocation(program, 'u_travel'),
      wHero: gl.getUniformLocation(program, 'u_wHero'),
      wFoot: gl.getUniformLocation(program, 'u_wFoot'),
      time: gl.getUniformLocation(program, 'u_time'),
      aspect: gl.getUniformLocation(program, 'u_aspect'),
      pointScale: gl.getUniformLocation(program, 'u_pointScale'),
      alpha: gl.getUniformLocation(program, 'u_alpha'),
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

    function render(time: number, s: State) {
      const { h, aspect } = resize();
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(program);

      // Hero portrait: centred on the anchor box, in clip units, following page scroll.
      const cx = anchorLeft + anchorW / 2;
      const cy = anchorTopDoc + anchorH / 2 - window.scrollY;
      // Capped at 88% of the viewport height so a tall column on a short screen cannot
      // push the portrait past the top and bottom edges.
      const heroPx = Math.min(
        PORTRAIT_FILL * Math.min(anchorW / pts.imgAspect, anchorH),
        0.88 * viewH,
      );
      const heroScale = (2 * heroPx) / viewH;

      gl!.uniform2f(u.heroAnchor, (cx / viewW) * 2 - 1, 1 - (cy / viewH) * 2);
      gl!.uniform1f(u.heroScale, heroScale);
      gl!.uniform2f(u.footAnchor, 0, -0.04);
      gl!.uniform1f(u.footScale, 2 * WATERMARK_FILL);
      gl!.uniform1f(u.bandShift, s.bandShift);
      gl!.uniform1f(u.travel, s.travel);
      gl!.uniform1f(u.wHero, s.wHero);
      gl!.uniform1f(u.wFoot, s.wFoot);
      gl!.uniform1f(u.time, time * 0.001);
      gl!.uniform1f(u.aspect, aspect);
      gl!.uniform1f(u.alpha, s.alpha);

      // Size each point to the spacing it must cover at hero scale: the portrait spans
      // (heroScale / 2) of the canvas vertically across sampleH rows. 1.8x closes the
      // interstices — circles on a square grid need 1.41x just to touch at the diagonals,
      // and these have soft rims.
      const spacing = ((heroScale / 2) * h) / pts.sampleH;
      gl!.uniform1f(u.pointScale, Math.max(1.5, spacing * 1.8));

      gl!.drawArrays(gl!.POINTS, 0, pts.count);
    }

    return { render };
  }

  let renderer: { render: (t: number, s: State) => void } | null = null;

  const onResize = () => {
    measure();
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('resize', onResize, { passive: true });

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Images and fonts settling change the page height and the anchor offset well after
  // mount, so re-measure on layout changes rather than on every scroll event.
  const layoutObserver = new ResizeObserver(() => {
    measure();
    if (!raf) raf = requestAnimationFrame(animate);
  });
  layoutObserver.observe(document.body);
  layoutObserver.observe(anchor);

  function animate(time: number) {
    if (disposed) {
      raf = 0;
      return;
    }
    raf = 0;

    const t = clamp(window.scrollY / scrollSpan);
    const introT = introStart ? clamp((time - introStart) / 2000) : 0;
    const intro = 1 - Math.pow(1 - introT, 3);

    // Assembled in the hero at the top, gone once the hero has scrolled away, gathered
    // again into the watermark at the bottom.
    const wHero = intro * (1 - smoothstep(HERO_OUT.from, HERO_OUT.to, t));
    const wFoot = smoothstep(FOOT_IN.from, FOOT_IN.to, t);

    const s: State = {
      wHero,
      wFoot,
      // The streak rides down the viewport as the page moves, then centres for the
      // watermark.
      // Held just right of centre so the helix clears the left-hand copy column.
      bandShift: 0.34 * (1 - wFoot),
      travel: (t - HERO_OUT.to) * 0.55,
      alpha:
        BAND_ALPHA +
        (1 - BAND_ALPHA) * wHero +
        (WATERMARK_ALPHA - BAND_ALPHA) * wFoot * (1 - wHero),
    };

    if (renderer) renderer.render(time, s);

    // Only the streak animates on its own; a settled portrait or watermark is static, so
    // stop asking for frames rather than redrawing 140k identical points forever.
    const drifting = wHero < 0.995 && wFoot < 0.995;
    if (introT < 1 || drifting) raf = requestAnimationFrame(animate);
  }

  measure();

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
      // failing afterwards — decode, sampling, shader compilation — has to hand the
      // fallback back rather than leave an empty canvas.
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
