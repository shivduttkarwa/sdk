const body          = document.body;
const navRoot       = document.getElementById('twostepNav');
const menuBtn       = document.getElementById('menuBtn');
const menuPanel     = document.getElementById('menuPanel');
const navClosers    = document.querySelectorAll('[data-nav-toggle="close"]');
const year          = document.getElementById('year');

year.textContent = new Date().getFullYear();

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


// Hero rotating words
(function initRotatingWords() {
  const words = document.querySelectorAll('.hero-rotating-word');
  if (!words.length) return;
  let current = 0;

  setInterval(() => {
    const prev = current;
    current = (current + 1) % words.length;
    words[prev].classList.remove('is-active');
    words[prev].classList.add('is-exit');
    setTimeout(() => words[prev].classList.remove('is-exit'), 600);
    words[current].classList.add('is-active');
  }, 2200);
})();


function startHeroAnimation() {
  if (!window.gsap) return;
  gsap.from('.hero-line .inner', {
    yPercent: 105,
    duration: 1.2,
    stagger: 0.14,
    ease: 'power4.out',
    delay: 0.1
  });
  gsap.from('#heroVideoWrap', {
    opacity: 0,
    scale: 0.88,
    duration: 1.4,
    ease: 'power3.out',
    delay: 0.2
  });
gsap.from('.hero-meta, .scroll-indicator', {
    opacity: 0,
    y: 14,
    duration: 1,
    stagger: 0.07,
    ease: 'power2.out',
    delay: 0.5
  });
}

// GSAP scroll animations
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Pill expands to fullscreen on scroll
  const heroWrap    = document.getElementById('heroVideoWrap');
  const heroParticlesWrap = document.getElementById('heroParticles');
  const heroSection = document.querySelector('.hero');
  const particlesMaxOpacity = 0.85;
  const setParticlesOpacity = heroParticlesWrap ? gsap.quickSetter(heroParticlesWrap, 'opacity') : null;
  if (heroWrap && heroSection) {
    if (setParticlesOpacity) setParticlesOpacity(particlesMaxOpacity);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '+=100%',
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          if (setParticlesOpacity) {
            setParticlesOpacity((1 - self.progress) * particlesMaxOpacity);
          }
        },
        onLeaveBack: () => {
          if (setParticlesOpacity) {
            setParticlesOpacity(particlesMaxOpacity);
          }
        }
      }
    });

    tl.to(heroWrap, {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      ease: 'none'
    }, 0);

    tl.to('.hero-line-top', { y: -60, opacity: 0, ease: 'none' }, 0);
    tl.to('.hero-line-bottom', { y: 60, opacity: 0, ease: 'none' }, 0);
    tl.to('.hero-meta, .scroll-indicator', {
      opacity: 0,
      ease: 'none',
      duration: 0.3
    }, 0);
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
    'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  ];

  const SIM_W = 256, SIM_H = 96;

  const canvas = document.createElement('canvas');
  canvas.className = 'stats-blob-canvas';
  row.prepend(canvas);

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
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
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
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

// ── Bento cards: staggered scroll-reveal ──
(function initBentoCards() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const cards = document.querySelectorAll('.bento-card');
  if (!cards.length) return;

  gsap.fromTo(cards,
    { y: 48, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: { each: 0.08, from: 'start' },
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 82%',
        once: true
      }
    }
  );
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
    scrollTrigger: { trigger: section, start: 'top 90%', toggleActions: 'play none none none' }
  });

  master.to(ruleTop, { scaleX: 1, duration: 1, ease: 'power3.inOut' });
  master.to(dividers, { scaleY: 1, duration: 1, ease: 'power3.inOut', stagger: 0.15 }, '-=0.7');

  items.forEach((item, i) => {
    const num    = item.querySelector('.si-num');
    const sup    = item.querySelector('.si-sup');
    const foot   = item.querySelector('.si-foot');
    const target = parseInt(num.dataset.target || '0', 10);

    master
      .to([num, sup], { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.06 }, '-=0.6')
      .to(foot,       { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .to({}, {
        duration: 1, ease: 'power2.out',
        onUpdate() { num.textContent = Math.round(this.progress() * target); },
        onComplete() { num.textContent = target; },
      }, '-=0.8');
  });

  master.to(ruleBot, { scaleX: 1, duration: 1, ease: 'power3.inOut' }, '-=0.4');
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
  const hero   = document.getElementById('home');
  const canvas = document.getElementById('hero-blob-canvas');
  if (!hero || !canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
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
    uniform vec2      u_mouse;
    uniform float     u_time;
    uniform float     u_radius;
    uniform vec2      u_res;
    uniform float     u_portW;
    uniform float     u_smoke;
    uniform float     u_opacity;
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

      float pw   = max(u_portW, 0.001);
      vec2  pUV  = vec2(uv.x / pw, uv.y);

      float edgeDist = abs(bDist - r);
      float ca = smoothstep(0.06, 0.0, edgeDist) * 0.010;
      vec3 port;
      port.r = texture2D(u_portrait, pUV + vec2( ca, 0.0)).r;
      port.g = texture2D(u_portrait, pUV                 ).g;
      port.b = texture2D(u_portrait, pUV - vec2( ca, 0.0)).b;

      float inStrip = 1.0 - smoothstep(pw * 0.82, pw * 1.08, uv.x);
      vec3 bg    = texture2D(u_bg, uv).rgb * 0.88;
      vec3 inner = mix(bg, port, inStrip * 0.78);
      vec3 col   = inner * mask;

      float glow = exp(-edgeDist * 36.0) * 0.5;
      col += vec3(0.88, 0.16, 0.22) * glow * 0.18;
      col += vec3(0.55, 0.06, 0.14) * glow * 0.10;

      float grain = (rand(uv * 540.0 + fract(u_time * 0.07)) - 0.5) * 0.042;
      col += grain;

      vec2 vc  = uv * 2.0 - 1.0;
      col *= 1.0 - dot(vc, vc) * 0.32;

      float alpha = clamp(mask + glow * 0.55, 0.0, 1.0) * u_opacity;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), alpha);
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
  const uSmoke   = gl.getUniformLocation(prog, 'u_smoke');
  const uOpacity = gl.getUniformLocation(prog, 'u_opacity');
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
  const texBg   = allocTex(0);
  const texPort = allocTex(1);
  gl.uniform1i(uBg,   0);
  gl.uniform1i(uPort, 1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  function loadBitmap(url, unit, tex) {
    fetch(url, { mode: 'cors' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then(b  => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none' }))
      .then(bmp => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
        bmp.close();
      })
      .catch(e => console.warn('[blob] texture load failed:', url, e));
  }

  loadBitmap('./assets/hero-main-bg.png', 0, texBg);
  loadBitmap('./assets/1111.png', 1, texPort);

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
  function render() {
    smx += (mx - smx) * 0.08;
    smy += (my - smy) * 0.08;
    const t = (performance.now() - t0) / 1000;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uMouse,  smx, smy);
    gl.uniform1f(uTime,   t);
    gl.uniform1f(uRadius, 0.38);
    gl.uniform2f(uRes,    canvas.width, canvas.height);
    gl.uniform1f(uSmoke,   anim.smoke);
    gl.uniform1f(uOpacity, anim.opacity);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
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
