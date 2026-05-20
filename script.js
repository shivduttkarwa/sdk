const body          = document.body;
const navRoot       = document.getElementById('twostepNav');
const menuBtn       = document.getElementById('menuBtn');
const menuPanel     = document.getElementById('menuPanel');
const navClosers    = document.querySelectorAll('[data-nav-toggle="close"]');

// Hero starts immediately (preloader removed)
startHeroAnimation();

// Menu
function setNavStatus(isOpen) {
  if (!navRoot || !menuBtn) return;
  navRoot.setAttribute('data-nav-status', isOpen ? 'active' : 'inactive');
  menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  body.classList.toggle('nav-open', isOpen);
}

if (menuBtn && navRoot && menuPanel) {
  menuBtn.addEventListener('click', () => {
    const isActive = navRoot.getAttribute('data-nav-status') === 'active';
    setNavStatus(!isActive);
  });

  navClosers.forEach((closer) => {
    closer.addEventListener('click', () => setNavStatus(false));
  });

  menuPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavStatus(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setNavStatus(false);
  });
}

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    el.style.transform = `translate(${x * 0.16}px, ${y * 0.18}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

// Tilt cards
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const rotateY = ((x / rect.width)  - 0.5) *  9;
    const rotateX = ((y / rect.height) - 0.5) * -9;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});


// Reveal observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── Showcase HUD: live cursor coords ──
(function initShowcaseHUD() {
  const elX  = document.getElementById('hudX');
  const elY  = document.getElementById('hudY');
  if (!elX || !elY) return;

  const pad = n => String(Math.max(0, n)).padStart(3, '0');

  document.addEventListener('mousemove', e => {
    elX.textContent = pad(Math.round(e.clientX));
    elY.textContent = pad(Math.round(e.clientY));
  });
})();

// ── Live clock (IST) ──
(function initClock() {
  const elH = document.getElementById('scH');
  const elM = document.getElementById('scM');
  const elS = document.getElementById('scS');
  if (!elH) return;

  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    elH.textContent = pad(now.getHours());
    elM.textContent = pad(now.getMinutes());
    elS.textContent = pad(now.getSeconds());
  }

  tick();
  setInterval(tick, 1000);
})();


// Hero rotating words — each word has a distinct animation personality
(function initRotatingWords() {
  const words = document.querySelectorAll('.hero-rotating-word');
  if (!words.length || !window.gsap) return;

  const DISPLAY_MS = 2700;

  // Split text into char spans for per-letter animations
  words.forEach(el => {
    const text = el.textContent.trim();
    el.dataset.text = text;
    el.innerHTML = [...text].map(ch =>
      `<span class="rw-char" data-ch="${ch}">${ch}</span>`
    ).join('');
  });

  // GSAP owns all transforms — set xPercent/yPercent for centering
  gsap.set(words, { opacity: 0, xPercent: -50, yPercent: -50 });

  const recipes = [
    // 0 · "Fast" — chars whip in from left (blur streak), exit right
    {
      in(el) {
        const chars = el.querySelectorAll('.rw-char');
        gsap.set(el, { opacity: 1, x: 0 });
        gsap.fromTo(chars,
          { x: -80, opacity: 0, filter: 'blur(12px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.42, stagger: 0.048, ease: 'power4.out' }
        );
      },
      out(el, done) {
        gsap.to(el, {
          x: 120, opacity: 0, filter: 'blur(8px)',
          duration: 0.3, ease: 'power3.in',
          onComplete() {
            gsap.set(el, { x: 0, opacity: 0, filter: 'blur(0px)' });
            done();
          }
        });
      }
    },

    // 1 · "Bold" — stamp drop with back.out overshoot, crush-down exit
    {
      in(el) {
        gsap.set(el, { opacity: 1, y: 0, scaleY: 1, transformOrigin: '50% 50%' });
        gsap.fromTo(el,
          { y: -90, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(3)' }
        );
      },
      out(el, done) {
        gsap.set(el, { transformOrigin: '50% 100%' });
        gsap.to(el, {
          scaleY: 0, opacity: 0, duration: 0.28, ease: 'power3.in',
          onComplete() {
            gsap.set(el, { scaleY: 1, opacity: 0, transformOrigin: '50% 50%' });
            done();
          }
        });
      }
    },

    // 2 · "Clean" — all chars converge from spread positions simultaneously, lock in at once
    {
      in(el) {
        const chars = [...el.querySelectorAll('.rw-char')];
        const mid   = (chars.length - 1) / 2;
        gsap.set(el, { opacity: 1 });
        const tl = gsap.timeline();
        chars.forEach((ch, i) => {
          tl.fromTo(ch,
            { x: (i - mid) * 95, opacity: 0, filter: 'blur(8px)' },
            { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'expo.out' },
            0
          );
        });
      },
      out(el, done) {
        const chars = [...el.querySelectorAll('.rw-char')];
        const mid   = (chars.length - 1) / 2;
        const tl = gsap.timeline({
          onComplete() {
            gsap.set(el, { opacity: 0 });
            gsap.set(chars, { x: 0, filter: 'blur(0px)' });
            done();
          }
        });
        chars.forEach((ch, i) => {
          tl.to(ch,
            { x: (i - mid) * 95, opacity: 0, filter: 'blur(8px)', duration: 0.38, ease: 'expo.in' },
            0
          );
        });
      }
    },

    // 3 · "Alive" — each letter springs up with elastic bounce, falls away on exit
    {
      in(el) {
        const chars = el.querySelectorAll('.rw-char');
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(chars,
          { y: 75, opacity: 0, rotation: 12 },
          { y: 0, opacity: 1, rotation: 0, duration: 0.85, stagger: 0.085, ease: 'elastic.out(1, 0.42)' }
        );
      },
      out(el, done) {
        const chars = el.querySelectorAll('.rw-char');
        gsap.to(chars, {
          y: 60, opacity: 0, rotation: -10,
          duration: 0.26, stagger: 0.04, ease: 'power2.in',
          onComplete() {
            gsap.set(el, { opacity: 0 });
            gsap.set(chars, { y: 0, rotation: 0 });
            done();
          }
        });
      }
    }
  ];

  let current = 0;

  function cycle() {
    const prev = current;
    current = (current + 1) % words.length;
    recipes[prev].out(words[prev], () => {
      recipes[current].in(words[current]);
      setTimeout(cycle, DISPLAY_MS);
    });
  }

  recipes[0].in(words[0]);
  setTimeout(cycle, DISPLAY_MS);
})();


function startHeroAnimation() {
  if (!window.gsap) return;
  gsap.from('.hero-name-line', {
    opacity: 0,
    y: 60,
    duration: 1.2,
    stagger: 0.12,
    ease: 'power4.out',
    delay: 0.1
  });
  gsap.from('.scroll-indicator, .hero-avail, .hero-tagline', {
    opacity: 0,
    y: 14,
    duration: 1,
    stagger: 0.07,
    ease: 'power2.out',
    delay: 0.6
  });
  gsap.from('.hero-line .inner', {
    yPercent: 105,
    duration: 1.2,
    stagger: 0.14,
    ease: 'power4.out',
    delay: 0.3
  });
}

// Lenis smooth scroll
if (window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    duration: 1.42,
    smoothWheel: true,
    wheelMultiplier: .88,
    touchMultiplier: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });
  function lenisRaf(t) { lenis.raf(t); requestAnimationFrame(lenisRaf); }
  requestAnimationFrame(lenisRaf);
  if (window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); }
}

// GSAP scroll animations
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Pill expands to fullscreen on scroll
  const heroWrap     = document.getElementById('heroVideoWrap');
  const showcaseSection = document.querySelector('.hero-showcase');
  if (heroWrap && showcaseSection) {
    const topInner = showcaseSection.querySelector('.hero-line-top .inner');
    const bottomInner = showcaseSection.querySelector('.hero-line-bottom .inner');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: showcaseSection,
        start: 'top top',
        end: '+=100%',
        scrub: true,
        pin: true,
        pinSpacing: true
      }
    });

    tl.to(heroWrap, {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      ease: 'none'
    }, 0);

    if (topInner && bottomInner) {
      tl.to(topInner, {
        yPercent: -115,
        opacity: 0,
        ease: 'none'
      }, 0);
      tl.to(bottomInner, {
        yPercent: 115,
        opacity: 0,
        ease: 'none'
      }, 0);
    }
  }

  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el,
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      }
    );
  });


}

// ── Stats row: single water-trail cursor reveal (3 bg images) ──
(function initStatsWater() {
  const row = document.querySelector('.stats-row');
  if (!row) return;

  const IMAGES = [
    'assets/stats-1.png',
    'assets/stats-2.png',
    'assets/stats-3.png',
  ];

  const SIM_W = 256, SIM_H = 96;

  const canvas = document.createElement('canvas');
  canvas.className = 'stats-blob-canvas';
  row.prepend(canvas);

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); return; }

  // Float textures required for velocity/pressure fields
  if (!gl.getExtension('OES_texture_float')) { canvas.remove(); return; }
  gl.getExtension('OES_texture_float_linear'); // bilinear on floats (optional)

  const VS = `attribute vec2 a_pos; varying vec2 v_uv;
    void main(){ v_uv=a_pos*.5+.5; gl_Position=vec4(a_pos,0.,1.); }`;

  // Inject a Gaussian splat of color/velocity at u_point
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

  // Semi-Lagrangian advection: trace each texel back along velocity
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

  // Curl (z-component of ∇×v) — feeds vorticity confinement
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

  // Vorticity confinement: amplify curl to restore swirling detail
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

  // Divergence of velocity field (∇·v)
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

  // Jacobi pressure solve — one iteration per draw call
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

  // Subtract pressure gradient to enforce incompressibility
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

  // Final render: use dye density as alpha to reveal 3 bg images
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

  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error('[fluid]', gl.getShaderInfoLog(s));
    return s;
  }
  function mkProg(fs) {
    const p = gl.createProgram();
    gl.attachShader(p, mkShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, mkShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p); return p;
  }
  function mkFBO(w, h, float) {
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

  // Compile all passes
  const splatProg = mkProg(SPLAT_FS);
  const advectProg = mkProg(ADVECT_FS);
  const curlProg = mkProg(CURL_FS);
  const vortProg = mkProg(VORTICITY_FS);
  const divProg = mkProg(DIVERGENCE_FS);
  const pressureProg = mkProg(PRESSURE_FS);
  const gradProg = mkProg(GRADIENT_FS);
  const renderProg = mkProg(RENDER_FS);

  // Float FBOs for velocity, pressure, dye; single buffers for divergence/curl
  let vel0 = mkFBO(SIM_W, SIM_H, true),  vel1 = mkFBO(SIM_W, SIM_H, true);
  let pre0 = mkFBO(SIM_W, SIM_H, true),  pre1 = mkFBO(SIM_W, SIM_H, true);
  let dye0 = mkFBO(SIM_W, SIM_H, true),  dye1 = mkFBO(SIM_W, SIM_H, true);
  const divFBO  = mkFBO(SIM_W, SIM_H, true);
  const curlFBO = mkFBO(SIM_W, SIM_H, true);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]), gl.STATIC_DRAW);

  const bgTex = [mkBgTex(), mkBgTex(), mkBgTex()];
  IMAGES.forEach((url, i) => {
    fetch(url, { mode: 'cors' })
      .then(r => r.blob())
      .then(b => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none' }))
      .then(bmp => {
        gl.activeTexture(gl.TEXTURE0 + (5 + i));
        gl.bindTexture(gl.TEXTURE_2D, bgTex[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
        bmp.close();
      }).catch(() => {});
  });

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Draw a full-screen quad into fbo using prog, with uniforms set by fn
  function blit(fbo, prog, fn) {
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
  function u1i(p, n, v) { gl.uniform1i(gl.getUniformLocation(p, n), v); }
  function u1f(p, n, v) { gl.uniform1f(gl.getUniformLocation(p, n), v); }
  function u2f(p, n, x, y) { gl.uniform2f(gl.getUniformLocation(p, n), x, y); }
  function u3f(p, n, x, y, z) { gl.uniform3f(gl.getUniformLocation(p, n), x, y, z); }
  function tex(unit, t) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); }

  const TXS = [1/SIM_W, 1/SIM_H];

  let mx = 0.5, my = 0.5;
  let dmx = 0, dmy = 0;   // total delta accumulated across all events this frame
  let hasMouse = false;

  row.addEventListener('mousemove', e => {
    const r = row.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1 - (e.clientY - r.top) / r.height;
    dmx += nx - mx;
    dmy += ny - my;
    mx = nx; my = ny;
    hasMouse = true;
  });
  row.addEventListener('mouseleave', () => { hasMouse = false; dmx = 0; dmy = 0; });

  function resize() {
    canvas.width  = row.clientWidth;
    canvas.height = row.clientHeight;
  }
  resize();
  new ResizeObserver(resize).observe(row);

  const SPLAT_RADIUS = 0.002;
  const SPLAT_FORCE  = 5000;
  const CURL_STR     = 28;
  const VEL_DISS     = 0.992;
  const DYE_DISS     = 0.953;
  const PRESSURE_ITS = 25;

  let last = 0;
  (function render(t) {
    requestAnimationFrame(render);
    const dt = Math.min((t - last) * 0.001, 0.016);
    last = t;

    // 1. Splat cursor velocity + dye — use frame-accumulated delta so fast swipes don't lose data
    if (hasMouse && Math.abs(dmx) + Math.abs(dmy) > 0.0001) {
      const ar = (canvas.width || 1) / (canvas.height || 1);
      blit(vel1, splatProg, p => {
        tex(0, vel0.tex); u1i(p,'u_src',0);
        u2f(p,'u_point',mx,my);
        u2f(p,'u_aspect',ar,1.);
        u3f(p,'u_color',dmx*SPLAT_FORCE,dmy*SPLAT_FORCE,0.);
        u1f(p,'u_radius',SPLAT_RADIUS);
      });
      [vel0,vel1]=[vel1,vel0];

      blit(dye1, splatProg, p => {
        tex(0, dye0.tex); u1i(p,'u_src',0);
        u2f(p,'u_point',mx,my);
        u2f(p,'u_aspect',ar,1.);
        u3f(p,'u_color',1.,1.,1.);
        u1f(p,'u_radius',SPLAT_RADIUS);
      });
      [dye0,dye1]=[dye1,dye0];
    }
    dmx = 0; dmy = 0; // reset after each frame

    // 2. Curl
    blit(curlFBO, curlProg, p => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
    });

    // 3. Vorticity confinement
    blit(vel1, vortProg, p => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      tex(1,curlFBO.tex); u1i(p,'u_curl',1);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
      u1f(p,'u_curl_strength',CURL_STR);
      u1f(p,'u_dt',dt);
    });
    [vel0,vel1]=[vel1,vel0];

    // 4. Divergence
    blit(divFBO, divProg, p => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
    });

    // 5. Clear pressure then Jacobi solve
    gl.bindFramebuffer(gl.FRAMEBUFFER, pre0.fbo);
    gl.viewport(0,0,SIM_W,SIM_H);
    gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < PRESSURE_ITS; i++) {
      blit(pre1, pressureProg, p => {
        tex(0,pre0.tex); u1i(p,'u_pressure',0);
        tex(1,divFBO.tex); u1i(p,'u_divergence',1);
        u2f(p,'u_texelSize',TXS[0],TXS[1]);
      });
      [pre0,pre1]=[pre1,pre0];
    }

    // 6. Subtract pressure gradient
    blit(vel1, gradProg, p => {
      tex(0,pre0.tex); u1i(p,'u_pressure',0);
      tex(1,vel0.tex); u1i(p,'u_velocity',1);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
    });
    [vel0,vel1]=[vel1,vel0];

    // 7. Advect velocity
    blit(vel1, advectProg, p => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      tex(1,vel0.tex); u1i(p,'u_quantity',1);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
      u1f(p,'u_dt',dt); u1f(p,'u_dissipation',VEL_DISS);
    });
    [vel0,vel1]=[vel1,vel0];

    // 8. Advect dye — collapse fast when cursor stops/leaves
    const dyeDiss = hasMouse ? DYE_DISS : 0.55;
    blit(dye1, advectProg, p => {
      tex(0,vel0.tex); u1i(p,'u_velocity',0);
      tex(1,dye0.tex); u1i(p,'u_quantity',1);
      u2f(p,'u_texelSize',TXS[0],TXS[1]);
      u1f(p,'u_dt',dt); u1f(p,'u_dissipation',dyeDiss);
    });
    [dye0,dye1]=[dye1,dye0];

    // 9. Render to canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0,0,canvas.width||1,canvas.height||1);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    blit(null, renderProg, p => {
      tex(0,dye0.tex); u1i(p,'u_dye',0);
      tex(5,bgTex[0]); u1i(p,'u_bg0',5);
      tex(6,bgTex[1]); u1i(p,'u_bg1',6);
      tex(7,bgTex[2]); u1i(p,'u_bg2',7);
    });

  })(0);
})();

// ── Nav reveal: WebGL blob cursor ──
(function initNavReveal() {
  const canvas = document.getElementById('navRevealCanvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  const VS = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const FS = `
    precision mediump float;
    uniform sampler2D u_img;
    uniform vec2  u_mouse;
    uniform vec2  u_res;
    uniform vec2  u_imgSize;
    uniform float u_t;
    varying vec2  v_uv;

    vec2 coverUV(vec2 uv) {
      float cAspect = u_res.x / u_res.y;
      float iAspect = u_imgSize.x / u_imgSize.y;
      if (iAspect > cAspect) {
        // image wider than canvas: fit height, center-crop x
        return vec2((uv.x - 0.5) * (cAspect / iAspect) + 0.5, uv.y);
      } else {
        // image taller than canvas: fit width, center-crop y
        return vec2(uv.x, (uv.y - 0.5) * (iAspect / cAspect) + 0.5);
      }
    }

    float blob(vec2 uv, vec2 c) {
      vec2 d = uv - c;
      d.x *= u_res.x / u_res.y;
      float a = atan(d.y, d.x);
      float dist = length(d);
      float r = 0.21
        + sin(a * 2.0 + u_t * 0.9)  * 0.038
        + sin(a * 3.0 - u_t * 1.3)  * 0.025
        + sin(a * 5.0 + u_t * 0.7)  * 0.015
        + sin(a * 7.0 - u_t * 1.1)  * 0.008;
      return smoothstep(r + 0.018, r - 0.018, dist);
    }

    void main() {
      vec2 m = vec2(u_mouse.x / u_res.x, 1.0 - u_mouse.y / u_res.y);
      float mask = blob(v_uv, m);
      vec4 col = texture2D(u_img, coverUV(v_uv));
      gl_FragColor = vec4(col.rgb, col.a * mask);
    }
  `;

  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const uMouse   = gl.getUniformLocation(prog, 'u_mouse');
  const uRes     = gl.getUniformLocation(prog, 'u_res');
  const uImgSize = gl.getUniformLocation(prog, 'u_imgSize');
  const uT       = gl.getUniformLocation(prog, 'u_t');

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,0]));

  const img = new Image();
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.useProgram(prog);
    gl.uniform2f(uImgSize, img.naturalWidth, img.naturalHeight);
  };
  img.src = 'assets/1111.png';

  let mx = -9999, my = -9999, tx = -9999, ty = -9999;

  const hero = document.getElementById('home');
  hero.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { tx = -9999; ty = -9999; });

  function resize() {
    canvas.width  = Math.round(canvas.offsetWidth);
    canvas.height = Math.round(canvas.offsetHeight);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  new ResizeObserver(resize).observe(canvas);
  resize();

  (function render(t) {
    requestAnimationFrame(render);
    mx += (tx - mx) * 0.08;
    my += (ty - my) * 0.08;
    gl.uniform2f(uMouse, mx, my);
    gl.uniform2f(uRes, canvas.width || 1, canvas.height || 1);
    gl.uniform1f(uT, t * 0.001);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  })(0);
})();


// ── Stats section entrance animation ──
(function initStats() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const section = document.querySelector('.stats-section');
  if (!section) return;

  const ruleTop  = section.querySelector('.stats-rule--top');
  const ruleBot  = section.querySelector('.stats-rule--bot');
  const dividers = section.querySelectorAll('.stats-divider');
  const items    = section.querySelectorAll('.si');

  const master = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 50%', toggleActions: 'play none none none' }
  });

  master.to(ruleTop, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' });
  master.to(dividers, { scaleY: 1, duration: 0.6, ease: 'power3.inOut', stagger: 0.18 }, '-=0.3');

  items.forEach((item, i) => {
    const num    = item.querySelector('.si-num');
    const sup    = item.querySelector('.si-sup');
    const foot   = item.querySelector('.si-foot');
    const target = parseInt(num.dataset.target || '0', 10);

    master.to([num, sup], { y: '0%', duration: 0.9, ease: 'power4.out' }, i === 0 ? 0 : '<0.18');
    master.to({}, {
      duration: 1, ease: 'power2.out',
      onUpdate() { num.textContent = Math.round(this.progress() * target); },
      onComplete() { num.textContent = target; },
    }, '<');
    master.to(foot, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '<0.1');
  });

  master.to(ruleBot, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=0.2');
})();

// ── Section heading: char-by-char mask reveal ──
(function initTiHeading() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const wrap = document.querySelector('.ti-ch-wrap');
  if (!wrap) return;

  const text = 'Why I Build';
  wrap.innerHTML = text.split('').map(ch =>
    ch === ' '
      ? '<span class="ti-char" style="display:inline-block;width:0.28em;"></span>'
      : `<span class="ti-char">${ch}</span>`
  ).join('');

  const chars = wrap.querySelectorAll('.ti-char');

  gsap.from(chars, {
    yPercent: 110,
    stagger: 0.04,
    ease: 'power4.out',
    duration: 1,
    scrollTrigger: {
      trigger: '.ti-header',
      start: 'top 82%',
      toggleAction: 'play none none none',
    }
  });
})();

// ── Text intro: word-by-word blur reveal on scrub ──
(function initTextIntro() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const textEl = document.querySelector('.ti-text');
  if (!textEl) return;

  function splitIntoWords() {
    const nodes = Array.from(textEl.childNodes);
    let html = '';
    nodes.forEach(node => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(part => {
          if (/^\s+$/.test(part)) { html += part; }
          else if (part)           { html += `<span class="ti-word">${part}</span>`; }
        });
      } else if (node.nodeType === 1) {
        const cls   = node.className;
        const parts = node.textContent.split(/(\s+)/);
        const words = parts.filter(p => p && !/^\s+$/.test(p));
        let wi = 0;
        parts.forEach(part => {
          if (/^\s+$/.test(part)) { html += part; }
          else if (part) {
            const isLast = wi === words.length - 1;
            html += `<span class="ti-word${isLast ? ' ' + cls : ''}">${part}</span>`;
            wi++;
          }
        });
      }
    });
    textEl.innerHTML = html;
  }

  let animTl = null;

  function setup() {
    if (animTl) { animTl.kill(); animTl = null; }
    textEl.innerHTML = textEl.dataset.orig || textEl.innerHTML;
    if (!textEl.dataset.orig) textEl.dataset.orig = textEl.innerHTML;

    splitIntoWords();

    const words = textEl.querySelectorAll('.ti-word');

    animTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.text-intro',
        start: 'top 30%',
        end: 'top -20%',
        scrub: 1.2,
      }
    });

    const dur = 0.25;
    words.forEach((word, i) => {
      animTl.fromTo(word,
        { clipPath: 'inset(-20% 105% -20% 0%)', opacity: 0.05, filter: 'blur(10px)', skewX: -4 },
        { clipPath: 'inset(-20% 0%   -20% 0%)', opacity: 1,    filter: 'blur(0px)',  skewX: 0,
          ease: 'power2.out', duration: dur },
        i * dur
      );
    });
  }

  document.fonts?.ready ? document.fonts.ready.then(setup) : setTimeout(setup, 400);
})();

// ── Hero blob: WebGL cursor reveal ──
(function initHeroBlob() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  const hero   = document.getElementById('home');
  const canvas = document.getElementById('hero-blob-canvas');
  if (!hero || !canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) return;

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
      float sAR   = pw * u_res.x / u_res.y;
      float ratio = max(u_portAR, 0.001) / sAR;
      float su    = uv.x / pw;
      float xScale = min(1.0, 1.0 / ratio);
      float yScale = min(1.0, ratio);
      vec2  pUV  = vec2(su * xScale + 0.5 * (1.0 - xScale),
                        uv.y * yScale + 0.5 * (1.0 - yScale));

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
                        uv.y * yScale2 + 0.5 * (1.0 - yScale2));
      vec3 port2 = texture2D(u_portrait2, pUV2).rgb;
      port = mix(port, port2, mask);

      float inStrip = 1.0 - smoothstep(pw * 0.82, pw * 1.08, uv.x);
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

      vec2 gradDir = normalize(vec2(0.94, -0.342)); // top-left to bottom-right flow
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

      const float portraitAmbient = 0.62;
      vec3 baseWithPortrait = mix(bgBase, port, inStrip * portraitAmbient);
      float gradOverlay = mix(u_baseAlpha, u_baseAlpha * 0.25, inStrip);
      vec3 shadedBase = mix(baseWithPortrait, grad, gradOverlay);
      float revealAlpha = clamp(mask + glow * 0.55, 0.0, 1.0) * u_opacity;
      vec3 revealColor = clamp(col, 0.0, 1.0);
      vec3 finalColor = mix(shadedBase, revealColor, revealAlpha);
      gl_FragColor = vec4(finalColor, 1.0);
    }`;

  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      console.error('[blob]', gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
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

  function allocTex(unit) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
                  gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([5,5,10,255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  const texBg    = allocTex(0);
  const texPort  = allocTex(1);
  const texPort2 = allocTex(2);
  gl.uniform1i(uBg,    0);
  gl.uniform1i(uPort,  1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  function loadBitmap(url, unit, tex, onLoad) {
    fetch(url, { mode: 'cors' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then(b  => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' }))
      .then(bmp => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
        if (onLoad) onLoad(bmp.width, bmp.height);
        bmp.close();
      })
      .catch(e => console.warn('[blob] texture load failed:', url, e));
  }

  loadBitmap('./assets/hero-samurai.png', 0, texBg);
  loadBitmap('./assets/shiv-3.png', 1, texPort,  (w, h) => gl.uniform1f(uPortAR,  w / h));
  loadBitmap('./assets/shiv-1.png', 2, texPort2, (w, h) => gl.uniform1f(uPortAR2, w / h));

  let mx = 0.15, my = 0.58;
  let smx = 0.15, smy = 0.58;

  document.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left)  / r.width;
    my = 1.0 - (e.clientY - r.top) / r.height;
  });

  function resize() {
    canvas.width  = hero.clientWidth;
    canvas.height = hero.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    const w = canvas.width || 1;
    const vidW = Math.min(960, Math.max(320, w * 0.62));
    gl.uniform1f(uPortW, (w - vidW) / 2 / w);
  }
  resize();
  window.addEventListener('resize', resize);

  const t0 = performance.now();
  const heroNameRevealed = document.getElementById('heroNameRevealed');
  function render() {
    smx += (mx - smx) * 0.08;
    smy += (my - smy) * 0.08;
    const t = (performance.now() - t0) / 1000;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uMouse,  smx, smy);
    gl.uniform1f(uTime,   t);
    gl.uniform1f(uRadius, 0.306);
    gl.uniform2f(uRes,    canvas.width, canvas.height);
    gl.uniform1f(uSmoke,   anim.smoke);
    gl.uniform1f(uOpacity, anim.opacity);
    gl.uniform1f(uBaseAlpha, baseAlpha);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (heroNameRevealed) {
      const cx     = smx * canvas.width;
      const cy     = (1.0 - smy) * canvas.height;
      const rPx    = (0.281 + anim.smoke * 0.117) * canvas.height;
      const edgePx = (0.025 + anim.smoke * 0.06)  * canvas.height;
      const rOuter = rPx + edgePx;
      const rInner = Math.max(0, rPx - edgePx);
      const pct    = rOuter > 0 ? (rInner / rOuter * 100).toFixed(1) : '0';
      const grad   = rOuter < 1
        ? 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 100%)'
        : `radial-gradient(circle ${rOuter}px at ${cx}px ${cy}px, black ${pct}%, transparent 100%)`;
      heroNameRevealed.style.webkitMaskImage = grad;
      heroNameRevealed.style.maskImage       = grad;
    }

    requestAnimationFrame(render);
  }
  render();

  if (window.gsap) {
    gsap.to(anim, { smoke: 0, opacity: 1, duration: 1.1, delay: 0.5, ease: 'power3.out' });
  }

  let smokeOut = false;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 5;
    if (scrolled && !smokeOut) {
      smokeOut = true;
      if (window.gsap) {
        gsap.killTweensOf(anim);
        gsap.to(anim, { smoke: 1, opacity: 0, duration: 0.45, ease: 'power2.in' });
      }
    } else if (!scrolled && smokeOut) {
      smokeOut = false;
      if (window.gsap) {
        gsap.killTweensOf(anim);
        gsap.to(anim, { smoke: 0, opacity: 1, duration: 0.75, ease: 'power3.out' });
      }
    }
  }, { passive: true });
})();

