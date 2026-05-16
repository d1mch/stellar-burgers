import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.ts',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4000',
    reuseExistingServer: true,
    timeout: 120000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});