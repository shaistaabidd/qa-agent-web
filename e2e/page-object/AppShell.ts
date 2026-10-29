import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class AppShell extends BasePage {
  readonly notFoundTitle = this.page.getByText('Page not found');

  constructor(page: Page) {
    super(page);
  }

  navLink(label: string) {
    return this.page.getByRole('link', { name: label, exact: true });
  }

  async open(path: string) {
    await this.goto(path);
  }

  async expectOnPage(path: string) {
    await this.expectPath(path);
    await expect(this.notFoundTitle).toBeHidden();
  }

  async expectNotFound() {
    await expect(this.notFoundTitle).toBeVisible();
  }

  readonly logoutDialog = this.page.getByRole('dialog', { name: 'Log out?' });

  async openLogoutDialog() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.logoutDialog).toBeVisible();
  }

  async cancelLogout() {
    await this.logoutDialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.logoutDialog).toBeHidden();
  }

  async confirmLogout() {
    await this.logoutDialog.getByRole('button', { name: 'Log out' }).click();
  }

  async expectBackLink(label: string, path: string) {
    const link = this.page.getByRole('link', { name: label });
    await expect(link).toBeVisible();
    await link.click();
    await this.expectPath(path);
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: /log ?out/i })
      .click();
    await this.expectPath('/login');
  }

  async expectImpersonating(name: string) {
    await expect(this.page.getByText(`You are impersonating ${name}.`)).toBeVisible();
  }

  async expectNotImpersonating() {
    await expect(this.page.getByText(/You are impersonating/)).toBeHidden();
  }

  async backToAdmin() {
    await this.page.getByRole('button', { name: 'Back to Admin' }).click();
  }
}
