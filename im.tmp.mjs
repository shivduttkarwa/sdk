import { chromium } from '@playwright/test';
const browser = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader'] });
for (const [tag,w,h] of [['mobile 390x844',390,844],['desktop 1440x900',1440,900]]) {
  const page = await browser.newPage({ viewport:{width:w,height:h}, isMobile:w<900, hasTouch:w<900 });
  await page.goto('http://localhost:5174/', { waitUntil:'load' });
  await page.waitForFunction(()=>{const p=document.getElementById('sdk-preloader');return !p||getComputedStyle(p).display==='none';},{timeout:25000}).catch(()=>{});
  await page.waitForTimeout(2000);
  const g = await page.evaluate(() => {
    const sec = document.querySelector('.sdk-intro');
    const body = document.querySelector('.sdk-intro__body');
    const sr = sec.getBoundingClientRect(), br = body.getBoundingClientRect();
    return {
      vh: window.innerHeight,
      secTop: Math.round(sr.top + window.scrollY),
      secH: Math.round(sr.height),
      bodyTop: Math.round(br.top + window.scrollY),
      bodyH: Math.round(br.height),
      bodyOffsetInSec: Math.round(br.top - sr.top),
      words: document.querySelectorAll('.sdk-intro__word').length,
    };
  });
  // scroll so the paragraph is centred, then see how much of it has revealed
  const y = g.bodyTop - Math.round(g.vh * 0.35);
  await page.evaluate((yy)=>window.scrollTo(0,yy), y);
  await page.waitForTimeout(2000);
  const state = await page.evaluate(() => {
    const words = [...document.querySelectorAll('.sdk-intro__word')];
    const revealed = words.filter(w => parseFloat(getComputedStyle(w).opacity) > 0.9).length;
    const body = document.querySelector('.sdk-intro__body').getBoundingClientRect();
    return { revealed, total: words.length, bodyTopInVp: Math.round(body.top), bodyBottomInVp: Math.round(body.bottom) };
  });
  console.log(tag, JSON.stringify({...g, atParagraphCentred: state}, null, 1));
  await page.close();
}
await browser.close();
