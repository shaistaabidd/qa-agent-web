import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class SignDocumentPage extends BasePage {
  readonly heading = this.page.getByText('Sign document', { exact: true });
  readonly agreeCheckbox = this.page.getByRole('checkbox', { name: /reviewed and agree/i });
  readonly confirmButton = this.page.getByRole('button', { name: 'Confirm and continue' });

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await this.expectPath('/sign-document');
    await expect(this.heading).toBeVisible();
  }

  async agree() {
    // The checkbox input is visually hidden under its label, so click the label text like a user.
    await this.page.getByText('I have reviewed and agree to the document.').click();
    await expect(this.agreeCheckbox).toBeChecked();
  }

  async signAndContinue() {
    await this.agree();
    await this.confirmButton.click();
  }
}
