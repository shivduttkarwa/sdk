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

// Project filters
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const categories = card.dataset.category;
      if (filter === 'all' || categories.includes(filter)) {
        card.classList.remove('is-hidden');
      } else {
        card.classList.add('is-hidden');
      }
    });
  });
});

// Process active steps + mock code
const processSteps = document.querySelectorAll('.process-step');
const mockCode     = document.getElementById('mockCode');
const codeSnippets = {
  '01_DISCOVER': `<span class="green">01_DISCOVER</span>\n\n<span class="blue">brand</span>.goals()\n<span class="purple">audience</span>.map()\n<span class="gold">requirements</span>.define()\n\n// Build begins with clarity.`,
  '02_DESIGN':   `<span class="green">02_DESIGN</span>\n\n<span class="blue">layout</span>.compose()\n<span class="purple">motion</span>.prototype()\n<span class="gold">system</span>.styleGuide()\n\n// Premium look before code.`,
  '03_DEVELOP':  `<span class="green">03_DEVELOP</span>\n\n<span class="blue">frontend</span>.build()\n<span class="purple">backend</span>.connect()\n<span class="gold">cms</span>.publish()\n\n// Clean code. Smooth UI.`,
  '04_LAUNCH':   `<span class="green">04_LAUNCH</span>\n\n<span class="blue">performance</span>.test()\n<span class="purple">responsive</span>.verify()\n<span class="gold">deploy</span>.ship()\n\n// Ready for the world.`
};

function setActiveProcess(step) {
  processSteps.forEach(s => s.classList.remove('is-active'));
  step.classList.add('is-active');
  mockCode.innerHTML = codeSnippets[step.dataset.code];
}

