
/**
 * ============================================================
 * SMOKE TEST: campaign-creation.spec.ts
 * ============================================================
 *
 * WHAT IS THIS?
 * ------------------
 * A minimal smoke test. It does the least amount of work
 * needed to prove that:
 *
 *   1. The saved session loads correctly (we are logged in)
 *   2. Navigation to the campaign manager works
 *   3. The "Create Campaign" button is visible and clickable
 *   4. Step 1 of the wizard opens
 *
 * Nothing is filled in. Nothing is submitted.
 * The test passes if it reaches Step 1 without errors.
 *
 * WHY START HERE?
 * ------------------
 * Before writing a full wizard test, we need to confirm
 * that auth, config, and navigation are all wired correctly.
 * If this smoke test passes, the foundation is solid and
 * we can build the real test case on top of it with confidence.
 *
 * FILE LOCATION: e2e/tests/campaign-creation.spec.ts
 * ============================================================
 */

import { test, expect } from '@playwright/test';
import { CampaignManagerPage } from '../pages/CampaignManagerPage';

test.describe('Campaign creation', () => {

  test('smoke — can reach Step 1 of the wizard', async ({ page }) => {

    // ----------------------------------------------------------
    // STEP 1: Navigate to the Campaign Manager page
    // ----------------------------------------------------------
    // The session is already loaded from session.json — we are
    // authenticated before this line runs. No login needed.
    // ----------------------------------------------------------
    const campaignManager = new CampaignManagerPage(page);
    await campaignManager.goto();

    // ----------------------------------------------------------
    // STEP 2: Confirm the page loaded
    // ----------------------------------------------------------
    // We assert the URL contains 'campaign-manager' to confirm
    // the navigation succeeded and we didn't land on a 404
    // or get redirected back to login.
    // ----------------------------------------------------------
    await expect(page).toHaveURL(/campaign-manager/);

    // ----------------------------------------------------------
    // STEP 3: Confirm the "Create Campaign" button is visible
    // ----------------------------------------------------------
    // This confirms the page rendered correctly and the user
    // has permission to create campaigns.
    // TODO: Update the button name if it differs from 'Create Campaign'
    // ----------------------------------------------------------
    await expect(campaignManager.createCampaignButton).toBeVisible();

    // ----------------------------------------------------------
    // STEP 4: Click "Create Campaign" to open the wizard
    // ----------------------------------------------------------
    await campaignManager.clickCreateCampaign();

    // ----------------------------------------------------------
    // STEP 5: Confirm Step 1 opened
    // ----------------------------------------------------------
    // We assert the campaign name input is visible — this input
    // only exists inside the wizard, so its presence confirms
    // Step 1 loaded correctly.
    //
    // We use the #name selector directly here since we haven't
    // wired up Step1CampaignSetupPage yet — keeping this smoke
    // test self-contained and simple.
    // ----------------------------------------------------------
    await expect(page.locator('#name')).toBeVisible();

  });

});