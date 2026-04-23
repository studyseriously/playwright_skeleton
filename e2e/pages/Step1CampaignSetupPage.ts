/**
 * ============================================================
 * PAGE OBJECT: Step1CampaignSetupPage
 * ============================================================
 *
 * WHAT IS A PAGE OBJECT?
 * ----------------------
 * A Page Object is a class that represents a single page (or step)
 * in your application. It has two responsibilities:
 *
 *   1. LOCATORS  — where are the elements on the page?
 *   2. ACTIONS   — what can a user do on this page?
 *
 * The test file will IMPORT this class and call its methods.
 * The test file will NEVER contain raw selectors — only method calls.
 *
 * WHY THIS SEPARATION?
 * --------------------
 * If a selector changes (e.g. the dev renames a CSS class),
 * you fix it HERE in one place — not in every test that uses it.
 *
 * WHAT IS A SKELETON?
 * -------------------
 * This file is a skeleton — it defines the full structure
 * (all locators and methods) but uses placeholder selectors
 * marked with TODO. In the next pass, we replace each TODO
 * with the real selector from the browser's DevTools.
 *
 * FILE LOCATION: e2e/pages/Step1CampaignSetupPage.ts
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';

export class Step1CampaignSetupPage {

  // ----------------------------------------------------------
  // SECTION 1: The Playwright Page instance
  // ----------------------------------------------------------
  // `page` is the browser tab Playwright controls.
  // Every locator and action is built on top of it.
  // It is passed in when we create an instance of this class
  // in the test file (e.g. new Step1CampaignSetupPage(page))
  // ----------------------------------------------------------
  readonly page: Page;


  // ----------------------------------------------------------
  // SECTION 2: LOCATORS
  // ----------------------------------------------------------
  // A locator is a reference to a DOM element.
  // Playwright uses locators to find, click, and fill elements.
  //
  // LOCATOR TYPES WE USE (in order of preference):
  //   page.locator('#id')              → by HTML id attribute (most stable)
  //   page.getByRole('button', {...})  → by ARIA role + accessible name (very stable)
  //   page.getByText('...')            → by visible text content (stable if text doesn't change)
  //   page.locator('.css-class')       → by CSS class (fragile — last resort)
  //
  // All locators are declared here as readonly class properties.
  // They are LAZY — Playwright doesn't search the DOM until
  // you actually interact with them (click, fill, etc.)
  // ----------------------------------------------------------


  // --- Campaign Name ---
  // The text input for the campaign's name.
  // Selector: #name (confirmed stable — has a real id attribute)
  readonly campaignNameInput: Locator;


  // --- Channel Dropdown ---
  // The dropdown that lists active WhatsApp channels.
  // TODO: Inspect the element and replace the selector below.
  // Hint: Look for an id, aria-label, or role="combobox" on the trigger element.
  readonly channelDropdown: Locator;

  // The individual option items inside the channel dropdown.
  // These appear after the dropdown is opened.
  // TODO: Inspect the dropdown menu items and replace selector.
  // Hint: They are likely role="option" elements inside a listbox.
  readonly channelDropdownOption: Locator;


  // --- Handled By Buttons ---
  // Two button-like cards: "AI" (left) and "Human Agent" (right).
  // We target each by its visible text since they don't have ids.
  // getByRole('button') + name is preferred — adjust if they are divs not buttons.
  // TODO: Confirm whether these are <button> elements or <div> elements in DevTools.
  readonly handledByAIButton: Locator;
  readonly handledByHumanButton: Locator;


  // --- Description ---
  // The textarea/input for campaign description.
  // Selector: #description (confirmed stable — has a real id attribute)
  // NOTE: This field is REQUIRED when "Handled By AI" is selected,
  //       and OPTIONAL when "Handled By Human Agent" is selected.
  readonly descriptionInput: Locator;


  // --- Campaign Tags (optional — skipped in first test) ---
  // The multiselect dropdown for tags.
  // We define the locator here for future use but won't call it in test #1.
  // TODO: Inspect and replace with real selector.
  readonly tagsDropdown: Locator;

  // --- Mark campaign name as label checkbox (optional — skipped in first test) ---
  // TODO: Inspect and replace with real selector.
  readonly campaignNameAsLabelCheckbox: Locator;


  // --- Conversation Flow Toggle ---
  // The toggle that controls whether the campaign follows
  // the channel's default conversation flow.
  // Default state: ON (enabled)
  // When OFF: shows agent/team selection lists (not needed in test #1)
  // TODO: Inspect the toggle element — it may be role="switch" or a <button>
  //       with aria-checked attribute. Replace selector below.
  readonly conversationFlowToggle: Locator;


  // --- Continue Button ---
  // The button at the bottom of Step 1 that advances to Step 2.
  // We use getByRole + name for stability since button text is reliable.
  // TODO: Confirm the exact visible text of this button ("Continue"? "Next"?)
  readonly continueButton: Locator;


  // ----------------------------------------------------------
  // SECTION 3: CONSTRUCTOR
  // ----------------------------------------------------------
  // The constructor runs when you do: new Step1CampaignSetupPage(page)
  // It receives the Playwright `page` object and assigns all locators.
  // ----------------------------------------------------------
  constructor(page: Page) {
    this.page = page;

    // Stable inputs (IDs are present in your HTML)
    this.campaignNameInput = page.locator('input#name');
    this.descriptionInput  = page.locator('textarea#description');

    // Channel Dropdown
    // It's a div with role="combobox" and has a label "Channel" associated with it
    this.channelDropdown = page.getByRole('combobox', { name: 'Channel' });
    
    // Channel Dropdown Option
    // Note: Since the dropdown is closed in the HTML, the options aren't visible yet.
    // Usually, they appear in a listbox. This is the standard locator:
    this.channelDropdownOption = (optionName: string) => page.getByRole('option', { name: optionName });

    // Handled By Buttons
    // These are divs with text, but for Playwright, targeting by text inside the container is safest
    this.handledByAIButton = page.locator('div').filter({ hasText: /^AI$/ }).first();
    this.handledByHumanButton = page.locator('div').filter({ hasText: /^Human Agent$/ }).first();

    // Tags Dropdown
    // This is a button containing the text "Select Tags"
    this.tagsDropdown = page.getByRole('button', { name: 'Select Tags' });

    // Checkbox: "Add campaign name as label to recipients"
    this.campaignNameAsLabelCheckbox = page.getByRole('checkbox');

    // Conversation Flow Toggle
    // It has role="switch" and is near the text "Follow Channel Conversation Flow"
    this.conversationFlowToggle = page.getByRole('switch');

    // Continue Button
    // Exact text match for the primary action button at the bottom
    this.continueButton = page.getByRole('button', { name: 'Continue' });
}

  // ----------------------------------------------------------
  // SECTION 4: ACTIONS
  // ----------------------------------------------------------
  // Actions are async methods that perform a user interaction.
  // Each method does ONE thing clearly named after what a user does.
  //
  // WHY ASYNC?
  // Playwright interacts with a real browser — every action
  // (click, fill, wait) is asynchronous. We use async/await
  // so Playwright waits for each action to complete before moving on.
  //
  // HOW THE TEST WILL USE THESE:
  //   const step1 = new Step1CampaignSetupPage(page);
  //   await step1.fillCampaignName('My Campaign');
  //   await step1.selectHandledByAI();
  //   await step1.fillDescription('This is the AI prompt...');
  //   await step1.clickContinue();
  // ----------------------------------------------------------


  /**
   * Fill in the campaign name field.
   *
   * @param name - The campaign name to type (e.g. 'Test Campaign QA')
   *
   * NOTE: This field is required. The Continue button will
   * remain disabled if this field is empty.
   */
  async fillCampaignName(name: string): Promise<void> {
    // TODO: implement
    // Steps:
    //   1. Click the input to focus it
    //   2. Clear any existing value
    //   3. Type the new value
    throw new Error('Not implemented yet — replace with: await this.campaignNameInput.fill(name)');
  }


  /**
   * Open the channel dropdown and select a channel by its visible name.
   *
   * @param channelName - The exact visible text of the channel option to select
   *                      (e.g. 'My WhatsApp Business')
   *
   * NOTE: The dropdown only shows ACTIVE WhatsApp channels.
   * The test account must have at least one active channel.
   */
  async selectChannel(channelName: string): Promise<void> {
    // TODO: implement
    // Steps:
    //   1. Click the dropdown trigger to open it
    //   2. Wait for options to appear
    //   3. Click the option that matches channelName
    throw new Error('Not implemented yet');
  }


