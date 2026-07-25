import { chromium } from '@playwright/test';
import fs from 'node:fs';
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader'] });
for (const [tag,w,h] of [['mobile ',390,844],['desktop',1440,900]]) {
  const page = await browser.newPage({ viewport:{width:w,height:h}, isMobile:w<900, hasTouch:w<900 });
  const errors = [];
  page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5174/', { waitUntil:'load' });
  await page.waitForFunction(()=>{const p=document.getElementById('sdk-preloader');return !p||getComputedStyle(p).display==='none';},{timeout:25000}).catch(()=>{});
  await page.waitForTimeout(2000);
  const g = await page.evaluate(() => {
    const b = document.querySelector('.sdk-intro__body').getBoundingClientRect();
    return { vh: window.innerHeight, bodyTop: Math.round(b.top + window.scrollY) };
  });
  console.log(`\n=== ${tag} (words revealed as the paragraph rises) ===`);
  // sample paragraph-top positions from just-entering to well past centre
  for (const frac of [0.95, 0.85, 0.70, 0.55, 0.40, 0.30, 0.20]) {
    const y = Math.round(g.bodyTop - g.vh * frac);
    await page.evaluate((yy)=>window.scrollTo(0,yy), y);
    await page.waitForTimeout(1600);
    const s = await page.evaluate(() => {
      const words = [...document.querySelectorAll('.sdk-intro__word')];
      const rev = words.filter(w => parseFloat(getComputedStyle(w).opacity) > 0.9).length;
      const b = document.querySelector('.sdk-intro__body').getBoundingClientRect();
      return { rev, total: words.length, top: Math.round(b.top) };
    });
    const pct = Math.round((s.rev / s.total) * 100);
    console.log(`  paragraph top at ${String(s.top).padStart(4)}px (${Math.round(frac*100)}% down)  ->  ${String(s.rev).padStart(2)}/${s.total} words (${pct}%)`);
    if (frac === 0.35 || frac === 0.40) await page.screenshot({ path: `${OUT}/${tag.trim()}-centred.png` });
  }
  console.log('  errors:', errors.length ? errors.join(' | ') : 'none');
  await page.close();
}
await browser.close();
