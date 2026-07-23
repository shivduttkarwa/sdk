// Verbatim port of the original preloader IIFE (index.html A2): Canvas2D "code rain" +
// eased 0->100 arc counter over 6500ms, then adds .done / .exit and hides the overlay.
// The only additions vs the original are the tracked handles + the returned disposer.

interface PreloaderEls {
  canvas: HTMLCanvasElement;
  arc: SVGCircleElement;
  num: HTMLElement;
  root: HTMLElement;
}

export function mountPreloader({ canvas, arc, num, root }: PreloaderEls): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const kanji = '武士道侍剣魂刃忍鬼龍神将軍忠義';
  const kana = 'アイウエオカキクケコサシスセソタチツ';
  const binary = '010110010100110101010011001010';
  const sym = '{}()<>[];=>/\\&|!?#@*^~%+-_:';
  const hex = '0123456789ABCDEF';
  const jpPool = kanji.split('').concat(kana.split(''));
  const codePool = binary.split('').concat(sym.split('')).concat(hex.split(''));
  let cols: number;
  let drops: number[];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 26);
    drops = Array.from({ length: cols }, function () {
      return (Math.random() * -80) | 0;
    });
  }

  function rain() {
    ctx!.fillStyle = 'rgba(8,8,8,0.035)';
    ctx!.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
      const useJp = Math.random() > 0.48;
      const ch = useJp
        ? jpPool[(Math.random() * jpPool.length) | 0]
        : codePool[(Math.random() * codePool.length) | 0];
      const rnd = Math.random();
      if (rnd > 0.72) {
        ctx!.fillStyle = 'rgba(255,50,50,0.95)';
        ctx!.font = useJp ? 'bold 18px serif' : 'bold 16px monospace';
      } else if (rnd > 0.38) {
        ctx!.fillStyle = 'rgba(185,18,18,0.80)';
        ctx!.font = useJp ? '17px serif' : '15px monospace';
      } else {
        ctx!.fillStyle = 'rgba(110,10,10,0.58)';
        ctx!.font = useJp ? '15px serif' : '13px monospace';
      }
      ctx!.fillText(ch, i * 26, drops[i] * 26);
      if (drops[i] * 26 > canvas.height && Math.random() > 0.97) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  const rainInterval = setInterval(rain, 90);

  const C = 552.92;
  const dur = 6500;
  let t0: number;
  let rafId = 0;
  let exitTimeout = 0;
  let hideTimeout = 0;

  function ease(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function tick(now: number) {
    const raw = Math.min((now - t0) / dur, 1);
    const e = ease(raw);
    num.textContent = String(Math.round(e * 100));
    arc.style.strokeDashoffset = String(C * (1 - e));
    if (raw < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      num.textContent = '100';
      arc.style.strokeDashoffset = '0';
      arc.classList.add('done');
      num.classList.add('done');
      clearInterval(rainInterval);
      exitTimeout = window.setTimeout(function () {
        root.classList.add('exit');
        hideTimeout = window.setTimeout(function () {
          root.style.display = 'none';
          // Cue the hero title reveal only once the curtain has fully lifted — otherwise the
          // title animates in while the preloader is still covering the screen (too early).
          window.dispatchEvent(new CustomEvent('sdk:preloader-done'));
        }, 1000);
      }, 520);
    }
  }

  t0 = performance.now();
  rafId = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener('resize', resize);
    clearInterval(rainInterval);
    if (rafId) cancelAnimationFrame(rafId);
    if (exitTimeout) clearTimeout(exitTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);
  };
}
