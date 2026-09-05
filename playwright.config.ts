import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      testIgnore: /responsive\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    ...[
      { name: 'phone-320', width: 320, height: 740 },
      { name: 'phone-390', width: 390, height: 844 },
      { name: 'phone-landscape', width: 844, height: 390 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'laptop-1366', width: 1366, height: 768 },
      { name: 'desktop-1440', width: 1440, height: 900 },
    ].map(({ name, width, height }) => ({
      name,
      testMatch: /responsive\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width, height }, reducedMotion: 'reduce' as const },
    })),
    { name: 'iphone-webkit', testMatch: /responsive\.spec\.ts/, use: { ...devices['iPhone 13'], deviceScaleFactor: 1, video: 'off', reducedMotion: 'reduce' } },
  ],
})
