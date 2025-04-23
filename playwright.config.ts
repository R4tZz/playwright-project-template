import { defineConfig, devices } from '@playwright/test';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Read from ".env" file.
// If ".env.local" file exists, it will be used instead.
const envFile = fs.existsSync(path.resolve(__dirname, '.env.local'))
  ? path.resolve(__dirname, '.env.local')
  : path.resolve(__dirname, '.env');

dotenv.config({ path: envFile });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "tests/specs" directory, relative to this configuration file
  testDir: './tests/specs',

  // Directory for test outputs
  outputDir: './test-results',

  // Snapshot configuration
  snapshotPathTemplate: './screenshots/{testFilePath}/{arg}{ext}',

  // Assertion-specific templates
  expect: {
    // Configure timeout for assertions to minimize flakiness
    timeout: 10000,
    toHaveScreenshot: {
      pathTemplate: './screenshots/{projectName}/{testFilePath}/{arg}{ext}',
    },
    toMatchAriaSnapshot: {
      pathTemplate: 'snapshots/{testFilePath}/{arg}{ext}',
    },
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Run all tests before marking them as failed on CI */
  maxFailures: process.env.CI ? 0 : 5,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: './reports/',
        open: 'on-failure',
        attachmentsBaseURL: './',
      },
    ],
    ['json', { outputFile: './reports/test-results.json' }],
  ],

  /* Global timeout for the entire test run */
  timeout: 60000,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Configure actionability checks for more reliable interactions */
    actionTimeout: 15000,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',

    // test ID attribute
    testIdAttribute: 'data-test',

    // headless mode - set false for debugging
    headless: true,

    // viewport size - standard desktop size
    viewport: { width: 1920, height: 1080 },

    // Taking screenshots and videos on failures
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Ignore HTTPS errors during testing
    ignoreHTTPSErrors: true,

    // Set locale and timezone for consistent testing
    locale: 'en-US',
    timezoneId: 'UTC',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Optional: When running on CI, you can specify a browser channel
        // channel: process.env.CI ? 'chrome' : undefined,
      },
    },

    // Uncomment to enable other browsers when needed
    //{
    //  name: 'firefox',
    //  use: { ...devices['Desktop Firefox'] },
    //},
    //
    //{
    //  name: 'webkit',
    //  use: { ...devices['Desktop Safari'] },
    //},

    /* Example of project with mobile viewport */
    // {
    //   name: 'mobile-chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },

    /* Example of a project with specific authentication state */
    // {
    //   name: 'authenticated',
    //   testMatch: /.*\.authenticated\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: './test-data/auth.json',
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },

  /* Global setup/teardown files */
  // globalSetup: './global-setup.ts',
  // globalTeardown: './global-teardown.ts',
});
