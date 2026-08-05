// Raw-WebGL float-FBO fluid sim: a pointer wake writes dye into a velocity field, and the
// dye's alpha reveals artwork underneath. Extracted verbatim from the original
// `initStatsWater` IIFE (script.js 389–754) so it can drive more than one section — every
// shader byte, number, FBO, draw call and rAF cadence in the SOLVER is unchanged. What was
// hard-coded is now options: the host element, the reveal textures, the composite shader,
// and the sim grid. statsWater.core passes the original values, so the stats section
// behaves exactly as it always did.
//
// Desktop only by default. The wake is cursor-driven and has no touch equivalent (a finger
// is either scrolling or absent); a touch variant was built and tested on-device and
// dropped. Skipping the mount also spares phones a 25-iteration pressure solve per frame.

export interface FluidRevealHelpers {
  u1i: (p: unknown, n: string, v: number) => void;
  u1f: (p: unknown, n: string, v: number) => void;
  u2f: (p: unknown, n: string, x: number, y: number) => void;
  u3f: (p: unknown, n: string, x: number, y: number, z: number) => void;
  canvas: HTMLCanvasElement;
}

export interface FluidRevealOptions {
  /** Element the canvas is prepended into; the canvas fills it and defines the wake's UV space. */
  host: Element;
  /** Class applied to the generated canvas (positioning lives in CSS). */
  canvasClass: string;
  /** Reveal textures, bound to units 5+i and exposed to the composite shader as u_bg0..u_bgN.
   *  May be empty for composites that paint no imagery (e.g. an erasable veil). */
  images: string[];
  /** Composite fragment shader. Receives u_dye plus the u_bg* samplers. */
  renderFS: string;
  /** Sim grid. Keep the long axis higher-res. */
  sim: { w: number; h: number };
  /** Pointer listener target — defaults to `host`. Coordinates are always normalised
   *  against the CANVAS rect, so a larger listener area still maps correctly. */
  pointerEl?: Element | null;
  /** Gaussian splat radius; larger = broader wake. */
  splatRadius?: number;
  /** Extra uniforms for the composite shader, set once per frame. */
  setRenderUniforms?: (prog: unknown, h: FluidRevealHelpers) => void;
  /** Called once per texture as it decodes, with its natural size (for cover-fit math). */
  onImageLoad?: (index: number, width: number, height: number) => void;
}

