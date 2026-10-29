import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export type SignupValues = {
  confirmPassword?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export class SignupPage extends BasePage {
  readonly heading = this.page.getByRole('heading', { name: 'Create an account' });
  readonly firstName = this.page.getByLabel('First name');
  readonly lastName = this.page.getByLabel('Last name');
  readonly email = this.page.getByLabel('Email address');
  readonly password = this.page.getByLabel('Password', { exact: true });
  readonly confirmPassword = this.page.getByLabel('Confirm password');
  readonly submitButton = this.page.getByRole('button', { name: 'Create account' });
  readonly loginLink = this.page.getByRole('link', { name: 'Log in' });
  readonly closedTitle = this.page.getByText('Sign-up is closed');
  readonly backToLoginLink = this.page.getByRole('link', { name: 'Back to log in' });
  readonly unavailableTitle = this.page.getByText('Sign-up is unavailable');
  readonly tryAgainButton = this.page.getByRole('button', { name: 'Try again' });

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/signup');
    await this.expectLoaded();
  }

  async expectLoaded() {
    await this.expectPath('/signup');
    await expect(this.heading).toBeVisible();
  }

  async expectClosed() {
    await this.expectPath('/signup');
    await expect(this.closedTitle).toBeVisible();
    await expect(this.heading).toBeHidden();
  }

  /** The flags could not be read, so the form stays hidden until the API confirms sign-up is on. */
  async expectUnavailable() {
    await this.expectPath('/signup');
    await expect(this.unavailableTitle).toBeVisible();
    await expect(this.heading).toBeHidden();
  }

  async fill(values: SignupValues) {
    await this.firstName.fill(values.firstName);
    await this.lastName.fill(values.lastName);
    await this.email.fill(values.email);
    await this.password.fill(values.password);
    await this.confirmPassword.fill(values.confirmPassword ?? values.password);
  }

  async submit(values: SignupValues) {
    await this.fill(values);
    await this.submitButton.click();
  }

  async expectRequirement(label: string) {
    await expect(this.page.getByText(label)).toBeVisible();
  }

  async expectError(message: string, count = 1) {
    await expect(this.page.getByText(message)).toHaveCount(count);
  }
}