// ── Featured Work section ──
(function initFeaturedWork() {
  const section = document.querySelector('.jg-featured');
  if (!section || !window.gsap || !window.ScrollTrigger) return;

  section.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = text.split('').map(ch =>
      ch === ' '
        ? '<span style="display:inline-block;width:0.18em"></span>'
        : `<span class="char-wrap"><span class="char">${ch}</span></span>`
    ).join('');
  });

  gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 72%', once: true }
  })
    .from('.jg-title .char', { yPercent: 110, duration: 1, stagger: 0.04, ease: 'power4.out' })
    .to('.jg-line',          { scaleX: 1, duration: 1.1, ease: 'power4.inOut' }, '-=0.55')
    .to('.jg-kicker span',   { y: 0, duration: 0.85, ease: 'power4.out' }, '-=0.65')
    .to('.jg-pill',          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power4.out' }, '-=0.7');

  gsap.to('.jg-cta', {
    y: 0, opacity: 1, duration: 0.9, ease: 'power4.out',
    scrollTrigger: { trigger: '.jg-cta-wrap', start: 'top 88%', once: true }
  });

  const cta = section.querySelector('.jg-cta');
  if (cta) {
    cta.addEventListener('mousemove', e => {
      const r = cta.getBoundingClientRect();
      gsap.to(cta, {
        x: (e.clientX - r.left - r.width / 2) * 0.18,
        y: (e.clientY - r.top - r.height / 2) * 0.18,
        duration: 0.35, ease: 'power3.out'
      });
    });
    cta.addEventListener('mouseleave', () => {
      gsap.to(cta, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)' });
    });
  }
})();

