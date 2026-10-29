import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

type PasswordFormConfig = {
  confirmLabel: string;
  heading: string;
  passwordLabel: string;
  submitLabel: string;
};

/** A screen that sets a new password: a password, a confirmation and a submit button. */
export class PasswordFormPage extends BasePage {
  constructor(
    page: Page,
    private readonly config: PasswordFormConfig,
  ) {
    super(page);
  }

  get heading() {
    return this.page.getByRole('heading', { name: this.config.heading });
  }

  get password() {
    return this.page.getByLabel(this.config.passwordLabel, { exact: true });
  }

  get confirmation() {
    return this.page.getByLabel(this.config.confirmLabel, { exact: true });
  }

  get submitButton() {
    return this.page.getByRole('button', { name: this.config.submitLabel });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.password).toBeVisible();
  }

  async fill(password: string, confirmation = password) {
    await this.password.fill(password);
    await this.confirmation.fill(confirmation);
  }

  async submit(password: string, confirmation = password) {
    await this.fill(password, confirmation);
    await this.submitButton.click();
  }

  async expectRequirement(label: string) {
    await expect(this.page.getByText(label)).toBeVisible();
  }

  async expectError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
