// Ember field: slow-rising forge sparks behind the contact hero. Pure canvas, one rAF
// loop that only runs while the canvas is on screen (IntersectionObserver) and pauses
// when the tab is hidden. Mounted only when prefers-reduced-motion is off (the hook
// gates it), so there is no static fallback to draw here.

interface Ember {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
  flicker: number;
  hue: 'red' | 'gold';
  alpha: number;
}

export function mountEmberField(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let width = 0;
  let height = 0;
  let raf = 0;
  let visible = true;
  let disposed = false;
  let embers: Ember[] = [];

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const spawn = (atBottom: boolean): Ember => ({
    x: Math.random() * width,
    y: atBottom ? height + 10 : Math.random() * height,
    radius: 0.6 + Math.random() * 1.8,
    speed: 0.12 + Math.random() * 0.4,
    drift: (Math.random() - 0.5) * 0.35,
    phase: Math.random() * Math.PI * 2,
    flicker: 0.5 + Math.random() * 2,
    hue: Math.random() < 0.82 ? 'red' : 'gold',
    alpha: 0.25 + Math.random() * 0.5,
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(Math.min(90, (width * height) / 26000));
    embers = Array.from({ length: target }, () => spawn(false));
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const tick = (time: number) => {
    raf = 0;
    if (disposed || !visible) return;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < embers.length; i++) {
      let e = embers[i];
      e.y -= e.speed;
      e.x += e.drift + Math.sin(time * 0.0006 * e.flicker + e.phase) * 0.22;
      if (e.y < -12 || e.x < -12 || e.x > width + 12) {
        embers[i] = e = spawn(true);
      }
      const pulse = 0.65 + 0.35 * Math.sin(time * 0.002 * e.flicker + e.phase);
      const a = e.alpha * pulse;
      const glow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius * 5);
      if (e.hue === 'red') {
        glow.addColorStop(0, `rgba(255, 120, 110, ${a})`);
        glow.addColorStop(0.4, `rgba(224, 63, 79, ${a * 0.55})`);
        glow.addColorStop(1, 'rgba(224, 63, 79, 0)');
      } else {
        glow.addColorStop(0, `rgba(255, 230, 160, ${a})`);
        glow.addColorStop(0.4, `rgba(245, 215, 110, ${a * 0.5})`);
        glow.addColorStop(1, 'rgba(245, 215, 110, 0)');
      }
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible && !raf && !document.hidden) raf = requestAnimationFrame(tick);
  });
  io.observe(canvas);

  const onVisibility = () => {
    if (!document.hidden && visible && !raf) raf = requestAnimationFrame(tick);
  };
  document.addEventListener('visibilitychange', onVisibility);

  raf = requestAnimationFrame(tick);

  return () => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    observer.disconnect();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