/* ── Recent Projects Shader Slider ─────────────────────────────────── */
(() => {
  const imageUrls = [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&h=1350&q=84',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&h=1350&q=84',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=2400&h=1350&q=84',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2400&h=1350&q=84'
  ];

  const canvas      = document.getElementById('projects-fx');
  const section     = document.getElementById('recent-projects');
  const stick       = document.getElementById('projects-stick');
  const bgFallback  = document.getElementById('projects-bg');
  const panels      = [...document.querySelectorAll('.project-panel')];
  const counter     = [...document.querySelectorAll('.project-counter span')];
  const progressBar = document.getElementById('projects-progress-bar');

  if(!canvas || !stick) return;

  const total = imageUrls.length;
  let targetProgress = 0;
  let sectionVisible = true;
  new IntersectionObserver(entries => { sectionVisible = entries[0].isIntersecting; }, { rootMargin: '200px' }).observe(section);
  let smoothProgress = 0;
  let mouse = {x:.5,y:.5,tx:.5,ty:.5};
  let renderer = null;

  const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
  const lerp  = (a,b,t) => a+(b-a)*t;
  const smoother = x => { x=clamp(x); return x*x*x*(x*(x*6-15)+10); };

  if(bgFallback) bgFallback.style.setProperty('--fallback-bg', `url('${imageUrls[0]}')`);

  function loadImage(url){
    return new Promise((resolve,reject)=>{
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  const vertex = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main(){
      v_uv = a_position * .5 + .5;
      gl_Position = vec4(a_position,0.0,1.0);
    }
  `;

  const fragment = `
    precision highp float;
    uniform sampler2D u_tex0;
    uniform sampler2D u_tex1;
    uniform sampler2D u_tex2;
    uniform sampler2D u_tex3;
    uniform float u_from;
    uniform float u_to;
    uniform float u_mix;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 v_uv;

    float smootherstep(float edge0, float edge1, float x){
      x = clamp((x-edge0)/(edge1-edge0),0.0,1.0);
      return x*x*x*(x*(x*6.0-15.0)+10.0);
    }
    float hash(vec2 p){
      p = fract(p*vec2(123.34,345.45));
      p += dot(p,p+34.345);
      return fract(p.x*p.y);
    }
    float noise(vec2 p){
      vec2 i=floor(p); vec2 f=fract(p);
      vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i+vec2(0,0)),hash(i+vec2(1,0)),u.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }
    float fbm(vec2 p){
      float v=0.0,a=0.5;
      mat2 r=mat2(1.62,1.12,-1.12,1.62);
      for(int i=0;i<5;i++){v+=a*noise(p);p=r*p+17.0;a*=.5;}
      return v;
    }
    vec4 getTex(float id, vec2 uv){
      if(id < .5)  return texture2D(u_tex0,uv);
      if(id < 1.5) return texture2D(u_tex1,uv);
      if(id < 2.5) return texture2D(u_tex2,uv);
      return texture2D(u_tex3,uv);
    }
    vec2 coverUv(vec2 uv){
      float imgAspect = 1.7777778;
      float ca = u_resolution.x / u_resolution.y;
      vec2 q = uv;
      if(ca > imgAspect){ q.y = (uv.y-.5)*(imgAspect/ca)+.5; }
      else              { q.x = (uv.x-.5)*(ca/imgAspect)+.5; }
      return q;
    }
    vec4 rgbShift(float id, vec2 uv, vec2 dir, float amount){
      uv = clamp(uv,vec2(0.001),vec2(0.999));
      vec4 c;
      c.r = getTex(id,clamp(uv+dir*amount,vec2(0.001),vec2(0.999))).r;
      c.g = getTex(id,uv).g;
      c.b = getTex(id,clamp(uv-dir*amount,vec2(0.001),vec2(0.999))).b;
      c.a = 1.0;
      return c;
    }
    void main(){
      vec2 uv = v_uv;
      vec2 q = coverUv(uv);
      float m = smootherstep(0.0,1.0,u_mix);
      float active = sin(m*3.14159265);

      float n1 = fbm(vec2(uv.x*2.4, uv.y*4.8 - u_time*.22));
      float n2 = fbm(vec2(uv.x*9.0 + u_time*.16, uv.y*16.0));
      float flame = (n1*.75+n2*.45)-.54;
      float sweep = -0.12+1.24*m;
      float warpedX = uv.x+flame*.09*active+sin(uv.y*28.0+u_time*2.0)*.006*active;
      float mask = 1.0-smoothstep(sweep-.048,sweep+.048,warpedX);

      float edge = 1.0-smoothstep(0.0,.055,abs(warpedX-sweep));
      edge *= active;
      edge *= .65+.75*fbm(vec2(uv.x*22.0+u_time*.8,uv.y*12.0-u_time*.52));

      vec2 mousePull = (u_mouse-.5)*.018;
      vec2 dir = normalize(vec2(.85,.18)+mousePull);
      vec2 disp = vec2(
        (fbm(uv*8.0+vec2(u_time*.1,0.0))-.5)*.065,
        (fbm(uv*10.0+vec2(0.0,u_time*.13))-.5)*.035
      )*edge;

      vec2 uvFrom = q-disp-dir*.014*edge;
      vec2 uvTo   = q+disp+dir*.018*edge;

      vec4 a = rgbShift(u_from,uvFrom,dir,.009*edge+.0018*active);
      vec4 b = rgbShift(u_to,  uvTo,  dir,.014*edge+.0018*active);
      vec4 col = mix(a,b,mask);

      vec3 hot = vec3(1.0,.09,.03)*edge*.92 + vec3(1.0,.62,.24)*pow(edge,3.0)*.52;
      float whiteCore = pow(edge,7.5)*.88;
      float line = smoothstep(.985,1.0,sin((uv.y+u_time*.035)*760.0)*.5+.5);
      col.rgb += hot;
      col.rgb += vec3(1.0,.86,.62)*whiteCore;
      col.rgb += vec3(1.0,.04,.02)*line*edge*.045;
      col.rgb *= 1.0+edge*.18;
      col.rgb = mix(col.rgb, col.rgb*vec3(.74,.68,.64)+vec3(.045,0.0,0.0), .42);
      col.rgb = pow(max(col.rgb,0.0),vec3(.92));
      gl_FragColor = vec4(col.rgb,1.0);
    }
  `;

  function createShader(gl,type,src){
    const s=gl.createShader(type);
    gl.shaderSource(s,src);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function createProgram(gl,vs,fs){
    const p=gl.createProgram();
    gl.attachShader(p,createShader(gl,gl.VERTEX_SHADER,vs));
    gl.attachShader(p,createShader(gl,gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  async function initWebGL(){
    const gl = canvas.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'low-power'});
    if(!gl) throw new Error('WebGL unavailable');

    const imgs = await Promise.all(imageUrls.map(loadImage));
    const prog = createProgram(gl,vertex,fragment);
    gl.useProgram(prog);

    const buf=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const aloc=gl.getAttribLocation(prog,'a_position');
    gl.enableVertexAttribArray(aloc);
    gl.vertexAttribPointer(aloc,2,gl.FLOAT,false,0,0);

    imgs.forEach((img,i)=>{
      const tex=gl.createTexture();
      gl.activeTexture(gl.TEXTURE0+i);
      gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
    });

    gl.uniform1i(gl.getUniformLocation(prog,'u_tex0'),0);
    gl.uniform1i(gl.getUniformLocation(prog,'u_tex1'),1);
    gl.uniform1i(gl.getUniformLocation(prog,'u_tex2'),2);
    gl.uniform1i(gl.getUniformLocation(prog,'u_tex3'),3);

    const uloc = {
      from:       gl.getUniformLocation(prog,'u_from'),
      to:         gl.getUniformLocation(prog,'u_to'),
      mix:        gl.getUniformLocation(prog,'u_mix'),
      time:       gl.getUniformLocation(prog,'u_time'),
      resolution: gl.getUniformLocation(prog,'u_resolution'),
      mouse:      gl.getUniformLocation(prog,'u_mouse')
    };

    function resize(){
      const dpr=Math.min(window.devicePixelRatio||1,1.8);
      const r=canvas.getBoundingClientRect();
      const w=Math.max(2,Math.floor(r.width*dpr));
      const h=Math.max(2,Math.floor(r.height*dpr));
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
    }

    function render(time,p){
      resize();
      let scaled=p*(total-1);
      let from=Math.floor(scaled);
      let to=Math.min(total-1,from+1);
      let mix=scaled-from;
      if(p>=.999){from=total-2;to=total-1;mix=1;}
      gl.clearColor(0,0,0,1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform1f(uloc.from,from);
      gl.uniform1f(uloc.to,to);
      gl.uniform1f(uloc.mix,mix);
      gl.uniform1f(uloc.time,time*.001);
      gl.uniform2f(uloc.resolution,canvas.width,canvas.height);
      gl.uniform2f(uloc.mouse,mouse.x,mouse.y);
      gl.drawArrays(gl.TRIANGLES,0,6);
    }

    window.addEventListener('resize',resize,{passive:true});
    return {render};
  }

  function getState(p){
    p=clamp(p);
    const scaled=p*(total-1);
    let from=Math.floor(scaled);
    let to=Math.min(total-1,from+1);
    let mix=scaled-from;
    if(p>=.999){from=total-2;to=total-1;mix=1;}
    return {from,to,mix,smoothMix:smoother(mix),active:mix<.5?from:to};
  }

  function updateDom(p){
    const s=getState(p);
    const wipe=clamp((-0.16+1.32*s.smoothMix)*100,0,100);

    stick.style.setProperty('--wipe',`${wipe}%`);
    const barP=s.from===total-1?1:clamp((s.from+s.smoothMix)/(total-1),0,1);
    if(progressBar) progressBar.style.transform=`scaleY(${barP})`;
    if(bgFallback)  bgFallback.style.setProperty('--fallback-bg',`url('${imageUrls[s.active]}')`);

    // burn edge enters text at ~6%, exits at ~55%; bell curve between those points
    const tL=6, tR=55;
    const melt=(wipe>=tL&&wipe<=tR)?Math.sin(((wipe-tL)/(tR-tL))*Math.PI):0;

    panels.forEach((panel,i)=>{
      panel.classList.remove('is-from','is-to','is-single');
      panel.style.opacity='0';
      const copy=panel.querySelector('.project-copy');
      if(copy){copy.style.filter='';copy.style.transform='';}
      if(s.from===s.to||s.mix<.001){
        if(i===s.from){panel.classList.add('is-single');panel.style.opacity='1';}
      }else{
        if(i===s.from){
          panel.classList.add('is-from');panel.style.opacity='1';
          if(copy&&melt>0){
            copy.style.filter=`blur(${melt*7}px) saturate(${1+melt*1.2})`;
            copy.style.transform='';
          }
        }
        if(i===s.to){
          panel.classList.add('is-to');panel.style.opacity='1';
          if(copy&&melt>0){
            copy.style.filter=`blur(${melt*7}px) saturate(${1+melt*1.2})`;
            copy.style.transform='';
          }
        }
      }
    });

    counter.forEach((el,i)=>el.classList.toggle('is-active',i===s.active));
  }

  function setupScroll(){
    if(window.gsap && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: stick,
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: '+=460%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self){ targetProgress=self.progress; }
      });
    }else{
      window.addEventListener('scroll',()=>{
        const rect=stick.getBoundingClientRect();
        targetProgress=clamp(-rect.top/(stick.offsetHeight*3.6));
      },{passive:true});
    }
  }

  window.addEventListener('pointermove',e=>{
    mouse.tx=e.clientX/window.innerWidth;
    mouse.ty=e.clientY/window.innerHeight;
  },{passive:true});

  function animate(time){
    smoothProgress=lerp(smoothProgress,targetProgress,.08);
    mouse.x=lerp(mouse.x,mouse.tx,.065);
    mouse.y=lerp(mouse.y,mouse.ty,.065);
    updateDom(smoothProgress);
    if(renderer && sectionVisible) renderer.render(time,smoothProgress);
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('webglcontextlost', e => {
    e.preventDefault();
    renderer = null;
  }, false);

  canvas.addEventListener('webglcontextrestored', () => {
    initWebGL().then(r => { renderer = r; }).catch(() => {});
  }, false);

  // Tab hidden → context lost but webglcontextrestored never fires; reinit on return
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !renderer) {
      initWebGL().then(r => { renderer = r; }).catch(() => {});
    }
  });

  function initSectionTitleAnims() {
    if (!window.gsap || !window.ScrollTrigger) return;
    document.querySelectorAll('.ts-section').forEach(sec => {

      // split chars
      sec.querySelectorAll('[data-split]').forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = text.split('').map(ch =>
          ch === ' '
            ? '<span style="display:inline-block;width:0.18em"></span>'
            : `<span class="char-wrap"><span class="char">${ch}</span></span>`
        ).join('');
      });

      const chars    = [...sec.querySelectorAll('.ts-title .char')];
      const eyebrow  = sec.querySelector('.eyebrow');
      const subtitle = sec.querySelector('.ts-subtitle');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top 65%', once: true }
      });

      if (eyebrow) tl.from(eyebrow, { y: 18, opacity: 0, duration: 0.6, ease: 'power3.out' });

      if (chars.length) {
        tl.from(chars, { yPercent: 110, duration: 1, stagger: 0.04, ease: 'power4.out' }, '-=0.2');
      }

      if (subtitle) {
        tl.from(subtitle, { y: 22, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55');
      }
    });
  }

  function initTechStackCards() {
    const cards = document.querySelectorAll('#tsBento .ts-card');
    if (!cards.length || !window.gsap || !window.ScrollTrigger) return;
    gsap.from(cards, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '#tsBento',
        start: 'top 70%',
        once: true,
      },
    });
  }

  function initProcessTimeline() {
    const panels    = [...document.querySelectorAll('.proc-panel')];
    const imgSlides = [...document.querySelectorAll('.proc-img-slide')];
    const frame     = document.getElementById('procFrame');
    const sword     = document.getElementById('procSword');
    const rail      = document.getElementById('procRail');
    if (!panels.length || !frame || !rail || !window.gsap || !window.ScrollTrigger) return;

    let currentActive = -1;
    let trackStart = 0, trackEnd = 0;

    // Initialise image visibility
    imgSlides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0 }));
    panels[0].classList.add('is-active');
    currentActive = 0;

    function setTrackBounds() {
      if (!panels.length) return;
      const first = panels[0], last = panels[panels.length - 1];
      trackStart = first.offsetTop + first.offsetHeight / 2;
      trackEnd   = last.offsetTop  + last.offsetHeight  / 2;
      if (sword && !sword._swordInit) {
        gsap.set(sword, { xPercent: -50, yPercent: -50, transformPerspective: 800 });
        sword._swordInit = true;
      }
    }

    function activateStep(i) {
      if (currentActive === i) return;
      currentActive = i;
      panels.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
    }

    setTrackBounds();
    window.addEventListener('resize', setTrackBounds, { passive: true });

    const procSection = document.getElementById('about');

    // Sword entrance: 3-point arc — scrubbed, fully reversible
    if (sword) {
      const entranceTl = gsap.timeline({ paused: true })
        // leg 1: top-right → arc waypoint (a bit down and left, not all the way)
        .fromTo(sword,
          { x: 1000, y: -500, rotation: 180 },
          { x: 100,  y: -80,  rotation: 60, ease: 'none', duration: 0.55 }
        )
        // leg 2: arc waypoint → resting position
        .to(sword,
          { x: 0, y: () => trackStart, rotation: 0, ease: 'none', duration: 0.45 }
        );

      ScrollTrigger.create({
        trigger: rail,
        start: 'top bottom',
        end:   'top top',
        scrub: true,
        animation: entranceTl,
        invalidateOnRefresh: true,
      });
    }

    // First image fades in on entrance
    const frameWrap = document.querySelector('.proc-frame-wrap');
    if (frameWrap) {
      gsap.fromTo(frameWrap,
        { opacity: 0 },
        {
          opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: 'top 40%',
            end:   'top top',
            scrub: true,
          },
        }
      );
    }

    panels.forEach((panel, i) => {
      // Activate dot / panel colours when panel hits centre
      ScrollTrigger.create({
        trigger: panel,
        start: 'top center',
        end:   'bottom center',
        onEnter:     () => activateStep(i),
        onEnterBack: () => activateStep(i),
      });

      // Content slides in from left (scrubbed)
      const els = [...panel.querySelectorAll('.proc-num,.proc-title,.proc-sep,.proc-desc,.proc-tags')];
      const tl  = gsap.timeline({ paused: true });
      tl.fromTo(els,
        { x: -150, opacity: 0 },
        { x: 0, opacity: 1, stagger: .1, ease: 'power2.out', duration: .4 }
      );
      ScrollTrigger.create({
        trigger: panel, start: 'top 45%', end: 'top 1%',
        scrub: 1.2, animation: tl,
      });

      // 3-D flip frame between this panel and the next
      if (i < panels.length - 1) {
        const DROP = 0.35, DROP_PX = 80;
        ScrollTrigger.create({
          trigger: panels[i + 1],
          start: 'top bottom', end: 'top top',
          scrub: 1.5,
          onUpdate(self) {
            const p = self.progress;
            let y, rotateY, tiltT;
            if (p <= DROP) {
              tiltT   = 0;
              y       = (p / DROP) * DROP_PX;
              rotateY = i * 180;
            } else {
              tiltT   = (p - DROP) / (1 - DROP);
              y       = (1 - tiltT) * DROP_PX;
              rotateY = i * 180 + tiltT * 180;
            }
            gsap.set(frame, { y, rotateY, scale: 1 - Math.sin(tiltT * Math.PI) * 0.04 });
            const norm = rotateY % 360, front = norm < 90 || norm >= 270;
            if (tiltT < 0.5) {
              gsap.set(imgSlides[i],     { opacity: 1, scaleX: front ? 1 : -1 });
              gsap.set(imgSlides[i + 1], { opacity: 0, scaleX: 1 });
            } else {
              gsap.set(imgSlides[i],     { opacity: 0 });
              gsap.set(imgSlides[i + 1], { opacity: 1, scaleX: front ? 1 : -1 });
            }
            frame.classList.toggle('is-flipping', tiltT > 0.05 && tiltT < 0.95);
          },
          onLeave() {
            const ang = (i + 1) * 180, norm = ang % 360, front = norm < 90 || norm >= 270;
            gsap.set(frame, { rotateY: ang, y: 0, scale: 1 });
            frame.classList.remove('is-flipping');
            imgSlides.forEach((s, idx) => {
              const active = idx === i + 1;
              gsap.set(s, { opacity: active ? 1 : 0, scaleX: active && !front ? -1 : 1 });
            });
          },
          onLeaveBack() {
            const ang = i * 180, norm = ang % 360, front = norm < 90 || norm >= 270;
            gsap.set(frame, { rotateY: ang, y: 0, scale: 1 });
            frame.classList.remove('is-flipping');
            imgSlides.forEach((s, idx) => {
              const active = idx === i;
              gsap.set(s, { opacity: active ? 1 : 0, scaleX: active && !front ? -1 : 1 });
            });
          },
        });
      }
    });

    // Sword travels from first panel centre to last, spinning as it goes
    if (sword) {
      gsap.fromTo(sword,
        { y: () => trackStart },
        {
          y: () => trackEnd,
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: () => `top+=${trackStart}px center`,
            end:   () => `top+=${trackEnd}px center`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    setTrackBounds(); // recalculate after triggers are registered
  }

  function initFooterName() {
    const el = document.getElementById('cfName');
    if (!el) return;
    function fit() {
      el.style.fontSize = '10px';
      el.style.width = 'max-content';
      const textW = el.offsetWidth;
      el.style.width = '';
      const vw = document.documentElement.clientWidth;
      el.style.fontSize = Math.floor(10 * vw / textW * 0.84) + 'px';
    }
    fit();
    window.addEventListener('resize', fit, { passive: true });
  }

  function initContact() {}

  initWebGL().then(r=>{
    renderer=r;
    setupScroll();
    ScrollTrigger.refresh();
    initSectionTitleAnims();
    initTechStackCards();
    initProcessTimeline();
    initContact();
    initFooterName();
    requestAnimationFrame(animate);
  }).catch(err=>{
    console.warn('WebGL unavailable. Falling back to CSS background.',err);
    if(section) section.classList.add('no-webgl');
    setupScroll();
    ScrollTrigger.refresh();
    initSectionTitleAnims();
    initTechStackCards();
    initProcessTimeline();
    initFooterName();
    requestAnimationFrame(animate);
  });
})();

// ── Tech Stack spotlight ──
(function() {
  document.querySelectorAll('.ts-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
    });
  });
})();
