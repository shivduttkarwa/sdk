import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const VW of [1440, 407]) {
  const p = await b.newPage({ viewport: { width: VW, height: 900 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('http://localhost:4173/', { waitUntil: 'load' });
  await p.waitForSelector('#sdk-work-runway');
  await p.waitForTimeout(2500);
  const g = await p.evaluate(() => {
    const r = document.getElementById('sdk-work-runway');
    return { top: window.scrollY + r.getBoundingClientRect().top, h: r.offsetHeight };
  });
  const travel = g.h - 900;
  let dead = 0, n = 0;
  const seq = [];
  for (let i = 0; i <= 40; i++) {
    await p.evaluate((y) => window.scrollTo(0, y), g.top + (travel * i) / 40);
    await p.waitForTimeout(70);
    const top = await p.evaluate(() => Math.max(...[...document.querySelectorAll('.sdk-work-story')].map((s) => parseFloat(getComputedStyle(s).opacity))));
    n++; if (top < 0.05) dead++;
    seq.push(top.toFixed(2));
  }
  console.log(`${String(VW).padStart(4)}px  frames with NO story visible: ${dead}/${n}  ${errs.length ? 'ERR' : ''}`);
  console.log(`        peak opacity across runway: ${seq.filter((_, i) => i % 4 === 0).join(' ')}`);
  await p.close();
}
await b.close();