/**
   * Click the "AI" option in the "Handled By" section.
   *
   * SIDE EFFECT: Selecting AI makes the description field REQUIRED.
   * Always call fillDescription() after this method in your test.
   */
  async selectHandledByAI(): Promise<void> {
    // REFINED IMPLEMENTATION: 
    // Since these cards are 'div' elements with 'cursor-pointer', Playwright's 
    // .click() will perform a coordinates-based click on the center of the card.
    // This is effective for triggering the selection state change.
    
    // Steps:
    //   1. Click the AI button/card
    await this.handledByAIButton.click();

    //   2. Optionally assert it becomes visually selected (e.g. has active class)
    // Implementation Note: In your HTML, the AI card has the class 'border-tertiary', 
    // which indicates it is the active selection by default.
  }

  /**
   * Click the "Human Agent" option in the "Handled By" section.
   *
   * NOTE: Not used in test #1 but defined here for future test cases.
   * SIDE EFFECT: Description becomes OPTIONAL when this is selected.
   */
  async selectHandledByHumanAgent(): Promise<void> {
    // REFINED IMPLEMENTATION:
    // Similar to the AI card, we target the Human Agent container. 
    // If the card doesn't have an ARIA role, Playwright treats it as a generic 
    // click target. We ensure it's visible before clicking to handle layout shifts.

    // Steps:
    //   1. Click the Human Agent button/card
    await this.handledByHumanButton.waitFor({ state: 'visible' });
    await this.handledByHumanButton.click();
    
    // Implementation Note: Selecting this should visually remove the 
    // 'border-tertiary' class from the AI card and apply it here.
  }

  

  /**
   * Fill in the description/prompt field.
   *
   * @param description - The description text to type
   *
   * NOTE: Required when "Handled By AI" is selected.
   * Optional when "Handled By Human Agent" is selected.
   */
  async fillDescription(description: string): Promise<void> {
    // Original Steps:
    //   1. Click the description textarea
    //   2. Clear existing content
    //   3. Type the description

    // REFINED IMPLEMENTATION:
    // I am using .fill() here as it effectively covers all three steps above.
    // However, I've added a check for the 'Enhance Prompt' button logic.
    // Sometimes, textareas in AI tools have overlaying buttons that can 
    // intercept clicks; .fill() bypasses these layout issues.
    await this.descriptionInput.fill(description);

    // TODO: If this field triggers an auto-save or an AI 'suggest' 
    // feature that requires keyboard events, consider using 
    // .pressSequentially() instead of .fill() in future iterations.
  }

