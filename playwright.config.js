import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 200000,
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: false,
    slowMo: 250,
  },
  webServer: [
    {
      command: 'npm start',
      port: 3000,
      cwd: '../frontend',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'npm run start',
      port: 5000,
      cwd: '../backend',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
  use: {
    video: 'on',
  },
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // // Mobile devices
    // {
    //   name: 'Pixel 5',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'iPhone 12',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
});
