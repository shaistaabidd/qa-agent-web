import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.getByLabel('Email address');
  readonly passwordInput = this.page.getByLabel('Password', { exact: true });
  readonly submitButton = this.page.getByRole('button', { name: /log in/i });
  readonly googleButton = this.page.getByRole('button', { name: 'Continue with Google' });
  readonly forgotPasswordLink = this.page.getByRole('link', { name: 'Forgot password?' });
  readonly signupLink = this.page.getByRole('link', { name: 'Sign up now' });

  constructor(page: Page) {
    super(page);
  }

  goto() {
    return super.goto('/login');
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.submitButton.click();
  }

  async expectInvalidEmail() {
    await expect(this.page.getByText(/valid email/i)).toBeVisible();
  }

  async expectLoaded() {
    await this.expectPath('/login');
    await expect(this.submitButton).toBeVisible();
  }

  /** Call once the flags have loaded: the link is also absent while they load. */
  async expectNoSignupLink() {
    await expect(this.submitButton).toBeVisible();
    await expect(this.signupLink).toBeHidden();
  }

  /** The form is usable with the safe flag defaults: no Google, no sign-up link. */
  async expectLoadedWithSafeDefaults() {
    await this.expectLoaded();
    await expect(this.googleButton).toBeHidden();
    await expect(this.signupLink).toBeHidden();
  }

  /** The API signed the user in without a code, so the app left login without the code screen. */
  async expectSignedInWithoutCode() {
    await expect(this.page).not.toHaveURL((url) => ['/login', '/otp'].includes(url.pathname));
    await this.page.waitForLoadState('load');
  }

  async expectRedirectTo(destination: string) {
    await this.expectPath('/login');
    await expect(this.page).toHaveURL((url) => url.searchParams.get('redirect') === destination);
  }
}
