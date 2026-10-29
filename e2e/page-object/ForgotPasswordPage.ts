import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  readonly heading = this.page.getByText('Forgot Password', { exact: true });
  readonly emailInput = this.page.getByLabel('Email address');
  readonly submitButton = this.page.getByRole('button', { name: /send verification code/i });
  readonly backToLoginLink = this.page.getByRole('link', { name: 'Back to login' });

  constructor(page: Page) {
    super(page);
  }

  goto() {
    return super.goto('/forgot-password');
  }

  async expectLoaded() {
    await this.expectPath('/forgot-password');
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
  }

  async submitEmail(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async expectInvalidEmail() {
    await expect(this.page.getByText(/valid email/i)).toBeVisible();
  }

  async expectRequiredEmail() {
    await expect(this.emailInput).toHaveAttribute('aria-invalid', 'true');
  }
}
