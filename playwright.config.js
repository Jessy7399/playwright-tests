import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 300000,
  fullyParallel: true,
  reporter: [['html', { open: 'on-failure', port: 9330 }]],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: false,
    slowMo: 250,
    video: 'on',
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

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment below to run on more browsers/devices
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
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
