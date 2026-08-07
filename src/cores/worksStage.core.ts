// /works index stage — a full-bleed WebGL panel where one project cover morphs into the
// next as you scroll, driven by a ripple that expands from the centre of the frame.
//
// The scroll/rAF scaffolding is deliberately the same shape as selectedWork.core (cached
// runway metrics so no frame forces layout, IntersectionObserver gating, lerped progress,
// pointer parallax, image fallback, full disposal). The TRANSITION is not: the homepage
// showcase burns between slides along an fbm "passage", while this displaces both images
// along an expanding wavefront with a chromatic fringe. The two pages show the same
// projects, so they must not read as the same effect.
//
// Text is not written from here. The core reports the active index through `onActive`
// (fired only when it actually changes, so React re-renders a handful of times per page,
// not per frame); per-frame values go straight to CSS custom properties.

export interface WorksStageOptions {
  /** Cover image per project, in the same order as the rendered fallback <img>s. */
  covers: string[];
  /** Called when the frontmost project changes. */
  onActive: (index: number) => void;
}

export function mountWorksStage({ covers, onActive }: WorksStageOptions): () => void {
  const runway = document.getElementById('sdk-works-runway');
  const stage = document.getElementById('sdk-works-stage');
  const canvas = document.getElementById('sdk-works-fx') as HTMLCanvasElement | null;
  const fallbackImgs = [...document.querySelectorAll('.works-stage__img')];

  if (!runway || !stage || !canvas || covers.length < 2) return () => {};

  const total = covers.length;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Document-space runway metrics, cached — the scroll and rAF paths never read layout.
  let runwayTop = 0;
  let runwayHeight = 1;
  let viewportH = window.innerHeight || document.documentElement.clientHeight;
  let targetProgress = 0;
  let smoothProgress = 0;
  let stageVisible = false;
  let renderer: { render: (time: number, p: number) => void } | null = null;
  let raf = 0;
  let disposed = false;
  let glResize: (() => void) | undefined;
  let glCanvasObserver: ResizeObserver | undefined;
  let glRef: WebGLRenderingContext | undefined;
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, thover: 0 };

  function measure() {
    const rect = runway!.getBoundingClientRect();
    runwayTop = rect.top + window.scrollY;
    runwayHeight = runway!.offsetHeight;
    viewportH = window.innerHeight || document.documentElement.clientHeight;
  }

  function rawProgress() {
    const travel = Math.max(1, runwayHeight - viewportH);
    return (window.scrollY - runwayTop) / travel;
  }

  function getState(p: number) {
    const scaled = clamp(p) * (total - 1);
    let from = Math.floor(scaled);
    let to = Math.min(total - 1, from + 1);
    let mix = scaled - from;
    if (p >= 0.999) {
      from = total - 2;
      to = total - 1;
      mix = 1;
    }
    return { from, to, mix, active: mix < 0.5 ? from : to };
  }

  // Last-written values, so steady frames skip DOM writes entirely.
  let lastActive = -1;
  let lastProgressValue = '';

  function updateDom(p: number, raw: number) {
    const state = getState(p);

    const progressValue = clamp(raw).toFixed(4);
    if (progressValue !== lastProgressValue) {
      lastProgressValue = progressValue;
      stage!.style.setProperty('--progress', progressValue);
    }

    if (state.active !== lastActive) {
      lastActive = state.active;
      fallbackImgs.forEach((img, i) => img.classList.toggle('is-active', i === state.active));
      onActive(state.active);
    }
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed');
    }
    return shader;
  }

  function createProgram(gl: WebGLRenderingContext, vertex: string, fragment: string) {
    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed');
    }
    return program;
  }

  async function initWebGL() {
    if (reduceMotion) throw new Error('Reduced motion enabled');

    const gl = canvas!.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'low-power',
    }) as WebGLRenderingContext | null;
    if (!gl) throw new Error('WebGL unavailable');
    glRef = gl;

    const loaded = await Promise.all(covers.map(loadImage));
    // A route change while the covers load runs the disposer before anything below exists.
    if (disposed) throw new Error('Disposed during image load');

    const vertex = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Samplers are generated from the project count rather than hardcoded, so adding a
    // project to data/projects needs no shader edit. WebGL guarantees only 8 texture
    // units, so past 8 projects this needs an atlas or a two-texture ping-pong.
    const samplers = covers.map((_, i) => `uniform sampler2D u_tex${i};`).join('\n      ');
    const texBranches = covers
      .map((_, i) =>
        i === total - 1
          ? `        return texture2D(u_tex${i}, uv);`
          : `        if (id < ${i}.5) return texture2D(u_tex${i}, uv);`,
      )
      .join('\n');

    const fragment = `
      precision highp float;

      ${samplers}
      uniform float u_from;
      uniform float u_to;
      uniform float u_mix;
      uniform float u_time;
      uniform float u_aspect;
      uniform float u_imgAspect;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_hover;

      varying vec2 v_uv;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 r = mat2(1.62, 1.12, -1.12, 1.62);
        for (int i = 0; i < 3; i++) {
          v += a * noise(p);
          p = r * p + 17.0;
          a *= 0.55;
        }
        return v;
      }

      float smoother(float x) {
        x = clamp(x, 0.0, 1.0);
        return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
      }

      vec4 getTex(float id, vec2 uv) {
${texBranches}
      }

      // Cover-fit: fill the stage with the image, cropping the overflow axis.
      vec2 fitCover(vec2 uv) {
        vec2 s = vec2(1.0);
        if (u_aspect > u_imgAspect) {
          s.y = u_imgAspect / u_aspect;
        } else {
          s.x = u_aspect / u_imgAspect;
        }
        return clamp((uv - 0.5) * s + 0.5, 0.0, 1.0);
      }

      vec4 sampleImage(float id, vec2 uv) {
        return getTex(id, fitCover(uv));
      }

      vec4 finish(vec4 col, vec2 uv) {
        // Static grain — a time-shifted field reads as a shimmer crawling over the frame.
        float grain = hash(uv * u_resolution * 0.45);
        col.rgb += (grain - 0.5) * 0.045;

        float vig = smoothstep(1.2, 0.32, distance(uv, vec2(0.5)));
        col.rgb *= mix(0.62, 1.0, vig);
        return col;
      }

      void main() {
        vec2 uv = v_uv;
        float m = smoother(u_mix);

        // Aspect-corrected space centred on the stage.
        vec2 c = uv - 0.5;
        c.x *= u_aspect;
        float d = length(c);

        // A wavefront expanding from the centre. 1.5 clears the corners at m = 1.
        float front = m * 1.5;
        float ring = d - front;

        // Warp the ring off perfect-circle so it reads as liquid rather than as a UI wipe.
        ring += (fbm(uv * 2.6 + u_time * 0.05) - 0.5) * 0.12;

        // Ripple: a sine centred on the wavefront, decaying either side of it. The
        // envelope keeps the frame perfectly still at rest (m = 0 and m = 1).
        float envelope = smoothstep(0.0, 0.10, m) * (1.0 - smoothstep(0.90, 1.0, m));
        float wave = sin(ring * 38.0) * exp(-abs(ring) * 11.0) * envelope;

        vec2 dir = d > 0.0001 ? c / d : vec2(0.0, 0.0);
        vec2 disp = dir * wave * 0.075;

        // A soft lens that follows the cursor — the only motion when nothing is scrolling.
        vec2 mc = uv - u_mouse;
        mc.x *= u_aspect;
        float md = length(mc);
        vec2 lens = (md > 0.0001 ? mc / md : vec2(0.0)) * exp(-md * 4.5) * 0.02 * u_hover;

        vec2 uvA = uv + disp + lens;
        vec2 uvB = uv + disp * 0.55 + lens;

        // Chromatic split, strongest right at the wavefront.
        float fringe = exp(-abs(ring) * 9.0) * envelope * 0.007;
        vec4 a = sampleImage(u_from, uvA);
        vec4 b = vec4(
          sampleImage(u_to, uvB + dir * fringe).r,
          sampleImage(u_to, uvB).g,
          sampleImage(u_to, uvB - dir * fringe).b,
          1.0
        );

        float mask = smoothstep(0.06, -0.06, ring);
        vec4 col = mix(a, b, mask);

        // Accent light riding the crest.
        float edge = exp(-abs(ring) * 13.0) * envelope;
        col.rgb += vec3(0.88, 0.25, 0.31) * pow(edge, 1.5) * 0.6;
        col.rgb += vec3(1.0, 0.55, 0.4) * pow(edge, 4.0) * 0.35;

        col.a = 1.0;
        gl_FragColor = finish(col, uv);
      }
    `;

    const program = createProgram(gl, vertex, fragment);
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

    function makeTexture(img: HTMLImageElement, unit: number) {
      const tex = gl!.createTexture();
      gl!.activeTexture(gl!.TEXTURE0 + unit);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.pixelStorei(gl!.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img);
      return tex;
    }

    loaded.forEach((img, i) => makeTexture(img, i));
    for (let i = 0; i < total; i++) {
      gl.uniform1i(gl.getUniformLocation(program, 'u_tex' + i), i);
    }

    const first = loaded[0];
    const imgAspect = first && first.height ? first.width / first.height : 1.6;

    const uniforms = {
      from: gl.getUniformLocation(program, 'u_from'),
      to: gl.getUniformLocation(program, 'u_to'),
      mix: gl.getUniformLocation(program, 'u_mix'),
      time: gl.getUniformLocation(program, 'u_time'),
      aspect: gl.getUniformLocation(program, 'u_aspect'),
      imgAspect: gl.getUniformLocation(program, 'u_imgAspect'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      hover: gl.getUniformLocation(program, 'u_hover'),
    };

    gl.uniform1f(uniforms.imgAspect, imgAspect);

    // Canvas CSS size cached via ResizeObserver — resize() runs every frame and must not
    // call getBoundingClientRect.
    let cssWidth = canvas!.clientWidth;
    let cssHeight = canvas!.clientHeight;
    const canvasObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        cssWidth = entry.contentRect.width;
        cssHeight = entry.contentRect.height;
      }
    });
    canvasObserver.observe(canvas!);
    glCanvasObserver = canvasObserver;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const w = Math.max(2, Math.floor(cssWidth * dpr));
      const h = Math.max(2, Math.floor(cssHeight * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
      gl!.uniform2f(uniforms.resolution, canvas!.width, canvas!.height);
      gl!.uniform1f(uniforms.aspect, canvas!.width / Math.max(1, canvas!.height));
    }

    function render(time: number, p: number) {
      const state = getState(p);
      resize();
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(program);
      gl!.uniform1f(uniforms.from, state.from);
      gl!.uniform1f(uniforms.to, state.to);
      gl!.uniform1f(uniforms.mix, state.mix);
      gl!.uniform1f(uniforms.time, time * 0.001);
      gl!.uniform2f(uniforms.mouse, mouse.x, 1 - mouse.y);
      gl!.uniform1f(uniforms.hover, mouse.hover);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }

    window.addEventListener('resize', resize, { passive: true });
    stage!.classList.add('is-webgl');
    glResize = resize;
    return { render };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      stageVisible = entries.some((entry) => entry.isIntersecting);
      if (stageVisible && !raf) raf = requestAnimationFrame(animate);
    },
    { threshold: [0, 0.01], rootMargin: '120px 0px' },
  );
  observer.observe(runway);

  const onResize = () => {
    measure();
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('resize', onResize, { passive: true });

  const onScroll = () => {
    targetProgress = clamp(rawProgress());
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Late images and font swaps shift the runway's document offset after init — re-measure
  // on layout-size changes rather than on every scroll event.
  const layoutObserver = new ResizeObserver(() => {
    measure();
    targetProgress = clamp(rawProgress());
    if (!raf) raf = requestAnimationFrame(animate);
  });
  layoutObserver.observe(document.body);
  layoutObserver.observe(runway);

  const onPointerMove = (event: PointerEvent) => {
    if (!stageVisible) return;
    const rect = stage!.getBoundingClientRect();
    mouse.tx = clamp((event.clientX - rect.left) / Math.max(1, rect.width));
    mouse.ty = clamp((event.clientY - rect.top) / Math.max(1, rect.height));
    mouse.thover =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
        ? 1
        : 0;
    if (!raf) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  function animate(time: number) {
    if (disposed) {
      raf = 0;
      return;
    }
    raf = 0;
    const raw = rawProgress();
    targetProgress = clamp(raw);
    smoothProgress = lerp(smoothProgress, targetProgress, 0.12);
    mouse.x = lerp(mouse.x, mouse.tx, 0.12);
    mouse.y = lerp(mouse.y, mouse.ty, 0.12);
    mouse.hover = lerp(mouse.hover, mouse.thover, 0.08);
    updateDom(smoothProgress, raw);

    if (renderer && stageVisible) {
      renderer.render(time, smoothProgress);
      raf = requestAnimationFrame(animate);
    } else if (stageVisible || Math.abs(targetProgress - smoothProgress) > 0.0008) {
      raf = requestAnimationFrame(animate);
    }
  }

  measure();
  updateDom(0, rawProgress());

  initWebGL()
    .then((result) => {
      if (disposed) return;
      renderer = result;
      if (!raf) raf = requestAnimationFrame(animate);
    })
    .catch((err) => {
      if (disposed) return;
      // Not an error path worth shouting about: reduced motion and no-WebGL both land
      // here, and both are served correctly by the stacked <img> fallback.
      console.warn('Works stage WebGL unavailable. Using image fallback.', err);
      canvas!.style.display = 'none';
      if (!raf) raf = requestAnimationFrame(animate);
    });

  return () => {
    disposed = true;
    observer.disconnect();
    layoutObserver.disconnect();
    glCanvasObserver?.disconnect();
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointerMove);
    if (glResize) window.removeEventListener('resize', glResize);
    try {
      glRef?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      /* context already gone */
    }
  };
}
