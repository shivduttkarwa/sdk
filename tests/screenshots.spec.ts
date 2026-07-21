import { test } from '@playwright/test';
import fs from 'node:fs';

const OUT = 'test-results/shots';

// Dev aid (not a correctness gate): screenshots on a very tall page with live WebGL loops are
// slow, so give it a generous budget.
test('capture key states for visual review', async ({ page }) => {
  test.setTimeout(180_000);
  fs.mkdirSync(OUT, { recursive: true });
  await page.goto('/');
  await page.waitForFunction(
    () => getComputedStyle(document.getElementById('sdk-preloader')!).display === 'none',
    { timeout: 20_000 },
  );
  await page.waitForTimeout(500);

  const height = await page.evaluate(() => document.body.scrollHeight);
  // The page is very tall (multiple pinned/runway sections); sample a fixed number of evenly
  // spaced positions.
  const SHOTS = 12;
  const step = Math.max(1, Math.floor(height / SHOTS));
  for (let i = 0; i < SHOTS; i++) {
    const y = i * step;
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    // let Lenis + ScrollTrigger settle for this position
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${OUT}/scroll-${String(i).padStart(2, '0')}-y${y}.png` });
  }
});
