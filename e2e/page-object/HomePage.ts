import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading = this.page.getByRole('heading', { name: 'Projects', level: 1 });

  constructor(page: Page) {
    super(page);
  }

  navLink(label: string) {
    return this.page.getByRole('link', { name: label, exact: true });
  }

  async expectLoaded() {
    await this.expectPath('/projects');
    await expect(this.heading).toBeVisible();
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
