/**
 * ============================================================
 * PAGE OBJECT: CampaignManagerPage
 * ============================================================
 *
 * WHAT THIS PAGE REPRESENTS:
 * --------------------------
 * The Campaign Manager listing page — the table/list view
 * that shows all existing campaigns. This is the page the
 * user lands on after clicking "Campaign Manager" in the
 * sidebar.
 *
 * URL: https://app-testing.trypair.ai/en-us/dashboard/campaign-manager
 *
 * THIS PAGE HAS TWO RESPONSIBILITIES IN THE TEST:
 * --------------------------
 *   1. ENTRY POINT — navigate to the campaign manager and
 *      confirm it loaded correctly (the test starts here)
 *
 *   2. EXIT ASSERTION — after the full wizard is completed,
 *      we return here to assert the newly created campaign
 *      appears in the table (the test ends here)
 *
 * WHAT THIS PAGE IS NOT:
 * --------------------------
 * This page does NOT represent the wizard steps — those are
 * handled by Step1, Step2, Step3, Step4 page objects.
 * This page only covers what happens BEFORE the wizard opens
 * and AFTER it closes.
 *
 * FILE LOCATION: e2e/pages/CampaignManagerPage.ts
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';

export class CampaignManagerPage {

  // ----------------------------------------------------------
  // SECTION 1: Page instance
  // ----------------------------------------------------------
  readonly page: Page;

  // ----------------------------------------------------------
  // SECTION 2: CONSTANTS
  // ----------------------------------------------------------
  // The path to this page relative to the baseURL.
  // Using a constant means if the URL ever changes, you
  // update it in one place only.
  //
  // NOTE: The /en-us/ locale prefix is required — without it
  // the app may redirect or show unexpected behavior.
  // ----------------------------------------------------------
  readonly PATH = '/en-us/dashboard/campaign-manager';
  // https://app-testing.trypair.ai/en-us/dashboard/campaign-manager


  // ----------------------------------------------------------
  // SECTION 3: LOCATORS
  // ----------------------------------------------------------
  // Grouped into two logical sections:
  //   A. Page load confirmation elements
  //   B. Actions available on this page
  //   C. Campaign table (for post-creation assertion)
  // ----------------------------------------------------------


  // --- A. PAGE LOAD CONFIRMATION ---

  // A unique heading or element that confirms the campaign
  // manager page has fully loaded.
  // From the sidebar HTML we saw: the sidebar link text is
  // "Campaign Manager" — the page itself likely has a matching
  // heading or title element.
  // TODO: Navigate to the campaign manager page, inspect the
  //       main content area and find a heading or unique element.
  //       Look for an <h1>, <h2>, or a element with a unique id.
  // TODO: Replace selector below with the real one.
  readonly pageHeading: Locator;


  // --- B. PAGE ACTIONS ---

  // The "Create Campaign" button that opens the wizard.
  // This is the primary action on this page.
  // Using getByRole + name for stability.
  // TODO: Confirm the exact visible text on this button.
  // Common variations: 'Create Campaign', 'New Campaign', '+ Create Campaign'
  readonly createCampaignButton: Locator;


  // --- C. CAMPAIGN TABLE (for post-creation assertions) ---

  // The table or list container that holds all campaigns.
  // We use this as a parent to scope searches within it.
  // TODO: Inspect the table wrapper element.
  // Look for a <table>, role="grid", or a unique container id/class.
  readonly campaignTable: Locator;

  // A row inside the campaign table.
  // We use this to count rows or find a specific campaign.
  // TODO: Inspect what each campaign row looks like in the DOM.
  // Likely a <tr> inside a <table>, or a <div> with role="row".
  readonly campaignTableRow: Locator;

  // The search input on the campaign table (if one exists).
  // Used in the post-creation assertion to search for the
  // newly created campaign by name instead of scanning all rows.
  // NOT used during navigation — only during final assertion.
  // TODO: Confirm if a search input exists on this page.
  //       If not, remove this locator and use getByText instead.
  readonly campaignSearchInput: Locator;

  // The "success" toast or notification that appears after
  // a campaign is created. This is the FIRST thing we assert
  // after the wizard completes — before checking the table.
  // TODO: Inspect what element appears after campaign creation.
  // It may be a toast with role="alert" or a specific class.
  readonly successToast: Locator;


  // ----------------------------------------------------------
  // SECTION 4: CONSTRUCTOR
  // ----------------------------------------------------------
  constructor(page: Page) {
    this.page = page;

    // --- A. Page load confirmation ---
    // TODO: Replace with real heading selector after inspecting the page
    this.pageHeading           = page.getByRole('heading', { name: 'Campaign Manager' }); // TODO: confirm exact heading text

    // --- B. Page actions ---
    // TODO: Confirm exact button text
    this.createCampaignButton  = page.getByRole('button', { name: 'Create Campaign' }); // TODO: confirm exact text
    

    // --- C. Campaign table ---
    // TODO: Replace all three selectors after inspecting the table
    this.campaignTable         = page.locator('TODO: campaign table container selector');
    this.campaignTableRow      = page.locator('TODO: campaign table row selector');
    this.campaignSearchInput   = page.locator('TODO: campaign search input selector');

    // Success toast — role="alert" is the most common pattern
    // for toast notifications in accessible Vue/Nuxt apps.
    // TODO: Confirm by inspecting the DOM after a test campaign creation.
    this.successToast          = page.locator('[role="alert"]'); // TODO: may need to be more specific
  }


  // ----------------------------------------------------------
  // SECTION 5: ACTIONS
  // ----------------------------------------------------------


  // ----------------------------------------------------------
  // GROUP A — NAVIGATION (used at the START of the test)
  // ----------------------------------------------------------

  /**
   * Navigate directly to the Campaign Manager page.
   *
   * WHY NAVIGATE DIRECTLY INSTEAD OF CLICKING THE SIDEBAR?
   * -------------------------------------------------------
   * Clicking the sidebar link is more "realistic" but also
   * more fragile — if the sidebar changes, navigation breaks.
   * Going directly to the URL is faster and more reliable.
   * We already tested sidebar navigation implicitly via the
   * HTML you shared (the link href="/dashboard/campaign-manager"
   * is confirmed to exist).
   *
   * The test still validates the page loaded correctly via
   * waitForPageToLoad() called right after this.
   */
  async goto(): Promise<void> {
    await this.page.goto(this.PATH);
  }

  /**
   * Wait for the Campaign Manager page to fully load.
   *
   * Waits for TWO signals:
   *   1. URL contains 'campaign-manager' — confirms navigation succeeded
   *   2. The page heading is visible — confirms content rendered
   *
   * Always call this immediately after goto() to ensure
   * the page is ready before interacting with it.
   *
   * USAGE IN TEST FILE:
   *   await campaignManagerPage.goto();
   *   await campaignManagerPage.waitForPageToLoad();
   */
  async waitForPageToLoad(): Promise<void> {
    // Confirm URL
    await this.page.waitForURL(`**${this.PATH}**`, { timeout: 15_000 });

    // Confirm page heading is visible
    // TODO: update once pageHeading selector is confirmed
    await expect(this.pageHeading).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Click the "Create Campaign" button to open the wizard.
   *
   * POST-CONDITION:
   * The wizard opens and Step 1 content becomes visible.
   * The URL may or may not change (based on your earlier
   * answer, the URL stays the same across wizard steps).
   *
   * After calling this, hand control to Step1CampaignSetupPage.
   *
   * USAGE IN TEST FILE:
   *   await campaignManagerPage.clickCreateCampaign();
   *   // now interact with Step1CampaignSetupPage
   */
  // async clickCreateCampaign(): Promise<void> {
  //   await this.createCampaignButton.click();
  // }

  // Instead of a simple .click(), try this in your Page Object:
async clickCreateCampaign() {
  // Force Playwright to wait until the button is fully ready
  await this.createCampaignButton.waitFor({ state: 'visible' });
  await this.createCampaignButton.click();
}

  // ----------------------------------------------------------
  // GROUP B — ASSERTIONS (used at the END of the test)
  // ----------------------------------------------------------

  /**
   * Assert that the success toast/notification is visible
   * after campaign creation completes.
   *
   * This is the FIRST assertion after the wizard finishes.
   * The toast appears immediately when the backend confirms
   * the campaign was created successfully.
   *
   * WHY CHECK THE TOAST FIRST?
   * The toast is immediate feedback from the backend.
   * If it doesn't appear, the campaign wasn't created —
   * no point checking the table.
   *
   * USAGE IN TEST FILE:
   *   await campaignManagerPage.assertSuccessToastVisible();
   */
  async assertSuccessToastVisible(): Promise<void> {
    // TODO: implement once successToast selector is confirmed
    // The toast may disappear quickly — we use a short timeout
    // and check immediately after the wizard completes.
    await expect(this.successToast).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Assert that a campaign with the given name appears
   * in the campaign table.
   *
   * This is the SECOND and final assertion of the test.
   * It confirms the campaign was not just created on the backend
   * but is also correctly displayed in the UI.
   *
   * @param campaignName - The exact name of the campaign to look for
   *                       Must match what was entered in Step 1.
   *
   * HOW IT WORKS:
   * We look for the campaign name as text within the table.
   * We scope the search to the campaignTable container so we
   * don't accidentally match campaign names in other parts of the UI.
   *
   * USAGE IN TEST FILE:
   *   await campaignManagerPage.assertCampaignExists('QA Test Campaign');
   */
  async assertCampaignExists(campaignName: string): Promise<void> {
    // TODO: update once campaignTable selector is confirmed.
    // If a search input exists, use it to filter first:
    //   await this.campaignSearchInput.fill(campaignName);
    //   await this.page.keyboard.press('Enter');
    // Then assert the name appears in the filtered results.

    // For now — look for the campaign name text anywhere in the table.
    await expect(
      this.campaignTable.getByText(campaignName, { exact: false })
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Get the total number of campaign rows currently in the table.
   *
   * @returns The number of campaign rows visible in the table
   *
   * Useful for "before and after" assertions:
   *   const countBefore = await campaignManagerPage.getCampaignCount();
   *   // ... create a campaign ...
   *   const countAfter = await campaignManagerPage.getCampaignCount();
   *   expect(countAfter).toBe(countBefore + 1);
   *
   * NOT used in test #1 directly but defined for future tests.
   */
  async getCampaignCount(): Promise<number> {
    // TODO: implement once campaignTableRow selector is confirmed
    return await this.campaignTableRow.count();
  }

}
