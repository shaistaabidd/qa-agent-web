import type { Page } from '@playwright/test';

import { PasswordFormPage } from './PasswordFormPage';

export class SetupAccountPage extends PasswordFormPage {
  constructor(page: Page) {
    super(page, {
      confirmLabel: 'Confirm Password',
      heading: 'Set Up Your Account',
      passwordLabel: 'Password',
      submitLabel: 'Create Account',
    });
  }

  openInvite(token: string, path: '/setup-account' | '/set-password' = '/setup-account') {
    return this.goto(`${path}?token=${token}`);
  }

  openWithoutToken() {
    return this.goto('/setup-account');
  }
}