processSteps.forEach(step => {
  step.addEventListener('mouseenter', () => setActiveProcess(step));
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

// Count-up stats
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el       = entry.target;
    const target   = Number(el.dataset.count);
    const suffix   = target === 100 ? '%' : '+';
    const duration = 1200;
    const start    = performance.now();

    function update(now) {
      const p     = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(p * target) + suffix;
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    countObserver.unobserve(el);
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

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


  gsap.utils.toArray('.process-step').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top center',
      end: 'bottom center',
      onEnter:     () => setActiveProcess(step),
      onEnterBack: () => setActiveProcess(step)
    });
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

  // Wide sim to match the 3-column row (~3:1)
  const SIM_W = 384, SIM_H = 128;

  const VS = `attribute vec2 a_pos; varying vec2 v_uv;
    void main(){ v_uv=a_pos*.5+.5; gl_Position=vec4(a_pos,0.,1.); }`;

  // Fat organic brush: line-segment distance + 9-tap diffusion + fade
  const TRAIL_FS = `
    precision highp float;
    uniform sampler2D u_trail;
    uniform vec2  u_res, u_mouse, u_pmouse;
    uniform float u_moving, u_ar;
    varying vec2  v_uv;
    void main(){
      vec2  px = 1./u_res;
      // 9-tap Gaussian — spreads the stroke organically each frame
      float c  = texture2D(u_trail,v_uv              ).r*.36;
      float l  = texture2D(u_trail,v_uv-vec2(px.x,0.)).r*.12;
      float r  = texture2D(u_trail,v_uv+vec2(px.x,0.)).r*.12;
      float u  = texture2D(u_trail,v_uv+vec2(0.,px.y)).r*.12;
      float d  = texture2D(u_trail,v_uv-vec2(0.,px.y)).r*.12;
      float ul = texture2D(u_trail,v_uv+vec2(-px.x, px.y)).r*.04;
      float ur = texture2D(u_trail,v_uv+vec2( px.x, px.y)).r*.04;
      float dl = texture2D(u_trail,v_uv+vec2(-px.x,-px.y)).r*.04;
      float dr = texture2D(u_trail,v_uv+vec2( px.x,-px.y)).r*.04;
      float trail = (c+l+r+u+d+ul+ur+dl+dr) * .978;
      // Line-segment distance → continuous stroke, no gaps at any speed
      vec2  a    = u_pmouse * vec2(u_ar, 1.);
      vec2  b    = u_mouse  * vec2(u_ar, 1.);
      vec2  p    = v_uv     * vec2(u_ar, 1.);
      vec2  ab   = b - a;
      float len2 = dot(ab, ab);
      float t    = len2 > 0.00001 ? clamp(dot(p-a, ab)/len2, 0., 1.) : 0.;
      float dist = length(p - (a + t*ab));
      float speed = sqrt(len2);
      // k=120 → ~175px radius at 900px section height (fat brush like cappen)
      float splat = exp(-dist*dist*120.) * clamp(speed*5.+0.18, 0., 1.8) * u_moving;
      trail = clamp(trail + splat, 0., 1.);
      gl_FragColor = vec4(trail, 0., 0., 1.);
    }`;

  // Render: 3 bg textures selected per horizontal third, refraction, no edge border
  const RENDER_FS = `
    precision highp float;
    uniform sampler2D u_trail, u_bg0, u_bg1, u_bg2;
    uniform vec2 u_simRes;
    varying vec2 v_uv;
    void main(){
      vec2  spx  = 1./u_simRes;
      float tR   = texture2D(u_trail,v_uv+vec2(spx.x,0.)).r;
      float tL   = texture2D(u_trail,v_uv-vec2(spx.x,0.)).r;
      float tU   = texture2D(u_trail,v_uv+vec2(0.,spx.y)).r;
      float tD   = texture2D(u_trail,v_uv-vec2(0.,spx.y)).r;
      vec2  grad = vec2(tR-tL, tU-tD);
      float mag  = length(grad);
      float trail = texture2D(u_trail,v_uv).r;
      vec2  dUV  = v_uv + grad*0.030;
      float ca   = mag*0.006;
      float seg  = 1./3.;
      vec2 uv0 = vec2( dUV.x           / seg, dUV.y);
      vec2 uv1 = vec2((dUV.x -   seg)  / seg, dUV.y);
      vec2 uv2 = vec2((dUV.x - 2.*seg) / seg, dUV.y);
      vec3 c0 = vec3(texture2D(u_bg0,uv0+vec2(ca,0.)).r, texture2D(u_bg0,uv0).g, texture2D(u_bg0,uv0-vec2(ca,0.)).b) * .86;
      vec3 c1 = vec3(texture2D(u_bg1,uv1+vec2(ca,0.)).r, texture2D(u_bg1,uv1).g, texture2D(u_bg1,uv1-vec2(ca,0.)).b) * .86;
      vec3 c2 = vec3(texture2D(u_bg2,uv2+vec2(ca,0.)).r, texture2D(u_bg2,uv2).g, texture2D(u_bg2,uv2-vec2(ca,0.)).b) * .86;
      float s1 = step(seg,      v_uv.x);
      float s2 = step(2.*seg,   v_uv.x);
      vec3  col = mix(mix(c0, c1, s1), c2, s2);
      gl_FragColor = vec4(clamp(col,0.,1.), smoothstep(.012,.14,trail));
    }`;

  function mkShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error('[stats-water]', gl.getShaderInfoLog(s));
    return s;
  }
  function mkProg(gl, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p); return p;
  }
  function mkFBO(gl, w, h) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.LINEAR));
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex, fbo };
  }
  function mkTex(gl, unit) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([5,5,10,255]));
    [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.LINEAR));
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
    return t;
  }

  // Single canvas covering the full row
  const canvas = document.createElement('canvas');
  canvas.className = 'stats-blob-canvas';
  row.prepend(canvas);

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) { canvas.remove(); return; }

  const trailProg  = mkProg(gl, TRAIL_FS);
  const renderProg = mkProg(gl, RENDER_FS);

  const tL = {
    pos:    gl.getAttribLocation(trailProg,  'a_pos'),
    trail:  gl.getUniformLocation(trailProg, 'u_trail'),
    res:    gl.getUniformLocation(trailProg, 'u_res'),
    mouse:  gl.getUniformLocation(trailProg, 'u_mouse'),
    pmouse: gl.getUniformLocation(trailProg, 'u_pmouse'),
    moving: gl.getUniformLocation(trailProg, 'u_moving'),
    ar:     gl.getUniformLocation(trailProg, 'u_ar'),
  };
  const rL = {
    pos:    gl.getAttribLocation(renderProg,  'a_pos'),
    trail:  gl.getUniformLocation(renderProg, 'u_trail'),
    bg0:    gl.getUniformLocation(renderProg, 'u_bg0'),
    bg1:    gl.getUniformLocation(renderProg, 'u_bg1'),
    bg2:    gl.getUniformLocation(renderProg, 'u_bg2'),
    simRes: gl.getUniformLocation(renderProg, 'u_simRes'),
  };

  // Static uniforms
  gl.useProgram(trailProg);
  gl.uniform1i(tL.trail, 0);
  gl.uniform2f(tL.res, SIM_W, SIM_H);
  gl.useProgram(renderProg);
  gl.uniform1i(rL.trail, 0);
  gl.uniform1i(rL.bg0, 1);
  gl.uniform1i(rL.bg1, 2);
  gl.uniform1i(rL.bg2, 3);
  gl.uniform2f(rL.simRes, SIM_W, SIM_H);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]), gl.STATIC_DRAW);

  let fboR = mkFBO(gl, SIM_W, SIM_H);
  let fboW = mkFBO(gl, SIM_W, SIM_H);
  [fboR, fboW].forEach(f => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
    gl.viewport(0, 0, SIM_W, SIM_H);
    gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT);
  });
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clearColor(0,0,0,0);

  // Load 3 bg textures onto units 1, 2, 3
  const bgTextures = [mkTex(gl,1), mkTex(gl,2), mkTex(gl,3)];
  IMAGES.forEach((url, i) => {
    fetch(url, { mode: 'cors' })
      .then(r => r.blob())
      .then(b => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none' }))
      .then(bmp => {
        gl.activeTexture(gl.TEXTURE1 + i);
        gl.bindTexture(gl.TEXTURE_2D, bgTextures[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
        bmp.close();
      }).catch(() => {});
  });

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5, pmx = 0.5, pmy = 0.5;
  let moving = 0, lastMove = 0;

  row.addEventListener('mousemove', e => {
    const r = row.getBoundingClientRect();
    mx = (e.clientX - r.left)  / r.width;
    my = 1.0 - (e.clientY - r.top) / r.height;
    moving = 1;
    lastMove = performance.now();
  });
  // No mouseenter/mouseleave needed — only movement triggers the trail

  function resize() {
    canvas.width  = row.clientWidth;
    canvas.height = row.clientHeight;
    gl.useProgram(trailProg);
    gl.uniform1f(tL.ar, (canvas.width || 1) / (canvas.height || 1));
  }
  resize();
  new ResizeObserver(resize).observe(row);

  (function render() {
    requestAnimationFrame(render);

    // Stop adding trail ~120ms after cursor stops
    if (moving && performance.now() - lastMove > 120) moving = 0;

    pmx = smx; pmy = smy;
    smx += (mx - smx) * 0.16;
    smy += (my - smy) * 0.16;

    // ── Trail ping-pong ───────────────────────────────────────────────────
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboW.fbo);
    gl.viewport(0, 0, SIM_W, SIM_H);
    gl.useProgram(trailProg);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(tL.pos);
    gl.vertexAttribPointer(tL.pos, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fboR.tex);
    gl.uniform2f(tL.mouse,  smx, smy);
    gl.uniform2f(tL.pmouse, pmx, pmy);
    gl.uniform1f(tL.moving, moving);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    [fboR, fboW] = [fboW, fboR];

    // ── Render to canvas ──────────────────────────────────────────────────
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width || 1, canvas.height || 1);
    gl.useProgram(renderProg);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(rL.pos);
    gl.vertexAttribPointer(rL.pos, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fboR.tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, bgTextures[0]);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, bgTextures[1]);
    gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, bgTextures[2]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  })();
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

      float glow = exp(-edgeDist * 36.0) * 1.5;
      col += vec3(0.18, 0.50, 1.00) * glow * 0.55;
      col += vec3(0.56, 0.36, 1.00) * glow * 0.35;

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

  loadBitmap(
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80',
    0, texBg
  );
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