export function mountFluidReveal(opts: FluidRevealOptions): () => void {
  if (window.matchMedia('(max-width: 900px)').matches) return () => {};

  const host = opts.host;
  if (!host) return () => {};

  const SIM_W = opts.sim.w;
  const SIM_H = opts.sim.h;

  const canvas = document.createElement('canvas');
  canvas.className = opts.canvasClass;
  host.prepend(canvas);

  // `gl` is typed `any` (via a WebGLRenderingContext cast) so the imperative GL
  // calls below stay noise-free while remaining byte-for-byte identical.
  const gl: any = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: 'low-power' }) as WebGLRenderingContext | null;
  if (!gl) { canvas.remove(); return () => {}; }

  if (!gl.getExtension('OES_texture_float')) { canvas.remove(); return () => {}; }
  gl.getExtension('OES_texture_float_linear');

  const VS = `attribute vec2 a_pos; varying vec2 v_uv;
    void main(){ v_uv=a_pos*.5+.5; gl_Position=vec4(a_pos,0.,1.); }`;

  const SPLAT_FS = `precision highp float;
    uniform sampler2D u_src;
    uniform vec2 u_point, u_aspect;
    uniform vec3 u_color;
    uniform float u_radius;
    varying vec2 v_uv;
    void main(){
      vec2 p = (v_uv - u_point) * u_aspect;
      float d = exp(-dot(p,p) / u_radius);
      gl_FragColor = vec4(texture2D(u_src, v_uv).rgb + u_color * d, 1.);
    }`;

  const ADVECT_FS = `precision highp float;
    uniform sampler2D u_velocity, u_quantity;
    uniform vec2 u_texelSize;
    uniform float u_dt, u_dissipation;
    varying vec2 v_uv;
    void main(){
      vec2 vel = texture2D(u_velocity, v_uv).xy;
      vec2 coord = v_uv - u_dt * vel * u_texelSize;
      gl_FragColor = u_dissipation * texture2D(u_quantity, coord);
    }`;

  const CURL_FS = `precision highp float;
    uniform sampler2D u_velocity;
    uniform vec2 u_texelSize;
    varying vec2 v_uv;
    void main(){
      float L = texture2D(u_velocity, v_uv - vec2(u_texelSize.x,0.)).y;
      float R = texture2D(u_velocity, v_uv + vec2(u_texelSize.x,0.)).y;
      float T = texture2D(u_velocity, v_uv + vec2(0.,u_texelSize.y)).x;
      float B = texture2D(u_velocity, v_uv - vec2(0.,u_texelSize.y)).x;
      gl_FragColor = vec4(0.5*(R-L-(T-B)), 0., 0., 1.);
    }`;

  const VORTICITY_FS = `precision highp float;
    uniform sampler2D u_velocity, u_curl;
    uniform vec2 u_texelSize;
    uniform float u_curl_strength, u_dt;
    varying vec2 v_uv;
    void main(){
      float L = texture2D(u_curl, v_uv - vec2(u_texelSize.x,0.)).x;
      float R = texture2D(u_curl, v_uv + vec2(u_texelSize.x,0.)).x;
      float T = texture2D(u_curl, v_uv + vec2(0.,u_texelSize.y)).x;
      float B = texture2D(u_curl, v_uv - vec2(0.,u_texelSize.y)).x;
      float C = texture2D(u_curl, v_uv).x;
      vec2 force = normalize(vec2(abs(T)-abs(B), abs(R)-abs(L)) + 0.0001) * u_curl_strength * C;
      vec2 vel = texture2D(u_velocity, v_uv).xy + force * u_dt;
      gl_FragColor = vec4(vel, 0., 1.);
    }`;

  const DIVERGENCE_FS = `precision highp float;
    uniform sampler2D u_velocity;
    uniform vec2 u_texelSize;
    varying vec2 v_uv;
    void main(){
      float L = texture2D(u_velocity, v_uv - vec2(u_texelSize.x,0.)).x;
      float R = texture2D(u_velocity, v_uv + vec2(u_texelSize.x,0.)).x;
      float T = texture2D(u_velocity, v_uv + vec2(0.,u_texelSize.y)).y;
      float B = texture2D(u_velocity, v_uv - vec2(0.,u_texelSize.y)).y;
      gl_FragColor = vec4(0.5*(R-L+T-B), 0., 0., 1.);
    }`;

  const PRESSURE_FS = `precision highp float;
    uniform sampler2D u_pressure, u_divergence;
    uniform vec2 u_texelSize;
    varying vec2 v_uv;
    void main(){
      float L = texture2D(u_pressure, v_uv - vec2(u_texelSize.x,0.)).x;
      float R = texture2D(u_pressure, v_uv + vec2(u_texelSize.x,0.)).x;
      float T = texture2D(u_pressure, v_uv + vec2(0.,u_texelSize.y)).x;
      float B = texture2D(u_pressure, v_uv - vec2(0.,u_texelSize.y)).x;
      float div = texture2D(u_divergence, v_uv).x;
      gl_FragColor = vec4((L+R+T+B-div)*0.25, 0., 0., 1.);
    }`;

  const GRADIENT_FS = `precision highp float;
    uniform sampler2D u_pressure, u_velocity;
    uniform vec2 u_texelSize;
    varying vec2 v_uv;
    void main(){
      float pL = texture2D(u_pressure, v_uv - vec2(u_texelSize.x,0.)).x;
      float pR = texture2D(u_pressure, v_uv + vec2(u_texelSize.x,0.)).x;
      float pT = texture2D(u_pressure, v_uv + vec2(0.,u_texelSize.y)).x;
      float pB = texture2D(u_pressure, v_uv - vec2(0.,u_texelSize.y)).x;
      vec2 vel = texture2D(u_velocity, v_uv).xy - 0.5*vec2(pR-pL, pT-pB);
      gl_FragColor = vec4(vel, 0., 1.);
    }`;

  function mkShader(type: any, src: any) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error('[fluid]', gl.getShaderInfoLog(s));
    return s;
  }
  function mkProg(fs: any) {
    const p = gl.createProgram();
    gl.attachShader(p, mkShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, mkShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p); return p;
  }
  function mkFBO(w: any, h: any, float: any) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const type = float ? gl.FLOAT : gl.UNSIGNED_BYTE;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex, fbo, w, h };
  }
  function mkBgTex() {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([5,5,10,255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  const splatProg = mkProg(SPLAT_FS);
  const advectProg = mkProg(ADVECT_FS);
  const curlProg = mkProg(CURL_FS);
  const vortProg = mkProg(VORTICITY_FS);
  const divProg = mkProg(DIVERGENCE_FS);
  const pressureProg = mkProg(PRESSURE_FS);
  const gradProg = mkProg(GRADIENT_FS);
  const renderProg = mkProg(opts.renderFS);

  let vel0 = mkFBO(SIM_W, SIM_H, true),  vel1 = mkFBO(SIM_W, SIM_H, true);
  let pre0 = mkFBO(SIM_W, SIM_H, true),  pre1 = mkFBO(SIM_W, SIM_H, true);
  let dye0 = mkFBO(SIM_W, SIM_H, true),  dye1 = mkFBO(SIM_W, SIM_H, true);
  const divFBO  = mkFBO(SIM_W, SIM_H, true);
  const curlFBO = mkFBO(SIM_W, SIM_H, true);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]), gl.STATIC_DRAW);

  const bgTex = opts.images.map(() => mkBgTex());
  opts.images.forEach((url, i) => {
    fetch(url, { mode: 'cors' })
      .then(r => r.blob())
      .then(b => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none' }))
      .then(bmp => {
        gl.activeTexture(gl.TEXTURE0 + (5 + i));
        gl.bindTexture(gl.TEXTURE_2D, bgTex[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
        opts.onImageLoad?.(i, bmp.width, bmp.height);
        bmp.close();
      }).catch(() => {});
  });

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function blit(fbo: any, prog: any, fn: any) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo ? fbo.fbo : null);
    gl.viewport(0, 0, fbo ? fbo.w : (canvas.width || 1), fbo ? fbo.h : (canvas.height || 1));
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    fn(prog);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function u1i(p: any, n: any, v: any) { gl.uniform1i(gl.getUniformLocation(p, n), v); }
  function u1f(p: any, n: any, v: any) { gl.uniform1f(gl.getUniformLocation(p, n), v); }
  function u2f(p: any, n: any, x: any, y: any) { gl.uniform2f(gl.getUniformLocation(p, n), x, y); }
  function u3f(p: any, n: any, x: any, y: any, z: any) { gl.uniform3f(gl.getUniformLocation(p, n), x, y, z); }
  function tex(unit: any, t: any) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); }

  const helpers: FluidRevealHelpers = { u1i, u1f, u2f, u3f, canvas };

  const TXS = [1/SIM_W, 1/SIM_H];

  let mx = 0.5, my = 0.5;
  let dmx = 0, dmy = 0;
  let hasMouse = false;

  // Normalised against the CANVAS rect (not the listener's), so a listener spanning a wider
  // area than the canvas still maps the wake into the right UV space.
  function onMouseMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1 - (e.clientY - r.top) / r.height;
    dmx += nx - mx;
    dmy += ny - my;
    mx = nx; my = ny;
    hasMouse = true;
  }
  function onMouseLeave() { hasMouse = false; dmx = 0; dmy = 0; }
  const pointerEl = opts.pointerEl ?? host;
  pointerEl.addEventListener('mousemove', onMouseMove as EventListener);
  pointerEl.addEventListener('mouseleave', onMouseLeave);

  function resize() {
    canvas.width  = (host as HTMLElement).clientWidth;
    canvas.height = (host as HTMLElement).clientHeight;
  }
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const SPLAT_RADIUS = opts.splatRadius ?? 0.002;
  const SPLAT_FORCE  = 5000;
  const CURL_STR     = 28;
  const VEL_DISS     = 0.992;
  const DYE_DISS     = 0.953;
  const PRESSURE_ITS = 25;

  let last = 0;
  let disposed = false;
  let raf = 0;
  let visible = true;
  function render(t: number) {
    if (disposed) return;
    if (!visible) { raf = 0; return; }
    raf = requestAnimationFrame(render);
    const dt = Math.min((t - last) * 0.001, 0.016);
    last = t;

    if (hasMouse && Math.abs(dmx) + Math.abs(dmy) > 0.0001) {
      const ar = (canvas.width || 1) / (canvas.height || 1);
      blit(vel1, splatProg, (p: any) => {
        tex(0, vel0.tex); u1i(p,'u_src',0);
        u2f(p,'u_point',mx,my);
        u2f(p,'u_aspect',ar,1.);
        u3f(p,'u_color',dmx*SPLAT_FORCE,dmy*SPLAT_FORCE,0.);
        u1f(p,'u_radius',SPLAT_RADIUS);
      });
      [vel0,vel1]=[vel1,vel0];

      blit(dye1, splatProg, (p: any) => {
        tex(0, dye0.tex); u1i(p,'u_src',0);
        u2f(p,'u_point',mx,my);
        u2f(p,'u_aspect',ar,1.);
        u3f(p,'u_color',1.,1.,1.);
        u1f(p,'u_radius',SPLAT_RADIUS);
      });
      [dye0,dye1]=[dye1,dye0];
    }
    dmx = 0; dmy = 0;

    blit(curlFBO, curlProg, (p: any) => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
    });

    blit(vel1, vortProg, (p: any) => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      tex(1,curlFBO.tex); u1i(p,'u_curl',1);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
      u1f(p,'u_curl_strength',CURL_STR);
      u1f(p,'u_dt',dt);
    });
    [vel0,vel1]=[vel1,vel0];

    blit(divFBO, divProg, (p: any) => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
    });

    gl.bindFramebuffer(gl.FRAMEBUFFER, pre0.fbo);
    gl.viewport(0,0,SIM_W,SIM_H);
    gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < PRESSURE_ITS; i++) {
      blit(pre1, pressureProg, (p: any) => {
        tex(0,pre0.tex); u1i(p,'u_pressure',0);
        tex(1,divFBO.tex); u1i(p,'u_divergence',1);
        u2f(p,'u_texelSize',TXS[0],TXS[1]);
      });
      [pre0,pre1]=[pre1,pre0];
    }

    blit(vel1, gradProg, (p: any) => {
      tex(0,pre0.tex); u1i(p,'u_pressure',0);
      tex(1,vel0.tex); u1i(p,'u_velocity',1);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
    });
    [vel0,vel1]=[vel1,vel0];

    blit(vel1, advectProg, (p: any) => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      tex(1,vel0.tex); u1i(p,'u_quantity',1);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
      u1f(p,'u_dt',dt); u1f(p,'u_dissipation',VEL_DISS);
    });
    [vel0,vel1]=[vel1,vel0];

    const dyeDiss = hasMouse ? DYE_DISS : 0.55;
    blit(dye1, advectProg, (p: any) => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      tex(1,dye0.tex); u1i(p,'u_quantity',1);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
      u1f(p,'u_dt',dt); u1f(p,'u_dissipation',dyeDiss);
    });
    [dye0,dye1]=[dye1,dye0];

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0,0,canvas.width||1,canvas.height||1);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    blit(null, renderProg, (p: any) => {
      tex(0,dye0.tex); u1i(p,'u_dye',0);
      bgTex.forEach((bt, i) => { tex(5 + i, bt); u1i(p, `u_bg${i}`, 5 + i); });
      opts.setRenderUniforms?.(p, helpers);
    });
  }
  render(0);

  // The fluid solve (25 pressure iterations + advection) is far too heavy to run while the
  // host is off-screen — pause the loop and resume on re-entry.
  const visibilityObserver = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible && !raf && !disposed) raf = requestAnimationFrame(render);
  }, { rootMargin: '100px 0px' });
  visibilityObserver.observe(host);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    visibilityObserver.disconnect();
    pointerEl.removeEventListener('mousemove', onMouseMove as EventListener);
    pointerEl.removeEventListener('mouseleave', onMouseLeave);
    resizeObserver.disconnect();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
  };
}
