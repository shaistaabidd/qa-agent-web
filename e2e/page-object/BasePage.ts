import { expect, type Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  goto(path: string) {
    return this.page.goto(path);
  }

  reload() {
    return this.page.reload();
  }

  /** `exact` matches the whole text, for a message that is part of another toast's ("Invitation sent." and "1 invitation sent."). */
  async expectToast(message: string, options?: { exact?: boolean }) {
    await expect(this.page.getByText(message, options)).toBeVisible();
  }

  async expectPath(path: string) {
    await expect(this.page).toHaveURL((url) => url.pathname === path);
  }
}
