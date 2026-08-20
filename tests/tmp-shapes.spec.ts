import { test, expect } from '@playwright/test';

const OUT =
  'C:/Users/shivd/AppData/Local/Temp/claude/d--Shiv-static-port-sdk-playground/e3bca05b-b584-446e-b9fa-2728f804ebf9/scratchpad';

test('every living form renders', async ({ page }) => {
  test.setTimeout(180_000);
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => {
    if (/unavailable|ERROR:|compile/i.test(m.text())) errs.push(m.text().slice(0, 400));
  });

  await page.goto('/#/about');
  await page.waitForTimeout(10000);
  expect(await page.locator('.abt-cloud.is-live').count(), 'shader did not go live').toBe(1);

  const stops = await page.evaluate(() => {
    const box = (id: string) => {
      const el = document.querySelector(`[data-act="${id}"]`) as HTMLElement;
      return { top: el.getBoundingClientRect().top + scrollY, h: el.offsetHeight };
    };
    const vh = innerHeight;
    const R = box('road');
    const C = box('code');
    const A = box('arsenal');
    const out: Record<string, number> = {};
    ['1-star', '2-constellation', '3-orbits', '4-galaxy'].forEach((n, i) => {
      out[n] = Math.round(R.top + (R.h - vh) * (i / 3));
    });
    ['5-crystal', '6-hole', '7-river'].forEach((n, i) => {
      out[n] = Math.round(C.top + (C.h - vh) * (i / 2));
    });
    out['8-storm'] = Math.round(A.top);
    // Mid-flight of the portrait -> manifesto swirl.
    out['0-swirl'] = Math.round(box('belief').top * 0.5);
    return out;
  });

  for (const [name, y] of Object.entries(stops)) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `${OUT}/sh-${name}.png` });
  }

  console.log('ERRORS:', JSON.stringify(errs));
  expect(errs).toEqual([]);
});
