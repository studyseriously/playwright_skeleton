/**
 * ============================================================
 * PAGE OBJECT: Step2ContactSelectionPage
 * ============================================================
 *
 * WHAT THIS PAGE REPRESENTS:
 * --------------------------
 * Step 2 of the campaign creation wizard — Contact Selection.
 * The user picks which contacts will receive the campaign.
 * They can either:
 *   (A) Upload a CSV file containing contacts, OR
 *   (B) Use a custom filter to select contacts from the system
 *
 * IMPORTANT — URL BEHAVIOR:
 * --------------------------
 * This step does NOT change the URL. The same URL renders
 * different content depending on which wizard step is active.
 * This means we CANNOT use page.waitForURL() to confirm we
 * arrived at Step 2. Instead, we wait for a unique element
 * that only exists on Step 2 to become visible.
 * (See: waitForStep2ToLoad())
 *
 * WHICH PATH DOES TEST #1 USE?
 * --------------------------
 * Test #1 uses Path A: CSV Upload.
 * Path B (custom filter) is defined here as skeleton methods
 * for future test cases but will NOT be called in test #1.
 *
 * FILE LOCATION: e2e/pages/Step2ContactSelectionPage.ts
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';

export class Step2ContactSelectionPage {

  // ----------------------------------------------------------
  // SECTION 1: The Playwright Page instance
  // ----------------------------------------------------------
  readonly page: Page;


  // ----------------------------------------------------------
  // SECTION 2: LOCATORS
  // ----------------------------------------------------------
  // Organized into logical groups matching the page layout:
  //   A. Step arrival confirmation
  //   B. CSV upload container & modal
  //   C. Custom filter section (skipped in test #1)
  //   D. Preview button
  //   E. Bottom navigation buttons
  // ----------------------------------------------------------


  // --- A. STEP ARRIVAL CONFIRMATION ---
  // Since the URL doesn't change between steps, we need a
  // unique element that ONLY appears on Step 2 to confirm
  // we have successfully moved from Step 1.
  // TODO: Inspect Step 2 and find a heading, label, or container
  //       that is unique to this step (e.g. "Contact Selection" heading)
  //       Replace the selector below.
  readonly step2Heading: Locator;


  // --- B. CSV UPLOAD SECTION ---

  // The entire upload container that acts as a clickable button.
  // Clicking it opens the OS file picker dialog.
  // NOTE: In Playwright, we don't actually click this to upload —
  // we use page.setInputFiles() on the hidden <input type="file"> instead.
  // This is more reliable than triggering the OS file picker.
  // TODO: Inspect and find the hidden <input type="file"> element.
  //       It may have accept=".csv" attribute — use that to find it.
  readonly csvFileInput: Locator;

  // The visible upload container (the "button-like" area).
  // We keep this locator for assertions — e.g. confirming it's visible.
  // TODO: Inspect and replace with real selector.
  readonly csvUploadContainer: Locator;

  // The "Press here to download a sample file" link.
  // We define this here but will NOT click it in test #1
  // (it's only needed if you want to test the download flow).
  // Using getByText since the link text is stable and unique.
  readonly downloadSampleFileLink: Locator;

  // --- B2. POST-UPLOAD MODAL ---
  // After a CSV is uploaded, a modal appears with two buttons.
  // We wait for this modal before interacting with its buttons.

  // The modal container itself.
  // We wait for this to be visible after uploading the CSV.
  // TODO: Inspect the modal and find its wrapper element.
  //       Look for role="dialog" or a unique id/class on the modal.
  readonly uploadSuccessModal: Locator;

  // "Next" button inside the modal (left side).
  // Clicking this advances to Step 3 (template selection).
  // TODO: Confirm exact button text — "Next"? "Continue"?
  readonly modalNextButton: Locator;

  // "Preview" button inside the modal (right side).
  // Shows valid contacts from the uploaded file.
  // NOT used in test #1 but defined for future tests.
  // TODO: Confirm exact button text — "Preview"?
  readonly modalPreviewButton: Locator;

  // The (x) close icon on the modal.
  // Clicking it closes the modal and returns to Step 2.
  // NOT used in test #1.
  // TODO: Inspect and replace with real selector.
  readonly modalCloseButton: Locator;


  // --- C. CUSTOM FILTER SECTION (skipped in test #1) ---
  // These locators are defined here for future test cases
  // that test the filter-based contact selection path.
  // None of these will be called in test #1.

  // The "Select List" button that opens the filter dropdown menu.
  // TODO: Inspect and replace with real selector.
  readonly filterSelectListButton: Locator;

  // The two filter options inside the dropdown:
  //   - "contacts" filter (with labels / no labels)
  //   - "creation date" filter (last 7 days, 14 days, last month)
  // TODO: Inspect and replace with real selectors.
  readonly filterContactsOption: Locator;
  readonly filterCreationDateOption: Locator;

  // The "Apply Filter" button — disabled until at least one filter is selected.
  // TODO: Inspect and replace with real selector.
  readonly applyFilterButton: Locator;

  // The "Reset Filter" button — collapses dropdown and resets to defaults.
  // TODO: Inspect and replace with real selector.
  readonly resetFilterButton: Locator;

  // The labels multiselect list that appears after applying "contacts with labels" filter.
  // TODO: Inspect and replace with real selector.
  readonly labelsMultiSelectList: Locator;


  // --- D. PREVIEW BUTTON (bottom of page) ---
  // Disabled by default until contacts are uploaded or filtered.
  // Becomes enabled once contacts are selected.
  // NOT used in test #1 (we skip preview and go directly via modal Next button).
  // TODO: Inspect and replace with real selector.
  readonly previewButton: Locator;


  // --- E. BOTTOM NAVIGATION BUTTONS ---

  // "Back" button — bottom left. Returns to Step 1.
  // NOT used in test #1 (happy path doesn't go back).
  // Using getByRole + name for stability.
  // TODO: Confirm exact button text.
  readonly backButton: Locator;

  // "Continue" button — bottom right. Advances to Step 3.
  // Disabled until contacts are uploaded or filtered.
  // NOTE: In test #1, we advance via the MODAL's Next button, not this one.
  //       After clicking modal Next, this page transitions to Step 3.
  //       We keep this locator for future tests that may need it.
  // TODO: Confirm exact button text — "Continue"?
  readonly continueButton: Locator;

  // "Save as Draft" button — bottom right, next to Continue.
  // Saves current wizard progress for later.
  // NOT used in test #1.
  // TODO: Confirm exact button text.
  readonly saveAsDraftButton: Locator;


  // --- F. DISCARD MODAL ---
  // Appears when user tries to switch between upload and filter methods
  // after already making a selection. NOT used in test #1.

  // The discard confirmation modal.
  // TODO: Inspect and replace with real selector.
  readonly discardModal: Locator;

  // "Discard" button inside the modal — confirms discarding.
  // TODO: Confirm exact button text.
  readonly discardConfirmButton: Locator;

  // "Cancel" button inside the modal — keeps existing selection.
  // TODO: Confirm exact button text.
  readonly discardCancelButton: Locator;


  // ----------------------------------------------------------
  // SECTION 3: CONSTRUCTOR
  // ----------------------------------------------------------
  constructor(page: Page) {
    this.page = page;

    // --- A. Step arrival confirmation ---
    // TODO: Replace with a real unique element from Step 2
    this.step2Heading             = page.getByText('TODO: unique heading text on step 2');

    // --- B. CSV Upload ---
    // The hidden file input is the most reliable way to upload files in Playwright.
    // Look for <input type="file"> in DevTools — it may be visually hidden.
    this.csvFileInput             = page.locator('input[type="file"]');              // TODO: narrow down if multiple file inputs exist
    this.csvUploadContainer       = page.locator('TODO: upload container selector');
    this.downloadSampleFileLink   = page.getByText('Press here to download a sample file'); // TODO: confirm exact link text

    // --- B2. Post-upload modal ---
    this.uploadSuccessModal       = page.getByRole('dialog');                        // TODO: confirm — may need a more specific selector if multiple dialogs exist
    this.modalNextButton          = page.getByRole('button', { name: 'Next' });     // TODO: confirm exact text
    this.modalPreviewButton       = page.getByRole('button', { name: 'Preview' }); // TODO: confirm exact text
    this.modalCloseButton         = page.locator('TODO: modal close (x) icon selector');

    // --- C. Custom filter (future use) ---
    this.filterSelectListButton   = page.locator('TODO: select list button selector');
    this.filterContactsOption     = page.locator('TODO: contacts filter option selector');
    this.filterCreationDateOption = page.locator('TODO: creation date filter option selector');
    this.applyFilterButton        = page.getByRole('button', { name: 'Apply Filter' }); // TODO: confirm exact text
    this.resetFilterButton        = page.getByRole('button', { name: 'Reset Filter' }); // TODO: confirm exact text
    this.labelsMultiSelectList    = page.locator('TODO: labels multiselect list selector');

    // --- D. Preview button ---
    this.previewButton            = page.getByRole('button', { name: 'Preview' }); // TODO: may conflict with modal preview button — narrow down with a parent locator

    // --- E. Bottom navigation ---
    this.backButton               = page.getByRole('button', { name: 'Back' });    // TODO: confirm exact text
    this.continueButton           = page.getByRole('button', { name: 'Continue' }); // TODO: confirm exact text
    this.saveAsDraftButton        = page.getByRole('button', { name: 'Save as Draft' }); // TODO: confirm exact text

    // --- F. Discard modal ---
    this.discardModal             = page.locator('TODO: discard modal selector');
    this.discardConfirmButton     = page.getByRole('button', { name: 'Discard' }); // TODO: confirm exact text
    this.discardCancelButton      = page.getByRole('button', { name: 'Cancel' });  // TODO: confirm exact text
  }


  // ----------------------------------------------------------
  // SECTION 4: ACTIONS
  // ----------------------------------------------------------


  // ----------------------------------------------------------
  // GROUP A — STEP ARRIVAL
  // ----------------------------------------------------------

  /**
   * Wait for Step 2 to fully load before interacting with it.
   *
   * WHY THIS IS NEEDED:
   * Since the URL doesn't change between steps, Playwright has no
   * URL to wait for. We wait for a unique Step 2 element to appear
   * instead. Always call this at the START of any Step 2 interaction.
   *
   * USAGE IN TEST FILE:
   *   await step2.waitForStep2ToLoad();
   */
  async waitForStep2ToLoad(): Promise<void> {
    // TODO: implement
    // Steps:
    //   1. Wait for the step2Heading (or another unique element) to be visible
    //   2. Use a reasonable timeout (default Playwright timeout is usually fine)
    throw new Error('Not implemented yet — replace with: await this.step2Heading.waitFor({ state: "visible" })');
  }


  // ----------------------------------------------------------
  // GROUP B — CSV UPLOAD PATH (used in test #1)
  // ----------------------------------------------------------

  /**
   * Upload a CSV file by injecting it directly into the file input.
   *
   * @param filePath - Path to the CSV file relative to the project root
   *                   e.g. 'e2e/fixtures/test-data/contacts.csv'
   *
   * HOW PLAYWRIGHT FILE UPLOAD WORKS:
   * We do NOT click the upload container to open the OS file picker
   * (that would open a native dialog Playwright can't control).
   * Instead, we use page.setInputFiles() to inject the file directly
   * into the hidden <input type="file"> element. This is the
   * recommended Playwright approach for all file uploads.
   *
   * WHAT HAPPENS AFTER:
   * The upload modal appears automatically after the file is set.
   * Call waitForUploadModal() next to confirm the modal appeared.
   */
  async uploadCSV(filePath: string): Promise<void> {
    // TODO: implement
    // Steps:
    //   1. Set the file on the hidden file input element
    //   2. Wait briefly for the upload to be processed
    throw new Error('Not implemented yet — replace with: await this.csvFileInput.setInputFiles(filePath)');
  }

  /**
   * Wait for the post-upload modal to appear.
   *
   * Call this AFTER uploadCSV() to confirm the modal is visible
   * before trying to click the Next or Preview buttons inside it.
   *
   * WHY WAIT EXPLICITLY?
   * File uploads trigger async processing. The modal may take
   * a moment to appear. Waiting explicitly prevents flaky tests
   * where Playwright tries to click Next before the modal exists.
   */
  async waitForUploadModal(): Promise<void> {
    // TODO: implement
    // Steps:
    //   1. Wait for the uploadSuccessModal to be visible
    throw new Error('Not implemented yet — replace with: await this.uploadSuccessModal.waitFor({ state: "visible" })');
  }

  /**
   * Click the "Next" button inside the post-upload modal.
   *
   * This advances the wizard to Step 3 (template selection).
   * Used in test #1 — we skip Preview and go directly to Step 3.
   *
   * PRE-CONDITIONS:
   *   - uploadCSV() has been called
   *   - waitForUploadModal() has confirmed the modal is visible
   *
   * POST-CONDITION:
   *   - Step 3 content renders (same URL, different content)
   */
  async clickModalNext(): Promise<void> {
    // TODO: implement
    // Steps:
    //   1. Click the Next button inside the modal
    throw new Error('Not implemented yet — replace with: await this.modalNextButton.click()');
  }

  /**
   * Click the "Preview" button inside the post-upload modal.
   *
   * Shows the list of valid contacts from the uploaded CSV.
   * NOT used in test #1 but defined for future tests.
   */
  async clickModalPreview(): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented yet — replace with: await this.modalPreviewButton.click()');
  }

  /**
   * Close the post-upload modal by clicking the (x) icon.
   *
   * Returns the user to Step 2 without advancing.
   * NOT used in test #1.
   */
  async closeUploadModal(): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented yet — replace with: await this.modalCloseButton.click()');
  }


  // ----------------------------------------------------------
  // GROUP C — CUSTOM FILTER PATH (future tests — skipped in test #1)
  // ----------------------------------------------------------

  /**
   * Open the filter dropdown by clicking "Select List".
   *
   * NOT used in test #1.
   * Call this to begin the filter-based contact selection flow.
   */
  async openFilterDropdown(): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented yet');
  }

  /**
   * Select the "Contacts" filter option from the dropdown.
   *
   * @param labelOption - 'with labels' | 'no labels'
   *
   * NOT used in test #1.
   */
  async selectContactsFilter(labelOption: 'with labels' | 'no labels'): Promise<void> {
    // TODO: implement
    // Steps:
    //   1. Click the contacts filter option
    //   2. Select the label option from its nested list
    throw new Error('Not implemented yet');
  }

  /**
   * Select the "Creation Date" filter option from the dropdown.
   *
   * @param dateRange - 'last 7 days' | 'last 14 days' | 'last month'
   *
   * NOT used in test #1.
   */
  async selectCreationDateFilter(dateRange: 'last 7 days' | 'last 14 days' | 'last month'): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented yet');
  }

  /**
   * Click "Apply Filter" to apply the selected filters.
   *
   * PRE-CONDITION: At least one filter must be selected,
   * otherwise the Apply Filter button is disabled.
   *
   * NOT used in test #1.
   */
  async applyFilter(): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented yet — replace with: await this.applyFilterButton.click()');
  }

  /**
   * Reset all filters by clicking "Reset Filter".
   *
   * Collapses the dropdown menu and returns filters to defaults.
   * NOT used in test #1.
   */
  async resetFilter(): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented yet — replace with: await this.resetFilterButton.click()');
  }


  // ----------------------------------------------------------
  // GROUP D — BOTTOM NAVIGATION
  // ----------------------------------------------------------

  /**
   * Click the "Back" button to return to Step 1.
   *
   * NOT used in test #1 (happy path doesn't go back).
   */
  async clickBack(): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented yet — replace with: await this.backButton.click()');
  }

  /**
   * Click "Save as Draft" to save wizard progress.
   *
   * NOT used in test #1.
   */
  async saveAsDraft(): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented yet — replace with: await this.saveAsDraftButton.click()');
  }


  // ----------------------------------------------------------
  // GROUP E — STATE CHECKS (for assertions in test file)
  // ----------------------------------------------------------

  /**
   * Check whether the Continue button (bottom right) is enabled.
   *
   * @returns true if enabled, false if disabled
   *
   * The Continue button is DISABLED until contacts are uploaded or filtered.
   * Use this in assertions to verify the button state:
   *   expect(await step2.isContinueButtonEnabled()).toBe(false); // before upload
   *   expect(await step2.isContinueButtonEnabled()).toBe(true);  // after upload
   */
  async isContinueButtonEnabled(): Promise<boolean> {
    // TODO: implement
    // Steps:
    //   1. Check if the button is NOT disabled
    //   2. Return true if enabled, false if disabled
    throw new Error('Not implemented yet — replace with: return await this.continueButton.isEnabled()');
  }

  /**
   * Check whether the Apply Filter button is enabled.
   *
   * @returns true if enabled, false if disabled
   *
   * The button is DISABLED until at least one filter is selected.
   * NOT used in test #1 but useful for filter path assertions.
   */
  async isApplyFilterButtonEnabled(): Promise<boolean> {
    // TODO: implement
    throw new Error('Not implemented yet — replace with: return await this.applyFilterButton.isEnabled()');
  }


  // ----------------------------------------------------------
  // SECTION 5: COMPOUND ACTIONS
  // ----------------------------------------------------------

  /**
   * Complete Step 2 using the CSV upload path.
   *
   * This is the COMPOUND action for test #1.
   * It handles the full CSV upload flow in one call:
   *   1. Wait for Step 2 to load
   *   2. Upload the CSV file
   *   3. Wait for the upload modal to appear
   *   4. Click Next in the modal to advance to Step 3
   *
   * @param csvFilePath - Path to the CSV file to upload
   *                      e.g. 'e2e/fixtures/test-data/contacts.csv'
   *
   * USAGE IN TEST FILE:
   *   await step2.completeStepWithCSV('e2e/fixtures/test-data/contacts.csv');
   */
  async completeStepWithCSV(csvFilePath: string): Promise<void> {
    // TODO: uncomment these lines once each individual method is implemented
    // await this.waitForStep2ToLoad();
    // await this.uploadCSV(csvFilePath);
    // await this.waitForUploadModal();
    // await this.clickModalNext();
    throw new Error('Not implemented yet — uncomment the lines above once individual methods are done');
  }

}