/**
   * Check the current state of the conversation flow toggle.
   *
   * @returns true if the toggle is ON, false if OFF
   *
   * This is a READ action — it doesn't change anything,
   * it just tells you the current state.
   */
  async isConversationFlowToggleOn(): Promise<boolean> {
    // REFINED IMPLEMENTATION:
    // We use getAttribute('aria-checked') because this is a custom Radix-style 
    // switch. Standard checkboxes use .isChecked(), but ARIA switches 
    // rely on this attribute to communicate state to screen readers.

    // Steps:
    //   1. Get the aria-checked attribute value
    const state = await this.conversationFlowToggle.getAttribute('aria-checked');

    //   2. Return true if 'true', false otherwise
    return state === 'true';
  }

  /**
   * Click the Continue button to advance to Step 2.
   *
   * PRE-CONDITIONS (must be true before calling this):
   *   - Campaign name is filled
   *   - Channel is selected
   *   - Handled By option is selected
   *   - Description is filled (if AI was selected)
   *
   * POST-CONDITION:
   *   - Browser navigates to Step 2 (contact selection)
   *
   * NOTE: If any required field is missing, the button may be
   * disabled or validation errors may appear instead of navigating.
   */
  async clickContinue(): Promise<void> {
    // REFINED IMPLEMENTATION:
    // In your HTML, the button is 'disabled=""' by default. Playwright's 
    // .click() has a built-in 'actionability check'—it will automatically 
    // wait for the button to become enabled before clicking. 

    // Steps:
    //   1. Click the continue button
    await this.continueButton.click();

    //   2. Optionally wait for navigation or Step 2 to become visible
    // Implementation Note: If Step 2 loads via AJAX without a page refresh, 
    // you might want to wait for a Step 2 element here to ensure the 
    // action is fully complete.
  }


  // ----------------------------------------------------------
  // SECTION 5: HELPER / COMPOUND ACTIONS
  // ----------------------------------------------------------
  // These methods combine multiple actions into one reusable step.
  // They represent a complete "task" a user performs on this page.
  // In the test file, you call ONE method instead of four.
  //
  // This is the most powerful part of Page Object Model —
  // your test reads like plain English:
  //   await step1.completeStep({ name: '...', channel: '...', description: '...' })
  // ----------------------------------------------------------

  /**
   * Complete the entire Step 1 form with the "Handled By AI" path.
   *
   * This is a COMPOUND action — it calls all individual action
   * methods in the correct order for the happy path (test #1).
   *
   * @param options - All the values needed to fill Step 1
   *   @param options.campaignName  - Required. The campaign name.
   *   @param options.channelName   - Required. Exact name of the WhatsApp channel.
   *   @param options.description   - Required when AI is selected.
   *
   * USAGE IN TEST FILE:
   *   await step1.completeStepWithAI({
   *     campaignName: 'QA Test Campaign',
   *     channelName:  'My WhatsApp Channel',
   *     description:  'Handle customer queries automatically using AI.'
   *   });
   */
  async completeStepWithAI(options: {
    campaignName: string;
    channelName: string;
    description: string;
  }): Promise<void> {
    // await this.fillCampaignName(options.campaignName);
    // await this.selectChannel(options.channelName);
    // await this.selectHandledByAI();
    // await this.fillDescription(options.description);
    // await this.clickContinue();
    // REFINED IMPLEMENTATION:
    // This method is the "API" for your test files. By calling the 
    // individual methods we built, we ensure that if the 'Channel' 
    // logic changes, we only fix it in selectChannel(), not everywhere.

    await this.fillCampaignName(options.campaignName);
    await this.selectChannel(options.channelName);
    await this.selectHandledByAI();
    await this.fillDescription(options.description);
    await this.clickContinue();
    
    // Implementation Note: This compound action represents the "Happy Path." 
    // For "Negative Paths" (e.g., testing validation errors), the test 
    // should call individual methods instead of this one.
  }


}
