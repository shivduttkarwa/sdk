import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });

async function state(label) {
  const d = await page.evaluate(() => {
    const pl = document.getElementById('sdk-preloader');
    const inner = document.querySelector('.sdk-hero__name--primary .sdk-hero__line-inner');
    const plRect = pl.getBoundingClientRect();
    return {
      plDisplay: getComputedStyle(pl).display,
      plTopY: Math.round(plRect.top),           // 0 = covering, negative = lifted
      titleTy: inner ? Math.round(new DOMMatrixReadOnly(getComputedStyle(inner).transform).m42) : null,
    };
  });
  console.log(label, JSON.stringify(d));
  return d;
}

await page.waitForTimeout(7500); await state('7.5s (curtain lifting)');
await page.waitForTimeout(500); await state('8.0s (curtain ~gone)');
await page.screenshot({ path: 'scratch-8.png' });
await page.waitForTimeout(900); await state('8.9s (title should be revealing/revealed)');
await page.screenshot({ path: 'scratch-9.png' });
await browser.close();
