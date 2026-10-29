import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class InvitePage extends BasePage {
  readonly expiredHeading = this.page.getByText('This invite link is invalid or has expired');
  readonly backToLoginLink = this.page.getByRole('link', { name: 'Back to login' });

  constructor(page: Page) {
    super(page);
  }

  async openInviteExpired() {
    await this.goto('/invite-expired');
    await this.expectPath('/invite-expired');
    await expect(this.expiredHeading).toBeVisible();
  }
}
