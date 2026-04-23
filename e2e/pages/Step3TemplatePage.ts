import { Page, Locator } from '@playwright/test';

export class Step3TemplatePage {
  readonly page: Page;
  
  // Static Locators
  readonly continueButton: Locator;
  readonly saveAsDraftButton: Locator;
  readonly templateRadioGroup: Locator;

  constructor(page: Page) {
    this.page = page;

    // We target the Continue button by its role and specific text
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.saveAsDraftButton = page.getByRole('button', { name: 'save as draft' });
    
    // The container for templates usually has a radio-group role
    this.templateRadioGroup = page.getByRole('radio');
  }

  /**
   * Selects a template by its visible label text.
   * @param templateName - e.g., 'navigate_testing'
   */
  async selectTemplate(templateName: string) {
    // 1. Find the radio button that has the specific aria-label or is next to the text
    const template = this.page.getByRole('radio', { name: templateName });
    await template.click();
  }

  /**
   * Interacts with "Select" dropdown lists. 
   * Since there can be multiple, we target them by their current text "Select".
   * @param index - which dropdown to click (0 for the first, 1 for second, etc.)
   * @param value - the text of the option you want to pick
   */
  async selectFromList(index: number = 0, value: string) {
    const dropdown = this.page.locator('span:text("Select")').nth(index);
    await dropdown.click();
    
    // After clicking, we look for the option in the popup/listbox
    await this.page.getByRole('option', { name: value }).click();
  }

  /**
   * Helper to wait until the continue button is actually enabled.
   * Useful because the UI stays disabled until parameters are filled.
   */
  async clickContinue() {
    // This will wait for the 'disabled' attribute to be removed automatically
    await this.continueButton.click({ force: false });
  }

  /**
   * Checks if the continue button is disabled.
   * Useful for negative testing.
   */
  async isContinueDisabled(): Promise<boolean> {
    return await this.continueButton.isDisabled();
  }
}