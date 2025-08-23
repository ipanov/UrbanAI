import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration - Optimized for 2025 Best Practices
 * Uses ONLY embedded Chromium browsers for optimal performance and reliability
 * Follows CLAUDE.md guidelines: "Always use embedded browsers"
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Optimize workers for performance */
  workers: process.env.CI ? 2 : 4,
  /* Enhanced reporter configuration */
  reporter: process.env.CI ? 
    [['github'], ['html'], ['junit', { outputFile: 'test-results.xml' }]] : 
    'html',
  /* Use project dependencies for better server management */
  // globalSetup: './tests/e2e/global-setup.ts',
  // globalTeardown: './tests/e2e/global-teardown.ts',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3100', // Use different port to avoid conflicts

    /* Optimized trace and debugging configuration */
    trace: process.env.CI ? 'retain-on-failure' : (process.env.DEBUG ? 'on' : 'on-first-retry'),

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Enhanced video configuration */
    video: process.env.DEBUG ? 'on' : 'retain-on-failure',

    /* Optimized timeouts for faster feedback */
    actionTimeout: 15 * 1000,
    navigationTimeout: 20 * 1000,

    /* Force headless mode - embedded browsers only */
    headless: true,
  },

  /* Configure projects - EMBEDDED BROWSERS ONLY per CLAUDE.md guidelines */
  projects: [
    /* Setup project for server management */
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
      teardown: 'cleanup',
    },
    
    /* Cleanup project */
    {
      name: 'cleanup',
      testMatch: /global\.teardown\.ts/,
    },

    /* Primary testing with embedded Chromium only - Fast and reliable */
    {
      name: 'chromium-fast',
      testMatch: /.*\.spec\.ts$/,
      dependencies: ['setup'],
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        headless: true, // Force headless
      },
    },

    /* Smoke tests for critical paths - embedded Chromium only */
    {
      name: 'smoke',
      testMatch: /.*smoke.*\.spec\.ts$/,
      dependencies: ['setup'],
      use: { 
        ...devices['Desktop Chrome'],
        headless: true, // Force headless
      },
      retries: 0,
    },

    /* Mobile testing with embedded browsers only */
    {
      name: 'mobile-chrome',
      testMatch: /.*mobile.*\.spec\.ts$/,
      dependencies: ['setup'],
      use: { 
        ...devices['Pixel 5'],
        headless: true, // Force headless
      },
    },
  ],

  /* Configure test servers - isolated ports to avoid conflicts */
  webServer: [
    {
      command: 'dotnet run --urls http://localhost:5101',
      url: 'http://localhost:5101/swagger',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      cwd: '../UrbanAI.API',
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev -- --port 3100 --host',
      url: 'http://localhost:3100',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      stdout: 'pipe',
      stderr: 'pipe',
    }
  ],
});
