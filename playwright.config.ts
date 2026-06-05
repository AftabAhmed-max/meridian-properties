import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Meridian Properties.
 *
 * Tests run ONLY against the live Vercel deployment — never localhost.
 * There is no `webServer` block on purpose: we do not boot a local app.
 *
 * Data model reminder (see Step 1 findings): properties live in the browser's
 * localStorage under the key `meridian_properties`, seeded from
 * data/properties.json on first load. Each Playwright test gets a FRESH browser
 * context, so every test starts from the clean 32-record seed and mutations in
 * one test never leak into another.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'https://meridian-properties-eta.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
