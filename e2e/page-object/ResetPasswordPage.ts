import type { Page } from '@playwright/test';

import { PasswordFormPage } from './PasswordFormPage';

export class ResetPasswordPage extends PasswordFormPage {
  constructor(page: Page) {
    super(page, {
      confirmLabel: 'Confirm New Password',
      heading: 'Reset Password',
      passwordLabel: 'New Password',
      submitLabel: 'Reset Password',
    });
  }

  open() {
    return this.goto('/reset-password');
  }

  openSuccess() {
    return this.goto('/reset-password/success');
  }

  async expectSuccessShown() {
    await this.expectPath('/reset-password/success');
    await this.expectError(
      'Your password has been successfully reset. You can now sign in with your new password.',
    );
  }

  async goToLogin() {
    await this.page.getByRole('link', { name: 'Log in now' }).click();
  }
}
