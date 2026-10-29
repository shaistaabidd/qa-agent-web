import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class PaymentResultPage extends BasePage {
  readonly successTitle = this.page.getByText('Payment successful!');
  readonly failedTitle = this.page.getByText('Payment failed');
  readonly dashboardButton = this.page.getByRole('button', { name: 'Go to Dashboard' });
  readonly tryAgainButton = this.page.getByRole('button', { name: 'Try Again' });

  constructor(page: Page) {
    super(page);
  }

  openSuccess(query = '') {
    return this.goto(`/payment-success${query}`);
  }

  openFailed(query = '') {
    return this.goto(`/payment-failed${query}`);
  }

  async expectSuccess() {
    await this.expectPath('/payment-success');
    await expect(this.successTitle).toBeVisible();
  }

  async expectFailed() {
    await this.expectPath('/payment-failed');
    await expect(this.failedTitle).toBeVisible();
  }

  async expectBillingItem(title: string, detail: string) {
    await expect(this.page.getByRole('listitem').filter({ hasText: title })).toContainText(detail);
  }
}
