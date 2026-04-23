/**
 * ============================================================
 * PLAYWRIGHT CONFIGURATION: playwright.config.ts
 * ============================================================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This is the master configuration file for your entire
 * Playwright test suite. It controls:
 *
 *   - The base URL of the app being tested
 *   - Which browsers to run tests in
 *   - How long to wait before timing out
 *   - What to do when a test fails (screenshots, videos)
 *   - The order in which projects run (auth first, then tests)
 *   - Where test reports are saved
 *
 * HOW PLAYWRIGHT READS THIS FILE:
 * ------------------
 * When you run `npx playwright test`, Playwright automatically
 * looks for this file in the root of your project.
 * Everything flows from here.
 *
 * FILE LOCATION: playwright.config.ts  (root of e2e repo)
 * ============================================================
 */

import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Load environment variables from .env file.
 *
 * dotenv reads your local .env file and injects the values
 * into process.env so all config and test files can access them.
 *
 * In GitHub Actions, secrets are injected directly into
 * process.env — dotenv is harmless in that case (no .env file
 * exists in CI, dotenv just does nothing).
 *
 * INSTALL: npm install dotenv --save-dev
 */
import 'dotenv/config';

/**
 * The path to the saved session file.
 * Must match the SESSION_FILE constant in auth.setup.ts.
 * All test projects reference this path to load the session.
 */
const SESSION_FILE = path.join(__dirname, 'e2e/.auth/session.json');

