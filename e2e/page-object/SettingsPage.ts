import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  readonly heading = this.page.getByText('Account Settings', { exact: true });
  readonly accountTab = this.page.getByRole('tab', { name: 'Account' });
  readonly securityTab = this.page.getByRole('tab', { name: 'Security' });
  readonly editDetailsButton = this.page.getByRole('button', { name: 'Edit Details' });
  readonly changePasswordButton = this.page.getByRole('button', { name: 'Change Password' });
  readonly dialog = this.page.getByRole('dialog');

  constructor(page: Page) {
    super(page);
  }

  open(tab?: 'account' | 'security') {
    return this.goto(tab && tab !== 'account' ? `/settings?tab=${tab}` : '/settings');
  }

  async expectLoaded() {
    await this.expectPath('/settings');
    await expect(this.heading).toBeVisible();
    await expect(this.accountTab).toBeVisible();
    await expect(this.securityTab).toBeVisible();
  }

  async expectTabSelected(tab: 'account' | 'security') {
    const selected = tab === 'account' ? this.accountTab : this.securityTab;
    await expect(selected).toHaveAttribute('aria-selected', 'true');
  }

  async expectAccountContent() {
    await expect(this.editDetailsButton).toBeVisible();
  }

  async expectSecurityContent() {
    await expect(this.changePasswordButton).toBeVisible();
  }

  async expectTabInUrl(tab: 'security') {
    await expect(this.page).toHaveURL(new RegExp(`[?&]tab=${tab}`));
  }

  async openSecurityTab() {
    await this.securityTab.click();
    await this.expectTabSelected('security');
  }

  async openEditDetails() {
    await this.editDetailsButton.click();
    await expect(this.page.getByRole('dialog', { name: 'Edit Details' })).toBeVisible();
  }

  /** Edit Details covers name and phone only; email changes through Change Email. */
  async expectNoEmailField() {
    await expect(this.dialog.getByLabel('Email')).toHaveCount(0);
  }

  async openChangePassword() {
    await this.changePasswordButton.click();
    await expect(this.page.getByRole('dialog', { name: 'Change Password' })).toBeVisible();
  }

  async cancelDialog() {
    await this.dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.dialog).toBeHidden();
  }

  async clearFirstNameAndSave() {
    await this.dialog.getByLabel('First Name').fill('');
    await this.dialog.getByRole('button', { name: 'Save Changes' }).click();
  }

  async expectFirstNameRequired() {
    await expect(this.dialog.getByText('Please enter a first name')).toBeVisible();
    await expect(this.dialog).toBeVisible();
  }

  dialogNamed(name: string) {
    return this.page.getByRole('dialog', { name });
  }

  async expectShown(...values: string[]) {
    for (const value of values) {
      await expect(this.page.getByRole('tabpanel').getByText(value, { exact: true })).toBeVisible();
    }
  }

  async confirmDialog(label: string) {
    await this.dialog.getByRole('button', { name: label, exact: true }).click();
  }

  async expectDialogClosed() {
    await expect(this.dialog).toBeHidden();
  }

  async expectDialogError(message: string) {
    await expect(this.dialog.getByText(message)).toBeVisible();
  }

  async saveName(firstName: string, lastName: string) {
    await this.openEditDetails();
    await this.dialog.getByLabel('First Name').fill(firstName);
    await this.dialog.getByLabel('Last Name').fill(lastName);
    await this.confirmDialog('Save Changes');
  }

  async savePhone(phone: string) {
    await this.openEditDetails();
    await this.dialog.getByRole('textbox', { name: /^Phone Number/ }).fill(phone);
    await this.confirmDialog('Save Changes');
  }

  async submitPassword(current: string, next: string, confirmation = next) {
    await this.dialog.getByLabel('Current Password').fill(current);
    await this.dialog.getByLabel('New Password', { exact: true }).fill(next);
    await this.dialog.getByLabel('Confirm New Password').fill(confirmation);
    await this.confirmDialog('Change Password');
  }

  async requestEmailChange(email: string, currentPassword: string) {
    await this.page.getByRole('button', { name: 'Change Email' }).click();
    await expect(this.page.getByRole('dialog', { name: 'Enter New Email' })).toBeVisible();
    await this.dialog.getByLabel('New email address').fill(email);
    await this.dialog.getByLabel('Current password').fill(currentPassword);
    await this.confirmDialog('Send Code');
    await expect(
      this.page.getByRole('dialog', { name: 'Enter the verification code' }),
    ).toBeVisible();
  }

  /** With the code step off, the dialog says so and applies the change without asking for a code. */
  async changeEmailAtOnce(email: string, currentPassword: string) {
    await this.page.getByRole('button', { name: 'Change Email' }).click();
    const dialog = this.page.getByRole('dialog', { name: 'Enter New Email' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('It changes right away')).toBeVisible();
    await this.dialog.getByLabel('New email address').fill(email);
    await this.dialog.getByLabel('Current password').fill(currentPassword);
    await this.confirmDialog('Change Email');
    await this.expectDialogClosed();
  }

  async expectPendingEmail(email: string) {
    await expect(this.page.getByText('Waiting for a code')).toBeVisible();
    await expect(this.page.getByRole('tabpanel').getByText(email, { exact: true })).toBeVisible();
  }

  async openPendingEmailCode() {
    await this.page.getByRole('button', { name: 'Enter Code' }).click();
    await expect(
      this.page.getByRole('dialog', { name: 'Enter the verification code' }),
    ).toBeVisible();
  }

  async verifyEmailCode(code: string) {
    await this.dialog.getByLabel('Digit 1').fill(code);
    await this.confirmDialog('Verify Code');
  }
}
