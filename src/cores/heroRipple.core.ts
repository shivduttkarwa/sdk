// /contact hero — the backdrop photograph seen through water.
//
// A canvas sized to the hero draws the same image and the same scrim the CSS backdrop
// draws, so at rest it is indistinguishable from the other page heroes. The difference is
// that the pointer and every click drop rings that spread across it, and the photograph
// refracts along their slope.
//
// The waves are ANALYTIC, not simulated. A height field could be integrated on ping-pong
// framebuffers, but that needs float textures — an optional WebGL1 extension — or
// byte-packing to work everywhere, plus state to resize, clear and recover on context
// loss. Here the CPU keeps a short list of live drops and the shader sums their wavefronts
// each frame: no extensions, no state, and the cost scales with the number of rings rather
// than the size of the surface.
//
// Each drop contributes its height AND the analytic gradient of that height in one loop,
// so the refraction vector is free. Finite differences would have meant evaluating the
// whole field three times per pixel.

export interface HeroRippleOptions {
  /** Canvas filling the hero section. */
  canvas: HTMLCanvasElement;
  /** The hero backdrop image — the same file the CSS fallback uses. */
  src: string;
  /** Called with false if the effect cannot run, so the CSS backdrop stays visible. */
  onReady?: (live: boolean) => void;
}

const MAX_DROPS = 10;

const WAVE = {
  /** Ring speed, in hero heights per second. */
  speed: 0.32,
  /** Radians per unit distance — the ripple's wavelength. */
  frequency: 44,
  /** How tightly the oscillation clings to the front. Higher = a thinner ring. */
  tightness: 12,
  /** Seconds a ring takes to fade out. */
  life: 2.6,
};

/** Pointer travel, in hero heights, between trail drops. */
const TRAIL_STEP = 0.08;
/** Seconds between the idle drops that keep the surface alive when nothing is happening. */
const IDLE_EVERY = 2.4;

