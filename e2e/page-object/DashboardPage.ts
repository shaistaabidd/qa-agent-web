import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

const ADMIN_DESCRIPTION =
  'A snapshot of platform activity will appear here once this module is ready.';
const PERSONAL_DESCRIPTION =
  'A snapshot of your activity will appear here once this module is ready.';

export class DashboardPage extends BasePage {
  readonly heading = this.page.getByRole('heading', { name: 'Dashboard', level: 1 });

  constructor(page: Page) {
    super(page);
  }

  navLink(label: string) {
    return this.page.getByRole('link', { name: label, exact: true });
  }

  async expectAdminView() {
    await this.expectPath('/dashboard');
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByText(ADMIN_DESCRIPTION)).toBeVisible();
  }

  async expectPersonalView() {
    await this.expectPath('/dashboard');
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByText(PERSONAL_DESCRIPTION)).toBeVisible();
  }

  async expectNavLinks(visible: string[], hidden: string[]) {
    for (const label of visible) {
      await expect(this.navLink(label)).toBeVisible();
    }
    for (const label of hidden) {
      await expect(this.navLink(label)).toBeHidden();
    }
  }
}
