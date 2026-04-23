/**
 * ============================================================
 * AUTH SETUP: auth.setup.ts
 * ============================================================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This is a one-time setup script that Playwright runs BEFORE
 * any test file executes. Its only job is to:
 *
 *   1. Open the login page in a real browser
 *   2. Fill in the email and password
 *   3. Submit the login form
 *   4. Wait until we are fully inside the app (confirmed by
 *      the sidebar layout appearing)
 *   5. Save the entire browser state (cookies, localStorage,
 *      sessionStorage) to a file called session.json
 *
 * WHY DO WE DO THIS?
 * ------------------
 * Without this, every single test would have to log in first.
 * That is slow and fragile. Instead, we log in ONCE here,
 * save the browser state, and all tests load that saved state
 * so they start already authenticated — no login UI needed.
 *
 * WHERE IS THE SESSION SAVED?
 * ------------------
 * → e2e/.auth/session.json
 * This file is listed in .gitignore and must NEVER be committed
 * to the repository. It contains a live session token.
 *
 * HOW ARE CREDENTIALS PROVIDED?
 * ------------------
 * Credentials come from ENVIRONMENT VARIABLES — never hardcoded.
 * Locally:   create a .env file (also in .gitignore)
 * In CI:     stored as GitHub Actions Secrets and injected automatically
 *
 * Required environment variables:
 *   TEST_EMAIL     → the login email address
 *   TEST_PASSWORD  → the login password
 *
 * HOW DOES PLAYWRIGHT KNOW TO RUN THIS FIRST?
 * ------------------
 * In playwright.config.ts, this file is listed under `projects`
 * as a setup project with the name 'authenticate'. All other
 * test projects declare `dependencies: ['authenticate']` which
 * tells Playwright: "run auth.setup.ts before running my tests".
 *
 * FILE LOCATION: e2e/auth/auth.setup.ts
 * ============================================================
 */

import { test as setup } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';

// ----------------------------------------------------------
// SESSION FILE PATH
// ----------------------------------------------------------
// This constant defines WHERE the saved session will be stored.
// It must match the `storageState` path in playwright.config.ts.
// We use path.join to make it work on both Windows and Mac/Linux.
// __dirname here refers to the e2e/auth/ directory.
// ----------------------------------------------------------
export const SESSION_FILE = path.join(__dirname, '../.auth/session.json');

// ----------------------------------------------------------
// THE SETUP TEST
// ----------------------------------------------------------
// We use `setup()` instead of `test()` here — it's the same
// function, just renamed to make it clear this is setup code,
// not a real user-facing test.
// ----------------------------------------------------------
setup('authenticate', async ({ page }) => {

  // ----------------------------------------------------------
  // STEP 1: Read credentials from environment variables
  // ----------------------------------------------------------
  // process.env reads values from:
  //   - your local .env file (loaded by dotenv in the config)
  //   - GitHub Actions Secrets (injected automatically in CI)
  //
  // We throw a clear error if either variable is missing
  // so you get a helpful message instead of a cryptic failure.
  // ----------------------------------------------------------
  const email    = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing credentials. Please set TEST_EMAIL and TEST_PASSWORD ' +
      'in your .env file (locally) or GitHub Actions Secrets (in CI).'
    );
  }

  // ----------------------------------------------------------
  // STEP 2: Log in using the LoginPage page object
  // ----------------------------------------------------------
  // All selector logic lives in LoginPage.ts — not here.
  // This file only orchestrates the flow at a high level.
  //
  // login() does three things internally:
  //   - navigates to the login page
  //   - fills email and password
  //   - clicks the submit button
  // ----------------------------------------------------------
  const loginPage = new LoginPage(page);
  await loginPage.login(email, password);

  // ----------------------------------------------------------
  // STEP 3: Confirm login succeeded before saving session
  // ----------------------------------------------------------
  // waitForSuccessfulLogin() waits for TWO signals:
  //   A) URL contains '/dashboard' — redirect happened
  //   B) Sidebar is visible — dashboard layout fully loaded
  //
  // We use a structural selector (data-sidebar="sidebar")
  // instead of user-specific text to make the check stable
  // across different users and environments. Previously this
  // waited for the user's name (TEST_USER_NAME) in the sidebar,
  // which broke when switching accounts or running in CI with
  // different credentials.
  // ----------------------------------------------------------
  await loginPage.waitForSuccessfulLogin();

  // ----------------------------------------------------------
  // STEP 4: Save the browser session to disk
  // ----------------------------------------------------------
  // This captures EVERYTHING the browser has stored after login:
  //   - Cookies (including session cookies)
  //   - localStorage (including the encrypted session key)
  //   - sessionStorage
  //
  // All subsequent tests load this file instead of logging in.
  // The file is saved to e2e/.auth/session.json
  // ----------------------------------------------------------
  await page.context().storageState({ path: SESSION_FILE });

  console.log(`✅ Auth setup complete. Session saved to: ${SESSION_FILE}`);
});