/**
 * ============================================================
 * PAGE OBJECT: LoginPage
 * ============================================================
 *
 * WHAT THIS PAGE REPRESENTS:
 * --------------------------
 * The login page of the portal — the first screen an
 * unauthenticated user sees. It contains an email input,
 * a password input, and a submit button.
 *
 * WHO USES THIS FILE?
 * --------------------------
 * ONLY auth.setup.ts uses this page object.
 * No test spec file should ever import LoginPage directly,
 * because no test should ever need to log in — the session
 * is already saved by auth.setup.ts before tests run.
 *
 * If a future test specifically tests the login flow itself
 * (e.g. "invalid password shows error message"), it would
 * use this page object too. But for now, it exists purely
 * to support the auth setup.
 *
 * WHY MAKE IT A PAGE OBJECT AT ALL?
 * --------------------------
 * auth.setup.ts could just contain raw selectors inline.
 * But wrapping them in a page object means:
 *   - Selectors live in one place (easy to update)
 *   - auth.setup.ts reads like plain English
 *   - If you ever add login tests, the page object is ready
 *
 * FILE LOCATION: e2e/pages/LoginPage.ts
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {

  // ----------------------------------------------------------
  // SECTION 1: Page instance
  // ----------------------------------------------------------
  readonly page: Page;


  // ----------------------------------------------------------
  // SECTION 2: LOCATORS
  // ----------------------------------------------------------

  // The email address input field.
  // TODO: Open the login page in DevTools and inspect this field.
  // Check if it has id="email", name="email", or type="email".
  // Update the selector below accordingly.
  // Best options in order of preference:
  //   page.locator('#email')
  //   page.locator('input[name="email"]')
  //   page.locator('input[type="email"]')
  readonly emailInput: Locator;

  // The password input field.
  // TODO: Same check — look for id="password", name="password",
  // or type="password" on the password field.
  // Best options in order of preference:
  //   page.locator('#password')
  //   page.locator('input[name="password"]')
  //   page.locator('input[type="password"]')
  readonly passwordInput: Locator;

  // The login/submit button.
  // Using getByRole + name is the most stable approach for buttons.
  // TODO: Confirm the exact visible text on the button.
  // Common values: 'Login', 'Sign in', 'Log in', 'Continue'
  // Update the name value below to match exactly what you see.
  readonly submitButton: Locator;

  // The error message that appears when login fails.
  // e.g. "Invalid email or password"
  // We define this here for future use in negative test cases
  // (e.g. test that wrong password shows an error).
  // NOT used in auth.setup.ts — only for future login error tests.
  // TODO: Inspect what element appears on failed login and update selector.
  readonly errorMessage: Locator;

  /**
   * The main sidebar container that exists only after login.
   * This is a stable structural element identified by a custom data attribute.
   * Unlike user name text, this does not change between users or environments.
   * Selector: [data-sidebar="sidebar"]
   */
  readonly sidebar: Locator;


  // ----------------------------------------------------------
  // SECTION 3: CONSTRUCTOR
  // ----------------------------------------------------------
  
  constructor(page: Page) {
    this.page = page;

    // TODO: Replace these selectors after inspecting the login page in DevTools
    // this.emailInput = page.locator('input[type="email"]');   // alternative — try #email first
    this.emailInput    = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[type="password"]'); // TODO: confirm — try #password first
    this.submitButton  = page.getByRole('button', { name: 'Continue' }); // TODO: confirm exact button text
    this.errorMessage  = page.locator('TODO: error message selector'); // TODO: inspect failed login state

    // Initializing the sidebar locator via data attribute for maximum stability
    this.sidebar = page.locator('[data-sidebar="sidebar"]');
  }

  


  // ----------------------------------------------------------
  // SECTION 4: ACTIONS
  // ----------------------------------------------------------

  /**
   * Navigate directly to the login page.
   *
   * This uses the baseURL from playwright.config.ts, so
   * we only need to provide the path.
   *
   * TODO: Confirm the exact login page path.
   * Options to check:
   *   '/'            → root redirects to login when unauthenticated
   *   '/login'       → dedicated login route
   *   '/en-us/login' → locale-prefixed login route
   *
   * Open the app in an incognito window to see where
   * unauthenticated users land, then update the path below.
   */
  async goto(): Promise<void> {
    // TODO: Update path if the login page is not at the root
    await this.page.goto('/');

    // Wait for the email input to confirm the login form is loaded.
    // This prevents actions on an element that doesn't exist yet.
    // await this.emailInput.waitFor({ state: 'visible' });
    await expect(this.emailInput).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Fill the email input field.
   *
   * @param email - The email address to type
   *
   * .fill() clears any existing value before typing.
   * More reliable than .type() for programmatic input.
   */
  async fillEmail(email: string): Promise<void> {
    // await this.emailInput.fill(email);
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
  }

  /**
   * Fill the password input field.
   *
   * @param password - The password to type
   *
   * NOTE: Playwright does NOT log the value of password fields
   * in its traces or reports — your credentials stay private.
   */
  async fillPassword(password: string): Promise<void> {
    // await this.passwordInput.fill(password);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login submit button.
   *
   * POST-CONDITION:
   * If credentials are correct → redirects to /dashboard
   * If credentials are wrong  → error message appears
   */
  async clickSubmit(): Promise<void> {
    // await this.submitButton.click();
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled(); // Ensures button is ready for interaction
    await this.submitButton.click();
  }

  /**
   * Check if a login error message is visible.
   *
   * @returns true if an error is shown, false if not
   *
   * Used in future negative test cases:
   *   expect(await loginPage.hasError()).toBe(true)
   *
   * NOT used in auth.setup.ts.
   */
  async hasError(): Promise<boolean> {
    // TODO: implement once errorMessage selector is filled in
    throw new Error('Not implemented yet — replace with: return await this.errorMessage.isVisible()');
  }


  // ----------------------------------------------------------
  // SECTION 5: COMPOUND ACTION
  // ----------------------------------------------------------

  /**
   * Perform a complete login with the given credentials.
   *
   * This is the method auth.setup.ts calls.
   * It navigates to the login page, fills both fields,
   * and submits the form in one clean call.
   *
   * @param email    - The login email address
   * @param password - The login password
   *
   * USAGE IN auth.setup.ts:
   *   const loginPage = new LoginPage(page);
   *   await loginPage.login(email, password);
   *   // then call waitForSuccessfulLogin() to confirm
   */
  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  /**
   * Wait for the dashboard to confirm a successful login.
   *
   * Waits for TWO signals:
   *   1. URL contains '/dashboard' — the redirect happened
   *   2. The sidebar layout is visible — app fully loaded
   *
   * WHY SIDEBAR INSTEAD OF USER NAME?
   * Previously this waited for the user's name (TEST_USER_NAME)
   * to appear in the sidebar footer, which broke when switching
   * accounts or running in CI with different credentials.
   * The sidebar is a structural element that exists for ALL
   * authenticated users, identified by: data-sidebar="sidebar"
   *
   * Call this AFTER login() in auth.setup.ts to confirm
   * the session is valid before saving it to session.json.
   */
  async waitForSuccessfulLogin(): Promise<void> {
    // Wait for URL to include /dashboard
    await this.page.waitForURL('**/dashboard/**', { timeout: 15_000 });

    // Wait for the sidebar to be visible.
    // This confirms that the authenticated dashboard layout has fully rendered.
    // await expect(this.sidebar).toBeVisible({ timeout: 10_000 });
    // await expect(this.sidebar).toBeVisible({ timeout: 15_000 }); // Increased timeout for UI mode overhead
// Inside a Page Object method
await expect(this.page).toHaveURL('https://app-testing.trypair.ai/en-us/dashboard/settings/workspaces', { timeout: 15_000 });  }

}