import { test, expect } from '@playwright/test';

const SECTION_IDS = ['home', 'showcase', 'intro', 'stats', 'work', 'services', 'about', 'contact'];

test('boots with no console/page errors, preloader hides, all sections render', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));

  await page.goto('/');

  // Preloader runs ~6.5s + 520ms + 1000ms then sets display:none.
  await page.waitForFunction(
    () => {
      const pl = document.getElementById('sdk-preloader');
      return !!pl && getComputedStyle(pl).display === 'none';
    },
    { timeout: 20_000 },
  );

  // Every section is present exactly once, DOM mirrored from the original.
  for (const id of SECTION_IDS) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }

  // Nav toggle wiring: opening sets the DOM contract the CSS keys on.
  await page.locator('#menuBtn').click();
  await expect(page.locator('#twostepNav')).toHaveAttribute('data-nav-status', 'active');
  await expect(page.locator('body')).toHaveClass(/sdk-nav--open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#twostepNav')).toHaveAttribute('data-nav-status', 'inactive');

  // window.lenis singleton created (smooth scroll active).
  const hasLenis = await page.evaluate(
    () => typeof (window as { lenis?: unknown }).lenis === 'object',
  );
  expect(hasLenis).toBeTruthy();

  expect(errors, `runtime errors:\n${errors.join('\n')}`).toEqual([]);
});

test('scrolling through the page triggers no runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
  });

  await page.goto('/');
  await page.waitForFunction(
    () => getComputedStyle(document.getElementById('sdk-preloader')!).display === 'none',
    { timeout: 20_000 },
  );

  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  expect(errors, `runtime errors during scroll:\n${errors.join('\n')}`).toEqual([]);
});