export function mountHeroRipple({ canvas, src, onReady }: HeroRippleOptions) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let raf = 0;
  let disposed = false;
  let visible = true;
  let width = 1;
  let height = 1;
  let lastIdle = 0;
  let lastX = 0;
  let lastY = 0;
  let hasLast = false;

  // x, y (0..1 across the hero), birth time, force.
  const drops = new Float32Array(MAX_DROPS * 4);
  let nextDrop = 0;

  const glRef = reduceMotion
    ? null
    : (canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null);
  const capable = !!glRef;
  onReady?.(capable);

  function addDrop(x: number, y: number, force: number, now: number) {
    const i = nextDrop * 4;
    drops[i] = x;
    drops[i + 1] = y;
    drops[i + 2] = now;
    drops[i + 3] = force;
    nextDrop = (nextDrop + 1) % MAX_DROPS;
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

  const VERT = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const FRAG = `
    precision highp float;

    uniform vec4 u_drops[${MAX_DROPS}];
    uniform float u_time;
    uniform float u_aspect;
    uniform float u_imgAspect;
    uniform sampler2D u_image;

    varying vec2 v_uv;

    const float SPEED = ${WAVE.speed.toFixed(3)};
    const float FREQ = ${WAVE.frequency.toFixed(1)};
    const float TIGHT = ${WAVE.tightness.toFixed(1)};
    const float LIFE = ${WAVE.life.toFixed(2)};

    // Cover-fit, matching CSS background-size: cover.
    vec2 fitCover(vec2 uv) {
      vec2 s = vec2(1.0);
      if (u_aspect > u_imgAspect) s.y = u_imgAspect / u_aspect;
      else s.x = u_aspect / u_imgAspect;
      return clamp((uv - 0.5) * s + 0.5, 0.0, 1.0);
    }

    // Four-stop ramp, so the scrim below can reproduce the CSS gradients stop for stop.
    float ramp(float t, float a, float b, float c, float d, float p1, float p2, float p3) {
      if (t < p1) return mix(a, b, t / max(p1, 0.0001));
      if (t < p2) return mix(b, c, (t - p1) / max(p2 - p1, 0.0001));
      if (t < p3) return mix(c, d, (t - p2) / max(p3 - p2, 0.0001));
      return d;
    }

    void main() {
      // Surface space: y spans 0..1, x scaled by aspect so rings stay circular.
      vec2 p = vec2(v_uv.x * u_aspect, v_uv.y);

      float h = 0.0;
      vec2 grad = vec2(0.0);

      for (int i = 0; i < ${MAX_DROPS}; i++) {
        vec4 drop = u_drops[i];
        if (drop.w <= 0.0) continue;

        float age = u_time - drop.z;
        // An envelope rather than a hard cut: a ring vanishing on a frame boundary pops.
        float env = drop.w * max(0.0, 1.0 - age / LIFE);
        if (env <= 0.0) continue;

        vec2 d = p - vec2(drop.x * u_aspect, drop.y);
        float r = max(length(d), 0.0001);
        float front = r - age * SPEED;
        float falloff = exp(-abs(front) * TIGHT);
        float osc = sin(front * FREQ);

        h += osc * falloff * env;
        // Analytic derivative of osc * falloff w.r.t. r, projected onto d/r.
        float dfdr = (FREQ * cos(front * FREQ) - TIGHT * sign(front) * osc) * falloff;
        grad += (d / r) * dfdr * env;
      }

      // The gradient carries a factor of FREQ by construction, so every coefficient taken
      // from it has to be small — this is where an unscaled value blows the whole frame
      // out to specular.
      vec2 refracted = fitCover(v_uv - grad * 0.00055);
      vec3 col = texture2D(u_image, refracted).rgb;

      // Light catching the crests, so the water reads as a surface and not as a smear.
      vec3 n = normalize(vec3(-grad * 0.010, 1.0));
      float spec = pow(max(dot(n, normalize(vec3(-0.3, 0.5, 0.8))), 0.0), 55.0);
      col += vec3(1.0, 0.72, 0.68) * spec * 0.20;
      col += vec3(0.55, 0.20, 0.24) * clamp(abs(h) * 0.045, 0.0, 0.12);

      // The same scrim the CSS backdrop paints, so at rest this is indistinguishable from
      // the other page heroes: heavy down the left under the copy, near-clear at 68%
      // across, dark again at the bottom where the hero resolves into the next section.
      vec3 ink = vec3(0.0196, 0.0118, 0.0392);
      float across = clamp(v_uv.x + (1.0 - v_uv.y) * 0.18, 0.0, 1.0);
      col = mix(col, ink, ramp(across, 0.92, 0.70, 0.28, 0.50, 0.34, 0.68, 1.0));
      float down = 1.0 - v_uv.y;
      col = mix(col, ink, ramp(down, 0.50, 0.0, 0.0, 0.88, 0.34, 0.60, 1.0));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  async function init() {
    const gl = glRef;
    if (!gl) throw new Error('WebGL unavailable');

    const img = await loadImage();
    if (disposed) throw new Error('Disposed during image load');

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed');
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    const u = {
      drops: gl.getUniformLocation(program, 'u_drops'),
      time: gl.getUniformLocation(program, 'u_time'),
      aspect: gl.getUniformLocation(program, 'u_aspect'),
      imgAspect: gl.getUniformLocation(program, 'u_imgAspect'),
      image: gl.getUniformLocation(program, 'u_image'),
    };
    gl.uniform1i(u.image, 0);
    gl.uniform1f(u.imgAspect, img.width / Math.max(1, img.height));

    function render(now: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(2, Math.floor(width * dpr));
      const h = Math.max(2, Math.floor(height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl!.viewport(0, 0, w, h);
      }
      gl!.useProgram(program);
      gl!.uniform4fv(u.drops, drops);
      gl!.uniform1f(u.time, now);
      gl!.uniform1f(u.aspect, width / Math.max(1, height));
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }

    return { render };
  }

  let renderer: { render: (n: number) => void } | null = null;

  function measure() {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
  }

  const onResize = () => {
    measure();
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('resize', onResize, { passive: true });

  /** Pointer position within the hero, or null when it is outside. */
  function inside(event: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    const x = (event.clientX - r.left) / Math.max(1, r.width);
    const y = 1 - (event.clientY - r.top) / Math.max(1, r.height);
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    return { x, y };
  }

  const onPointerMove = (event: PointerEvent) => {
    const s = inside(event);
    if (!s) {
      hasLast = false;
      return;
    }
    const now = performance.now() / 1000;
    // Drop on DISTANCE travelled, not per event: pointermove fires far faster than rings
    // are worth spawning, and one per event spends the whole buffer in a single flick.
    if (!hasLast || Math.hypot(s.x - lastX, s.y - lastY) > TRAIL_STEP) {
      addDrop(s.x, s.y, hasLast ? 0.34 : 0.5, now);
      lastX = s.x;
      lastY = s.y;
      hasLast = true;
    }
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const onPointerDown = (event: PointerEvent) => {
    const s = inside(event);
    if (!s) return;
    addDrop(s.x, s.y, 1.0, performance.now() / 1000);
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('pointerdown', onPointerDown, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible && !raf) raf = requestAnimationFrame(animate);
    },
    { threshold: [0, 0.01] },
  );
  observer.observe(canvas);

  function animate() {
    if (disposed) {
      raf = 0;
      return;
    }
    raf = 0;
    const now = performance.now() / 1000;

    if (now - lastIdle > IDLE_EVERY) {
      lastIdle = now;
      addDrop(0.45 + Math.random() * 0.45, 0.2 + Math.random() * 0.6, 0.22, now);
    }

    if (renderer && visible) renderer.render(now);

    // Keep drawing while any ring is alive. A still hero is a static image, so there is
    // nothing to redraw and the loop stops until the next drop.
    let alive = false;
    for (let i = 0; i < MAX_DROPS; i++) {
      if (drops[i * 4 + 3] > 0 && now - drops[i * 4 + 2] < WAVE.life) alive = true;
    }
    if (visible && alive) raf = requestAnimationFrame(animate);
  }

  measure();

  if (!capable) {
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }

  init()
    .then((r) => {
      if (disposed) return;
      renderer = r;
      measure();
      canvas.classList.add('is-live');
      // One opening ring, so the surface introduces itself on arrival.
      addDrop(0.62, 0.55, 0.85, performance.now() / 1000);
      if (!raf) raf = requestAnimationFrame(animate);
    })
    .catch((err) => {
      if (disposed) return;
      // The CSS backdrop is already painting underneath, so this degrades to exactly the
      // same hero the other pages have.
      console.warn('Hero ripple unavailable. Using the static backdrop.', err);
      onReady?.(false);
    });

  return () => {
    disposed = true;
    observer.disconnect();
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerdown', onPointerDown);
    try {
      glRef?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      /* already gone */
    }
  };
}
