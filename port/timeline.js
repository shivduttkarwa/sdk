/* ───────────────────────────────────────────────
   Web Dev Timeline — scroll behaviours
   • IntersectionObserver enters each step from L/R
   • Sword rotates + bobs as you scroll the spine
─────────────────────────────────────────────── */

(() => {
  const steps    = document.querySelectorAll('.step');
  const timeline = document.getElementById('timeline');
  const sword    = document.getElementById('swordWrap');

  /* ── 1. enter animations ─────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
      } else if (e.boundingClientRect.top > window.innerHeight) {
        // only reset when it goes back BELOW the viewport — feels nicer
        e.target.classList.remove('in');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  steps.forEach((s) => io.observe(s));

  /* ── 2. sword scroll-rotation ────────────────── */
  // total rotation across the timeline: lots of turns for drama
  const TOTAL_TURNS    = 3;                   // full revolutions
  const TOTAL_DEGREES  = TOTAL_TURNS * 360;   // 1080°
  const SWAY_PX        = 24;                  // gentle vertical bob

  let ticking = false;
  let cachedTop = 0, cachedHeight = 0, cachedVH = 0;

  function measure() {
    const r = timeline.getBoundingClientRect();
    cachedTop    = r.top + window.scrollY;
    cachedHeight = timeline.offsetHeight;
    cachedVH     = window.innerHeight;
  }

  function update() {
    ticking = false;

    // progress: 0 when timeline first reaches viewport center,
    //           1 when timeline's end leaves viewport center
    const y          = window.scrollY + cachedVH * 0.5;
    const start      = cachedTop;
    const end        = cachedTop + cachedHeight;
    const raw        = (y - start) / (end - start);
    const progress   = Math.max(0, Math.min(1, raw));

    const rot = progress * TOTAL_DEGREES;
    const bob = Math.sin(progress * Math.PI * 6) * SWAY_PX;

    sword.style.transform =
      `translate(-50%, calc(-50% + ${bob}px)) rotateY(${rot}deg)`;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function onResize() {
    measure();
    update();
  }

  // boot
  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  /* ── 3. custom sword image picker ────────────── */
  const upload   = document.getElementById('swordUpload');
  const reset    = document.getElementById('swordReset');
  const swordImg = document.getElementById('swordImg');
  const wrap     = sword;
  const LS_KEY   = 'forge_custom_sword';

  function applyCustomImage(dataUrl) {
    swordImg.src = dataUrl;
    wrap.classList.add('has-custom');
    document.body.classList.add('has-custom');
  }
  function clearCustomImage() {
    swordImg.removeAttribute('src');
    wrap.classList.remove('has-custom');
    document.body.classList.remove('has-custom');
    localStorage.removeItem(LS_KEY);
  }

  // restore on load
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) applyCustomImage(saved);
  } catch (e) { /* ignore */ }

  upload?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      applyCustomImage(url);
      try { localStorage.setItem(LS_KEY, url); } catch (err) { /* quota */ }
    };
    reader.readAsDataURL(file);
    // allow re-uploading same filename
    e.target.value = '';
  });

  reset?.addEventListener('click', clearCustomImage);
})();
