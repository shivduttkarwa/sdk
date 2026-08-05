// Verbatim port of the original initHeroBlob IIFE (script.js lines 1023–1306): a raw-WebGL
// hero shader that renders a smoke/fbm blob, drives the #heroNameRevealed CSS mask-image,
// and runs GSAP smoke tweens. Every shader byte, number, draw call, listener, and tween is
// preserved. The ONLY additions vs the original are the tracked handles (named listener
// consts, rAF id, `disposed` guard) + the returned disposer. GSAP is imported from the
// centralized setup instead of the CDN global `window.gsap`.

import { gsap } from '@/lib/gsapSetup';

export function mountHeroBlob(): () => void {
  if (window.matchMedia('(max-width: 768px)').matches) return () => {};
  const hero   = document.getElementById('home');
  const canvas = document.getElementById('hero-blob-canvas') as HTMLCanvasElement | null;
  if (!hero || !canvas) return () => {};
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: 'low-power' }) as WebGLRenderingContext | null;
  if (!gl) return () => {};

  const VS = `
    attribute vec2 a_pos;
    varying   vec2 v_uv;
    void main() {
      v_uv        = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }`;

  const FS = `
    precision highp float;
    uniform sampler2D u_bg;
    uniform sampler2D u_portrait;
    uniform sampler2D u_portrait2;
    uniform float     u_portAR2;
    uniform vec2      u_mouse;
    uniform float     u_time;
    uniform float     u_radius;
    uniform vec2      u_res;
    uniform float     u_portW;
    uniform float     u_portX;
    uniform float     u_portY;
    uniform float     u_portH;
    uniform float     u_portAR;
    uniform float     u_smoke;
    uniform float     u_opacity;
    uniform float     u_baseAlpha;
    varying vec2      v_uv;

    float rand(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(rand(i), rand(i+vec2(1,0)), f.x),
                 mix(rand(i+vec2(0,1)), rand(i+vec2(1,1)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }

    void main() {
      vec2 uv = v_uv;
      float ar   = u_res.x / u_res.y;
      vec2  d    = (uv - u_mouse) * vec2(ar, 1.0);
      float dist = length(d);

      float smokeNoise = 0.09 + u_smoke * 0.26;
      float n       = fbm(d * 6.0 + u_time * 0.35) * smokeNoise;
      float bDist   = dist + n;
      float r       = u_radius + u_smoke * 0.22;
      float edgeSz  = 0.025 + u_smoke * 0.06;
      float mask    = 1.0 - smoothstep(r - edgeSz, r + edgeSz, bDist);

      float pw    = max(u_portW, 0.001);
      // The panel is now bounded vertically too (u_portY/u_portH) instead of running the
      // full canvas height. That is what sets the subject's scale: the image's full height
      // maps onto the panel's height, so a shorter panel renders a smaller person.
      float ph    = max(u_portH, 0.001);
      float sAR   = (pw * u_res.x) / (ph * u_res.y);
      float ratio = max(u_portAR, 0.001) / sAR;
      // u_portX / u_portY are the panel's left and bottom edges, so it can sit away from
      // the canvas edges instead of being pinned to them.
      float su    = (uv.x - u_portX) / pw;
      float sv    = (uv.y - u_portY) / ph;
      float xScale = min(1.0, 1.0 / ratio);
      float yScale = min(1.0, ratio);
      vec2  pUV  = vec2(su * xScale + 0.5 * (1.0 - xScale),
                        sv * yScale + 0.5 * (1.0 - yScale));

      float edgeDist = abs(bDist - r);
      float ca = smoothstep(0.06, 0.0, edgeDist) * 0.010;
      vec3 port;
      port.r = texture2D(u_portrait, pUV + vec2( ca, 0.0)).r;
      port.g = texture2D(u_portrait, pUV                 ).g;
      port.b = texture2D(u_portrait, pUV - vec2( ca, 0.0)).b;

      float ratio2  = max(u_portAR2, 0.001) / sAR;
      float xScale2 = min(1.0, 1.0 / ratio2);
      float yScale2 = min(1.0, ratio2);
      vec2  pUV2 = vec2(su * xScale2 + 0.5 * (1.0 - xScale2),
                        sv * yScale2 + 0.5 * (1.0 - yScale2));
      vec3 port2 = texture2D(u_portrait2, pUV2).rgb;
      port = mix(port, port2, mask);

      // Feathered on BOTH sides now. It used to fade only on the right because the left
      // was flush with the canvas edge; once the strip moves inward a hard left edge would
      // show as a vertical seam. Kept narrow (4% of the strip) so the photo reads as an
      // image with visible left and right edges rather than dissolving into the gradient.
      // Superelliptical falloff rather than a rectangle. A rectangular mask always shows
      // its straight sides and corners no matter how wide the feather is — widen it and
      // the photo dissolves, narrow it and you get the hard cut. A superellipse has no
      // corners and curves away on every side, so the panel melts into the gradient while
      // its centre stays at full strength.
      //   EXP    3.0 = close to rectangular (keeps most of the photo). Lower = more oval.
      //   FADE0  where the falloff begins, as a fraction of the half-extent.
      float x0 = u_portX;
      float y0 = u_portY;
      vec2 pc = vec2((uv.x - (x0 + pw * 0.5)) / (pw * 0.5),
                     (uv.y - (y0 + ph * 0.5)) / (ph * 0.5));
      vec2 q  = max(abs(pc), vec2(1e-4));
      float sd = pow(pow(q.x, 3.0) + pow(q.y, 3.0), 0.3333333);
      float inStrip = 1.0 - smoothstep(0.62, 1.03, sd);
      vec3 bgBase = texture2D(u_bg, uv).rgb * 0.88;
      vec3 inner = mix(bgBase, port, inStrip * 1.0);
      vec3 col   = inner * mask;

      float glow = exp(-edgeDist * 36.0) * 0.5;
      col += vec3(0.62, 0.14, 0.28) * glow * 0.12;
      col += vec3(0.36, 0.06, 0.18) * glow * 0.07;

      float grain = (rand(uv * 540.0 + fract(u_time * 0.07)) - 0.5) * 0.042;
      col += grain;

      vec2 vc  = uv * 2.0 - 1.0;
      col *= 1.0 - dot(vc, vc) * 0.32;

      vec2 gradDir = normalize(vec2(0.94, -0.342));
      float g = clamp(dot(uv - vec2(0.5), gradDir) + 0.5, 0.0, 1.0);
      float gs = smoothstep(0.0, 1.0, g);
      float redFocus = smoothstep(0.62, 0.0, distance(uv, vec2(0.16, 0.12)));
      float coolRim = smoothstep(0.35, 1.10, distance(uv, vec2(0.88, 0.82)));

      vec3 ink     = vec3(6.0, 4.0, 14.0) / 255.0;
      vec3 violet  = vec3(17.0, 8.0, 28.0) / 255.0;
      vec3 steel   = vec3(10.0, 12.0, 26.0) / 255.0;
      vec3 crimson = vec3(68.0, 14.0, 24.0) / 255.0;
      vec3 coolInk = vec3(14.0, 14.0, 34.0) / 255.0;

      vec3 grad = mix(ink, violet, smoothstep(0.05, 0.72, gs));
      grad = mix(grad, steel, smoothstep(0.58, 1.00, gs));
      grad = mix(grad, crimson, redFocus * 0.52);
      grad = mix(grad, coolInk, coolRim * 0.28);

      // How strongly the resting portrait sits over the background. Was 0.62, which mixed
      // nearly 40% of the gradient back over the photo and left it washed out.
      const float portraitAmbient = 0.84;
      vec3 baseWithPortrait = mix(bgBase, port, inStrip * portraitAmbient);
      float gradOverlay = mix(u_baseAlpha, u_baseAlpha * 0.25, inStrip);
      vec3 shadedBase = mix(baseWithPortrait, grad, gradOverlay);
      float revealAlpha = clamp(mask + glow * 0.55, 0.0, 1.0) * u_opacity;
      vec3 revealColor = clamp(col, 0.0, 1.0);
      vec3 finalColor = mix(shadedBase, revealColor, revealAlpha);
      gl_FragColor = vec4(finalColor, 1.0);
    }`;

  function mkShader(type: number, src: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src); gl!.compileShader(s);
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS))
      console.error('[blob]', gl!.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram()!;
  gl.attachShader(prog, mkShader(gl.VERTEX_SHADER,   VS));
  gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog); gl.useProgram(prog);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uBg      = gl.getUniformLocation(prog, 'u_bg');
  const uPort    = gl.getUniformLocation(prog, 'u_portrait');
  const uMouse   = gl.getUniformLocation(prog, 'u_mouse');
  const uTime    = gl.getUniformLocation(prog, 'u_time');
  const uRadius  = gl.getUniformLocation(prog, 'u_radius');
  const uRes     = gl.getUniformLocation(prog, 'u_res');
  const uPortW   = gl.getUniformLocation(prog, 'u_portW');
  const uPortX   = gl.getUniformLocation(prog, 'u_portX');
  const uPortY   = gl.getUniformLocation(prog, 'u_portY');
  const uPortH   = gl.getUniformLocation(prog, 'u_portH');
  const uPortAR  = gl.getUniformLocation(prog, 'u_portAR');
  gl.uniform1f(uPortAR, 1.0);
  const uPort2   = gl.getUniformLocation(prog, 'u_portrait2');
  gl.uniform1i(uPort2, 2);
  const uPortAR2 = gl.getUniformLocation(prog, 'u_portAR2');
  gl.uniform1f(uPortAR2, 1.0);
  const uSmoke   = gl.getUniformLocation(prog, 'u_smoke');
  const uOpacity = gl.getUniformLocation(prog, 'u_opacity');
  const uBaseAlpha = gl.getUniformLocation(prog, 'u_baseAlpha');
  const baseAlpha = 0.80;
  const anim     = { smoke: 1, opacity: 0 };

  function allocTex(unit: number) {
    gl!.activeTexture(gl!.TEXTURE0 + unit);
    const t = gl!.createTexture();
    gl!.bindTexture(gl!.TEXTURE_2D, t);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, 1, 1, 0,
                  gl!.RGBA, gl!.UNSIGNED_BYTE, new Uint8Array([5,5,10,255]));
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    return t;
  }
  const texBg    = allocTex(0);
  const texPort  = allocTex(1);
  const texPort2 = allocTex(2);
  gl.uniform1i(uBg,    0);
  gl.uniform1i(uPort,  1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  function loadBitmap(url: string, unit: number, tex: WebGLTexture | null, onLoad?: (w: number, h: number) => void) {
    fetch(url, { mode: 'cors' })
      .then(r => { if (!r.ok) throw new Error(r.status as unknown as string); return r.blob(); })
      .then(b  => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' }))
      .then(bmp => {
        gl!.activeTexture(gl!.TEXTURE0 + unit);
        gl!.bindTexture(gl!.TEXTURE_2D, tex);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, bmp);
        if (onLoad) onLoad(bmp.width, bmp.height);
        bmp.close();
      })
      .catch(e => console.warn('[blob] texture load failed:', url, e));
  }

  loadBitmap('./assets/hero-samurai.webp', 0, texBg);
  loadBitmap('./assets/shiv-3-bandana-v2.webp', 1, texPort,  (w, h) => gl!.uniform1f(uPortAR,  w / h));
  loadBitmap('./assets/shiv-1-v2.webp', 2, texPort2, (w, h) => gl!.uniform1f(uPortAR2, w / h));

  let mx = 0.15, my = 0.58;
  let smx = 0.15, smy = 0.58;

  const onMouseMove = (e: MouseEvent) => {
    if (!heroVisible) return;
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left)  / r.width;
    my = 1.0 - (e.clientY - r.top) / r.height;
  };
  document.addEventListener('mousemove', onMouseMove);

  // Where the portrait strip's CENTRE sits, as a fraction of hero width. The strip used to
  // be pinned to the left edge (its left edge was implicitly 0), which read as the portrait
  // being shoved into the corner. Raise this to push it further toward the middle; the hero
  // name is right-aligned and starts around 0.5, so much past ~0.32 will start to crowd it.
  const PORTRAIT_CENTER_X = 0.23;
  // Panel height as a fraction of hero height. This is the subject's scale dial: the
  // image's full height maps onto the panel, so 0.66 renders the person a third smaller
  // than the old full-bleed strip did. Lower = smaller.
  const PORTRAIT_HEIGHT = 0.82;
  // Vertical centre, measured from the TOP for readability (converted below — uv.y is
  // bottom-up in clip space).
  const PORTRAIT_CENTER_Y = 0.52;

  function resize() {
    canvas!.width  = hero!.clientWidth;
    canvas!.height = hero!.clientHeight;
    gl!.viewport(0, 0, canvas!.width, canvas!.height);
    const w = canvas!.width || 1;
    const vidW = Math.min(960, Math.max(320, w * 0.62));
    // Width is unchanged — still the leftover margin beside the centre reserve.
    const portW = (w - vidW) / 2 / w;
    gl!.uniform1f(uPortW, portW);
    gl!.uniform1f(uPortX, Math.max(0, PORTRAIT_CENTER_X - portW / 2));
    gl!.uniform1f(uPortH, PORTRAIT_HEIGHT);
    gl!.uniform1f(uPortY, 1 - PORTRAIT_CENTER_Y - PORTRAIT_HEIGHT / 2);
  }
  resize();
  window.addEventListener('resize', resize);

  const t0 = performance.now();
  const heroNameRevealed = document.getElementById('heroNameRevealed');
  let rafId = 0;
  let disposed = false;
  let heroVisible = true;
  function render() {
    if (disposed) return;
    if (!heroVisible) {
      rafId = 0;
      return;
    }
    smx += (mx - smx) * 0.08;
    smy += (my - smy) * 0.08;
    const t = (performance.now() - t0) / 1000;
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.uniform2f(uMouse,  smx, smy);
    gl!.uniform1f(uTime,   t);
    gl!.uniform1f(uRadius, 0.306);
    gl!.uniform2f(uRes,    canvas!.width, canvas!.height);
    gl!.uniform1f(uSmoke,   anim.smoke);
    gl!.uniform1f(uOpacity, anim.opacity);
    gl!.uniform1f(uBaseAlpha, baseAlpha);
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);

    if (heroNameRevealed) {
      const cx     = smx * canvas!.width;
      const cy     = (1.0 - smy) * canvas!.height;
      const rPx    = (0.281 + anim.smoke * 0.117) * canvas!.height;
      const edgePx = (0.025 + anim.smoke * 0.06)  * canvas!.height;
      const rOuter = rPx + edgePx;
      const rInner = Math.max(0, rPx - edgePx);
      const pct    = rOuter > 0 ? (rInner / rOuter * 100).toFixed(1) : '0';
      const grad   = rOuter < 1
        ? 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 100%)'
        : `radial-gradient(circle ${rOuter}px at ${cx}px ${cy}px, black ${pct}%, transparent 100%)`;
      heroNameRevealed.style.webkitMaskImage = grad;
      heroNameRevealed.style.maskImage       = grad;
    }

    rafId = requestAnimationFrame(render);
  }
  render();

  // Pause the render loop while the hero is off-screen — a permanently running
  // full-viewport fbm shader competes with everything else during scroll.
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      heroVisible = entries.some((entry) => entry.isIntersecting);
      if (heroVisible && !rafId && !disposed) rafId = requestAnimationFrame(render);
    },
    { rootMargin: '120px 0px' },
  );
  visibilityObserver.observe(hero);

  if (gsap) {
    gsap.to(anim, { smoke: 0, opacity: 1, duration: 1.1, delay: 0.5, ease: 'power3.out' });
  }

  let smokeOut = false;
  const onScroll = () => {
    const scrolled = window.scrollY > 5;
    if (scrolled && !smokeOut) {
      smokeOut = true;
      if (gsap) {
        gsap.killTweensOf(anim);
        gsap.to(anim, { smoke: 1, opacity: 0, duration: 0.45, ease: 'power2.in' });
      }
    } else if (!scrolled && smokeOut) {
      smokeOut = false;
      if (gsap) {
        gsap.killTweensOf(anim);
        gsap.to(anim, { smoke: 0, opacity: 1, duration: 0.75, ease: 'power3.out' });
      }
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    disposed = true;
    if (rafId) cancelAnimationFrame(rafId);
    visibilityObserver.disconnect();
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    gsap.killTweensOf(anim);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
