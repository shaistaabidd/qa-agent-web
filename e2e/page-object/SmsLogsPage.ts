import { expect, type Page } from '@playwright/test';

import { AdminListPage } from './AdminListPage';

export class SmsLogsPage extends AdminListPage {
  readonly details = this.page.getByRole('dialog', { name: 'SMS log details' });

  constructor(page: Page) {
    super(page, {
      emptyTitle: 'No SMS logs',
      headingLevel: 2,
      path: '/sms-logs',
      searchParam: 'q',
      searchPlaceholder: 'Search SMS log by recipient',
      title: 'SMS Logs',
    });
  }

  async filterBy(filters: { messageType?: string; status?: string }) {
    await this.openFilters();
    if (filters.status) {
      await this.choose('Status', filters.status);
    }
    if (filters.messageType) {
      await this.choose('Message type', filters.messageType);
    }
    await this.applyFilters();
  }

  async expectStatusTag(recipient: string, status: RegExp) {
    await expect(this.rows.filter({ hasText: recipient })).toContainText(status);
  }

  async expectRowText(recipient: string, text: string) {
    await expect(this.rows.filter({ hasText: recipient })).toContainText(text);
  }

  async openLogFor(recipient: string) {
    await this.rows.filter({ hasText: recipient }).getByText(recipient).click();
    await expect(this.details).toBeVisible();
  }

  async expectDetailText(text: string) {
    await expect(this.details.getByText(text)).toBeVisible();
  }

  async closeDetails() {
    await this.details.getByRole('button', { name: 'Close' }).first().click();
    await expect(this.details).toBeHidden();
  }

  async openFirstLog() {
    await this.rows.first().getByRole('cell').first().click();
    await expect(this.details).toBeVisible();
  }

  async expectNoMarkupInjected() {
    await expect(this.page.locator('img[src="x"]')).toHaveCount(0);
    expect(await this.page.evaluate(() => 'injected' in window)).toBe(false);
  }
}
