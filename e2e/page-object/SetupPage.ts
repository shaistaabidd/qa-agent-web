import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export const SETUP_STEP_PATHS = [
  '/profile-setup',
  '/pricing',
  '/sign-document',
  '/add-calendar',
  '/payment-failed',
] as const;

export class SetupPage extends BasePage {
  readonly paymentSuccessTitle = this.page.getByText('Payment successful!');
  readonly goToDashboardButton = this.page.getByRole('button', { name: 'Go to Dashboard' });

  constructor(page: Page) {
    super(page);
  }

  async open(path: string) {
    await this.goto(path);
  }

  async expectSentToDashboard() {
    await this.expectPath('/dashboard');
  }

  async expectPaymentSuccessShown() {
    await this.expectPath('/payment-success');
    await expect(this.paymentSuccessTitle).toBeVisible();
    await expect(this.goToDashboardButton).toBeEnabled();
  }
}
