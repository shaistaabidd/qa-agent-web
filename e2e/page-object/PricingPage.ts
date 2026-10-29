import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class PricingPage extends BasePage {
  readonly heading = this.page.getByText('Pricing', { exact: true });
  readonly paymentButton = this.page.getByRole('button', { name: 'Continue to Payment' });

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await this.expectPath('/pricing');
    await expect(this.heading).toBeVisible();
    await expect(this.paymentButton).toBeEnabled();
  }

  item(title: string) {
    // Anchored, so "Assessment Price" does not also match "Submitted Assessment Price".
    return this.page.getByRole('listitem').filter({ hasText: new RegExp(`^\\s*${title}`) });
  }

  async expectItem(title: string, detail: string) {
    await expect(this.item(title).first()).toContainText(detail);
  }

  async expectNoItem(title: string) {
    await expect(this.item(title)).toHaveCount(0);
  }

  async continueToPayment() {
    await this.paymentButton.click();
  }
}