export default defineConfig({

  // ----------------------------------------------------------
  // TEST DIRECTORY
  // ----------------------------------------------------------
  // Where Playwright looks for test files.
  // Files matching the testMatch pattern inside this directory
  // will be picked up and executed.
  // ----------------------------------------------------------
  testDir: './e2e',

  // ----------------------------------------------------------
  // TEST FILE PATTERN
  // ----------------------------------------------------------
  // Only files ending in .spec.ts are treated as test files.
  // Setup files (auth.setup.ts) do NOT match this pattern —
  // they are included via the projects config below instead.
  // ----------------------------------------------------------
  testMatch: '**/*.spec.ts',

  // ----------------------------------------------------------
  // GLOBAL TIMEOUT
  // ----------------------------------------------------------
  // Maximum time ONE test can take before it is marked as failed.
  // 30 seconds is generous for a wizard flow with file upload.
  // Increase to 60_000 if your staging environment is slow.
  // ----------------------------------------------------------
  timeout: 30_000,

  // ----------------------------------------------------------
  // EXPECT TIMEOUT
  // ----------------------------------------------------------
  // Maximum time for a single assertion (expect(...).toBe...)
  // to keep retrying before failing.
  // Default is 5 seconds — good for most UI assertions.
  // ----------------------------------------------------------
  expect: {
    timeout: 5_000,
  },

  // ----------------------------------------------------------
  // PARALLEL EXECUTION
  // ----------------------------------------------------------
  // fullyParallel: true means tests within a file can run
  // in parallel across workers. Safe here because each test
  // uses its own browser context loaded from session.json.
  //
  // workers: controls how many parallel workers run at once.
  // In CI we limit to 1 to avoid race conditions on shared
  // staging data (e.g. two tests creating campaigns at once).
  // Locally you can increase this for speed.
  // ----------------------------------------------------------
  fullyParallel: false, // keep false for wizard flows — steps are sequential
  workers: process.env.CI ? 1 : 2,

  // ----------------------------------------------------------
  // RETRY ON FAILURE
  // ----------------------------------------------------------
  // In CI, failed tests are retried once automatically.
  // This handles flakiness caused by slow network or
  // slow staging environment responses.
  // Locally we don't retry so failures are obvious immediately.
  // ----------------------------------------------------------
  retries: process.env.CI ? 1 : 0,

  // ----------------------------------------------------------
  // REPORTER
  // ----------------------------------------------------------
  // How Playwright reports test results.
  //
  // 'html'  → generates a visual HTML report in playwright-report/
  //           open it with: npx playwright show-report
  //           In CI, this is uploaded as an artifact so you can
  //           download and view it after a run.
  //
  // 'list'  → prints results line by line in the terminal.
  //           Good for local development.
  //
  // Both run together — list for immediate terminal feedback,
  // html for detailed post-run analysis.
  // ----------------------------------------------------------
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  // ----------------------------------------------------------
  // GLOBAL TEST SETTINGS (shared by all projects)
  // ----------------------------------------------------------
  use: {

    // --------------------------------------------------------
    // BASE URL
    // --------------------------------------------------------
    // All page.goto('/some/path') calls are relative to this.
    // So page.goto('/en-us/dashboard/campaign-manager') becomes:
    // https://app-testing.trypair.ai/en-us/dashboard/campaign-manager
    // --------------------------------------------------------
    baseURL: 'https://app-testing.trypair.ai',

    // --------------------------------------------------------
    // SCREENSHOTS ON FAILURE
    // --------------------------------------------------------
    // When a test fails, Playwright automatically takes a
    // screenshot of the browser at the moment of failure.
    // Saved to: test-results/<test-name>/screenshot.png
    // Invaluable for debugging CI failures without re-running.
    // --------------------------------------------------------
    screenshot: 'only-on-failure',

    // --------------------------------------------------------
    // VIDEO ON FAILURE
    // --------------------------------------------------------
    // Records a video of the test run, but only keeps it
    // if the test fails. Videos are larger files — keeping
    // them only on failure saves disk space and CI artifact size.
    // --------------------------------------------------------
    video: 'retain-on-failure',

    // --------------------------------------------------------
    // TRACE ON FAILURE
    // --------------------------------------------------------
    // Playwright traces are detailed recordings of every
    // action, network request, and DOM snapshot during a test.
    // 'on-first-retry' means: record a trace the first time
    // a test is retried (i.e. after it failed once in CI).
    // View traces with: npx playwright show-trace trace.zip
    // --------------------------------------------------------
    trace: 'on-first-retry',

    // --------------------------------------------------------
    // ACTION TIMEOUT
    // --------------------------------------------------------
    // Maximum time for a single action (click, fill, etc.)
    // to complete before it times out.
    // 10 seconds handles slow staging API responses.
    // --------------------------------------------------------
    actionTimeout: 10_000,

    // --------------------------------------------------------
    // NAVIGATION TIMEOUT
    // --------------------------------------------------------
    // Maximum time for page.goto() or page.waitForURL()
    // to complete. 15 seconds for staging environments.
    // --------------------------------------------------------
    navigationTimeout: 15_000,

    // --------------------------------------------------------
    // LOCALE
    // --------------------------------------------------------
    // Your app uses /en-us/ in its URL structure, so we set
    // the browser locale to en-US to match. This also ensures
    // date pickers and other locale-sensitive fields behave
    // consistently across different machines.
    // --------------------------------------------------------
    locale: 'en-US',

    // --------------------------------------------------------
    // VIEWPORT
    // --------------------------------------------------------
    // Standard desktop resolution. The campaign wizard is a
    // desktop-first UI so we use a full desktop viewport.
    // --------------------------------------------------------
    viewport: { width: 1280, height: 720 },

  },

  // ----------------------------------------------------------
  // PROJECTS
  // ----------------------------------------------------------
  // Projects define what runs and in what order.
  //
  // PROJECT 1: 'authenticate'
  //   - Runs auth.setup.ts FIRST before any test
  //   - Uses NO storageState (it creates it)
  //   - Does NOT match *.spec.ts files
  //
  // PROJECT 2: 'chromium'
  //   - Runs all *.spec.ts test files
  //   - Depends on 'authenticate' completing first
  //   - Loads the saved session from SESSION_FILE
  //   - Every test starts already logged in
  //
  // WHY ONLY CHROMIUM FOR NOW?
  //   Your app is tested on staging — running on multiple
  //   browsers multiplies test time and API load. Start with
  //   Chromium (most common browser for business apps) and
  //   add Firefox/Safari later once the suite is stable.
  // ----------------------------------------------------------
  projects: [

    // PROJECT 1 — Auth setup (runs first, no browser session needed)
    {
      name: 'authenticate',
      testMatch: '**/auth/auth.setup.ts', // only runs this specific file
      use: {
        ...devices['Desktop Chrome'],
        // No storageState here — this project CREATES the session file
      },
    },

    // PROJECT 2 — Main test suite (runs after auth, loads saved session)
    {
      name: 'chromium',
      testMatch: '**/*.spec.ts', // picks up all test files
      dependencies: ['authenticate'], // wait for auth to finish first
      use: {
        ...devices['Desktop Chrome'],

        // -------------------------------------------------------
        // LOAD THE SAVED SESSION
        // -------------------------------------------------------
        // This is the key line that makes the whole auth strategy work.
        // Before each test, Playwright restores the browser state
        // from session.json — cookies, localStorage, everything.
        // The test starts as if the user just logged in.
        // -------------------------------------------------------
        storageState: SESSION_FILE,
      },
    },

  ],

  // ----------------------------------------------------------
  // OUTPUT FOLDER
  // ----------------------------------------------------------
  // Where Playwright saves screenshots, videos, and traces
  // for failed tests. Each test gets its own subfolder.
  // This folder should be in .gitignore.
  // ----------------------------------------------------------
  outputDir: 'test-results',

});
