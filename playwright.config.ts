import { defineConfig, devices } from '@playwright/test';

// Verification harness. `npm run test:visual` builds nothing itself — it serves the existing
// production build (docs/, via `vite preview`) and runs the smoke + screenshot specs.
// For the full NEW-vs-ORIGINAL visual regression, serve the pre-port checkout separately
// (see README) and point the comparison spec at it.
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'off',
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Deterministic software GL so canvas regions render consistently.
        launchOptions: { args: ['--use-gl=angle', '--use-angle=swiftshader'] },
      },
    },
  ],
});
