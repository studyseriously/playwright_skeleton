import { Page, Locator } from '@playwright/test';

export class Step4ReviewPage {
  readonly page: Page;
  
  // Locators
  readonly sendCampaignButton: Locator;

  constructor(page: Page) {
    this.page = page;

    /**
     * Selector Strategy: 
     * We use getByRole with the exact text 'Send Campaign'.
     * This is highly stable and ignores the complex SVG and Tailwind classes 
     * in your HTML.
     */
    this.sendCampaignButton = page.getByRole('button', { name: 'Send Campaign' });
  }

  /**
   * Clicks the final send button.
   * * NOTE: In a real test, you might want to wait for a 
   * success message or a redirect after this click.
   */
  async clickSendCampaign() {
    await this.sendCampaignButton.click();
  }

  /**
   * Optional: Verify the page is actually the Review page 
   * by checking for the button visibility.
   */
  async verifyIsOnReviewPage() {
    await this.sendCampaignButton.waitFor({ state: 'visible' });
  }
}