import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class AddCalendarPage extends BasePage {
  readonly heading = this.page.getByText('Add calendar', { exact: true });
  readonly calendarLink = this.page.getByLabel('Calendar link');
  readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
  readonly skipButton = this.page.getByRole('button', { name: 'Skip for now' });

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await this.expectPath('/add-calendar');
    await expect(this.heading).toBeVisible();
  }

  async continueWith(link: string) {
    await this.calendarLink.fill(link);
    await this.continueButton.click();
  }
}
