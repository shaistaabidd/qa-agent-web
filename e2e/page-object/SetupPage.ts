import { type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export const SETUP_STEP_PATHS = ['/onboarding/step-1', '/onboarding/step-2'] as const;

export class SetupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(path: string) {
    await this.goto(path);
  }

  async expectSentToHome() {
    await this.expectPath('/projects');
  }
}
