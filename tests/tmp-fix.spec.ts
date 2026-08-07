import { test, expect } from '@playwright/test';

const OUT = 'C:/Users/shivd/AppData/Local/Temp/claude/d--Shiv-static-port-sdk-playground/6c0463f1-dbd9-4667-8c90-0cf3f9a6a2f3/scratchpad';

test('title does not drift while the panel grows', async ({ page }) => {
  await page.goto('/#/services');
  await page.waitForTimeout(6000);
  await page.locator('.svc-rack').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Open panel 3 and sample the heading's top edge + line count every 60ms through the
  // whole 0.75s grow. Reflow would show up as the top moving and lineCount changing.
  await page.locator('.svc-panel').nth(2).hover();

  const samples: { t: number; top: number; h: number; lines: number }[] = [];
  for (let i = 0; i < 16; i++) {
    const s = await page.locator('.svc-panel').nth(2).locator('.svc-panel__heading').evaluate((el) => {
      const r = el.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      return { top: Math.round(r.top), h: Math.round(r.height), lines: Math.round(r.height / lh) };
    });
    samples.push({ t: i * 60, ...s });
    await page.waitForTimeout(60);
  }

  const tops = samples.map((s) => s.top);
  const lines = samples.map((s) => s.lines);
  // Ignore the first sample: the entrance keyframe's own .5rem lift is intentional.
  const settled = tops.slice(3);
  const drift = Math.max(...settled) - Math.min(...settled);
  console.log('TOPS:', JSON.stringify(tops));
  console.log('LINECOUNTS:', JSON.stringify(lines));
  console.log('DRIFT_PX_AFTER_ENTRANCE:', drift);

  expect(new Set(lines).size, `heading re-wrapped: ${lines}`).toBe(1);
  expect(drift, 'heading drifted during grow').toBeLessThanOrEqual(2);

  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/f1-settled.png` });
});
