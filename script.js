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
gsap.from('.hero-meta, .hero-right-cta, .scroll-indicator', {
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
    tl.to('.hero-meta, .hero-right-cta, .scroll-indicator', {
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
