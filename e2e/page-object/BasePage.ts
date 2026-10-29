import { expect, type Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  goto(path: string) {
    return this.page.goto(path);
  }

  reload() {
    return this.page.reload();
  }

  async expectToast(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectPath(path: string) {
    await expect(this.page).toHaveURL((url) => url.pathname === path);
  }
}
