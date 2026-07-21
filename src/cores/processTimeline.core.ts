import { gsap, ScrollTrigger } from '@/lib/gsapSetup';

type Killable = { kill: () => void };

// Verbatim port of B18c initProcessTimeline (script.js 1361-1629). matchMedia('(max-width:900px)')
// is evaluated once (initMobile vs initDesktop), matching the original (never re-bound on resize).
// The only additions are tracking of created ScrollTriggers/tweens/injected mobile <img>s + the
// resize listener, all torn down by the returned disposer.
export function mountProcessTimeline(): () => void {
  const panels = [...document.querySelectorAll('.sdk-process__step')] as HTMLElement[];
  const imgSlides = [...document.querySelectorAll('.sdk-process__frame-slide')] as HTMLElement[];
  const frame = document.getElementById('procFrame');
  const sword = document.getElementById('procSword');
  const rail = document.getElementById('procRail');
  if (!panels.length || !rail) return () => {};

  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  const triggers: Killable[] = [];
  const tweens: Killable[] = [];
  const injected: Element[] = [];

  let currentActive = -1;
  let trackStart = 0,
    trackEnd = 0;

  imgSlides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0 }));
  panels[0].classList.add('is-active');
  currentActive = 0;

  function setTrackBounds() {
    if (!panels.length) return;
    const first = panels[0],
      last = panels[panels.length - 1];
    trackStart = first.offsetTop + first.offsetHeight / 2;
    trackEnd = last.offsetTop + last.offsetHeight / 2;
  }

  function activateStep(i: number) {
    if (currentActive === i) return;
    currentActive = i;
    panels.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
  }

  setTrackBounds();
  window.addEventListener('resize', setTrackBounds, { passive: true });

  if (isMobile) {
    initMobile();
  } else {
    initDesktop();
  }

  function initMobile() {
    // Inject a per-step image inside each step panel
    panels.forEach((panel, i) => {
      const slide = imgSlides[i];
      if (!slide) return;
      const srcImg = slide.querySelector('img');
      if (!srcImg) return;
      const wrap = document.createElement('div');
      wrap.className = 'sdk-process__step-frame-mobile';
      const img = document.createElement('img');
      img.src = srcImg.src;
      img.alt = srcImg.alt || '';
      img.loading = 'lazy';
      wrap.appendChild(img);
      panel.appendChild(wrap);
      injected.push(wrap);
    });

    // Recalculate bounds now that images are in the DOM
    setTrackBounds();

    // Sword: rotating arc entrance from right, same two-step motion as desktop
    if (sword) {
      const vw = window.innerWidth;
      gsap.set(sword, { x: vw + 200, y: -300, rotation: 180 });

      const entranceTl = gsap
        .timeline({ paused: true })
        // arc through the air — mirrors desktop's first keyframe
        .fromTo(
          sword,
          { x: vw + 200, y: -300, rotation: 180 },
          { x: vw * 0.45, y: -60, rotation: 60, ease: 'none', duration: 0.55 },
        )
        // final plunge down to top of timeline line
        .to(sword, { x: 0, y: 0, rotation: 0, ease: 'none', duration: 0.45 });
      tweens.push(entranceTl);

      // Entrance completes at 'top 30%' — follow picks up from exact same point
      triggers.push(
        ScrollTrigger.create({
          trigger: rail,
          start: 'top 90%',
          end: 'top 30%',
          scrub: true,
          animation: entranceTl,
          invalidateOnRefresh: true,
        }),
      );

      // Follow the left line: y goes from 0 (line top) to trackEnd (line bottom)
      const followTween = gsap.fromTo(
        sword,
        { y: 0 },
        {
          y: () => trackEnd,
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: 'top 30%',
            end: () => `top+=${trackEnd}px center`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      tweens.push(followTween);
      if (followTween.scrollTrigger) triggers.push(followTween.scrollTrigger);
    }

    // Per-step: content + image slide in from the RIGHT
    panels.forEach((panel, i) => {
      const els = [
        ...panel.querySelectorAll(
          '.sdk-process__step-index,.sdk-process__step-title,.sdk-process__step-divider,.sdk-process__step-desc,.sdk-process__step-tags',
        ),
      ];
      const imgWrap = panel.querySelector('.sdk-process__step-frame-mobile');

      triggers.push(
        ScrollTrigger.create({
          trigger: panel,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => activateStep(i),
          onEnterBack: () => activateStep(i),
        }),
      );

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        els,
        { x: -120, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.08, ease: 'power3.out', duration: 0.45 },
      );
      if (imgWrap) {
        tl.fromTo(
          imgWrap,
          { x: 160, opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out', duration: 0.5 },
          0.22,
        );
      }
      tweens.push(tl);
      triggers.push(
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 48%',
          end: 'top -8%',
          scrub: 1,
          animation: tl,
        }),
      );
    });
  }

  function initDesktop() {
    if (!frame) return;

    if (sword) {
      gsap.set(sword, { xPercent: -50, yPercent: -50, transformPerspective: 800 });

      const entranceTl = gsap
        .timeline({ paused: true })
        .fromTo(
          sword,
          { x: 1000, y: -500, rotation: 180 },
          { x: 100, y: -80, rotation: 60, ease: 'none', duration: 0.55 },
        )
        .to(sword, { x: 0, y: () => trackStart, rotation: 0, ease: 'none', duration: 0.45 });
      tweens.push(entranceTl);

      triggers.push(
        ScrollTrigger.create({
          trigger: rail,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          animation: entranceTl,
          invalidateOnRefresh: true,
        }),
      );
    }

    const frameWrap = document.querySelector('.sdk-process__frame-wrap');
    if (frameWrap) {
      const t = gsap.fromTo(
        frameWrap,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: 'top 40%',
            end: 'top top',
            scrub: true,
          },
        },
      );
      tweens.push(t);
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    panels.forEach((panel, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: panel,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => activateStep(i),
          onEnterBack: () => activateStep(i),
        }),
      );

      const els = [
        ...panel.querySelectorAll(
          '.sdk-process__step-index,.sdk-process__step-title,.sdk-process__step-divider,.sdk-process__step-desc,.sdk-process__step-tags',
        ),
      ];
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        els,
        { x: -150, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, ease: 'power2.out', duration: 0.4 },
      );
      tweens.push(tl);
      triggers.push(
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 45%',
          end: 'top 1%',
          scrub: 1.2,
          animation: tl,
        }),
      );

      if (i < panels.length - 1) {
        const DROP = 0.35,
          DROP_PX = 80;
        triggers.push(
          ScrollTrigger.create({
            trigger: panels[i + 1],
            start: 'top bottom',
            end: 'top top',
            scrub: 1.5,
            onUpdate(self) {
              const p = self.progress;
              let y, rotateY, tiltT;
              if (p <= DROP) {
                tiltT = 0;
                y = (p / DROP) * DROP_PX;
                rotateY = i * 180;
              } else {
                tiltT = (p - DROP) / (1 - DROP);
                y = (1 - tiltT) * DROP_PX;
                rotateY = i * 180 + tiltT * 180;
              }
              gsap.set(frame!, { y, rotateY, scale: 1 - Math.sin(tiltT * Math.PI) * 0.04 });
              const norm = rotateY % 360,
                front = norm < 90 || norm >= 270;
              if (tiltT < 0.5) {
                gsap.set(imgSlides[i], { opacity: 1, scaleX: front ? 1 : -1 });
                gsap.set(imgSlides[i + 1], { opacity: 0, scaleX: 1 });
              } else {
                gsap.set(imgSlides[i], { opacity: 0 });
                gsap.set(imgSlides[i + 1], { opacity: 1, scaleX: front ? 1 : -1 });
              }
              frame!.classList.toggle('is-flipping', tiltT > 0.05 && tiltT < 0.95);
            },
            onLeave() {
              const ang = (i + 1) * 180,
                norm = ang % 360,
                front = norm < 90 || norm >= 270;
              gsap.set(frame!, { rotateY: ang, y: 0, scale: 1 });
              frame!.classList.remove('is-flipping');
              imgSlides.forEach((s, idx) => {
                const active = idx === i + 1;
                gsap.set(s, { opacity: active ? 1 : 0, scaleX: active && !front ? -1 : 1 });
              });
            },
            onLeaveBack() {
              const ang = i * 180,
                norm = ang % 360,
                front = norm < 90 || norm >= 270;
              gsap.set(frame!, { rotateY: ang, y: 0, scale: 1 });
              frame!.classList.remove('is-flipping');
              imgSlides.forEach((s, idx) => {
                const active = idx === i;
                gsap.set(s, { opacity: active ? 1 : 0, scaleX: active && !front ? -1 : 1 });
              });
            },
          }),
        );
      }
    });

    if (sword) {
      const t = gsap.fromTo(
        sword,
        { y: () => trackStart },
        {
          y: () => trackEnd,
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: () => `top+=${trackStart}px center`,
            end: () => `top+=${trackEnd}px center`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      tweens.push(t);
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    setTrackBounds();
  }

  return () => {
    window.removeEventListener('resize', setTrackBounds);
    triggers.forEach((t) => t.kill());
    tweens.forEach((t) => t.kill());
    injected.forEach((el) => el.remove());
  };
}
