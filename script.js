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

  gsap.to('.showreel-frame', {
    scale: 0.96,
    borderRadius: '44px',
    ease: 'none',
    scrollTrigger: {
      trigger: '.showreel',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
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
