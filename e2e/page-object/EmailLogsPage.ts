import { expect, type Page } from '@playwright/test';

import { AdminListPage } from './AdminListPage';

export class EmailLogsPage extends AdminListPage {
  readonly viewButtons = this.page.getByRole('button', { name: 'View email log' });
  readonly backButton = this.page.getByRole('button', { name: 'Back to email logs' });

  constructor(page: Page) {
    super(page, {
      headingLevel: 1,
      emptyTitle: 'No email logs',
      path: '/email-logs',
      searchParam: 'search',
      searchPlaceholder: 'Search email log by recipient',
      title: 'Email Logs',
    });
  }

  async hasRows() {
    await expect(this.heading).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    return (await this.viewButtons.count()) > 0;
  }

  async openFirstLog() {
    await this.viewButtons.first().click();
    await expect(this.page).toHaveURL((url) => /^\/email-logs\/[^/]+$/.test(url.pathname));
    await expect(this.backButton).toBeVisible();
  }

  async goBackToList() {
    await this.backButton.click();
    await this.expectLoaded();
  }

  async filterByStatus(status: 'All' | 'Failed' | 'Success') {
    await this.openFilters();
    await this.choose('Status', status);
    await this.applyFilters();
  }

  async filterByStatusWithKeyboard(status: 'All' | 'Failed' | 'Success') {
    await this.openFilters();
    await this.chooseWithKeyboard('Status', ['All', 'Failed', 'Success'], status);
    await this.applyFilters();
  }

  async expectStatusTag(recipient: string, status: RegExp) {
    await expect(this.rows.filter({ hasText: recipient })).toContainText(status);
  }

  async openLogFor(recipient: string) {
    await this.rows
      .filter({ hasText: recipient })
      .getByRole('button', { name: 'View email log' })
      .click();
    await expect(this.page).toHaveURL((url) => /^\/email-logs\/[^/]+$/.test(url.pathname));
  }

  async openDetail(id: string) {
    await this.goto(`/email-logs/${id}`);
    await expect(this.backButton).toBeVisible();
  }

  async expectDetailTitle(title: string) {
    await expect(
      this.page.getByRole('heading', { name: title, level: 1, exact: true }),
    ).toBeVisible();
  }

  async expectDetailRow(label: string, value: string) {
    const row = this.page.getByText(label, { exact: true }).locator('..');
    await expect(row).toContainText(value);
  }

  async expectDetail(values: { recipient: string; subject: string }) {
    await expect(this.backButton).toBeVisible();
    await expect(this.page.getByRole('heading', { name: values.subject, level: 1 })).toBeVisible();
    await expect(this.page.getByText(values.recipient, { exact: true })).toBeVisible();
  }

  async expectDetailText(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectAttempts(count: number) {
    await expect(this.page.getByText('Attempts', { exact: true })).toBeVisible();
    await expect(this.page.getByText(String(count), { exact: true })).toBeVisible();
  }

  async expectNoDetailText(text: string) {
    await expect(this.page.getByText(text)).toBeHidden();
  }
}
