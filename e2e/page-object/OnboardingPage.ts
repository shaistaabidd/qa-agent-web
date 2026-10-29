import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

const STEPS = {
  step1: { heading: 'Your name', path: '/onboarding/step-1' },
  step2: { heading: 'Phone number', path: '/onboarding/step-2' },
} as const;

export class OnboardingPage extends BasePage {
  readonly firstName = this.page.getByLabel('First name');
  readonly lastName = this.page.getByLabel('Last name');
  readonly phone = this.page.getByRole('textbox', { name: /^Phone number/ });
  readonly nextButton = this.page.getByRole('button', { name: 'Next' });
  readonly backLink = this.page.getByRole('link', { name: 'Back' });
  readonly finishButton = this.page.getByRole('button', { name: 'Finish' });
  readonly missingAlert = this.page.getByText('Some details are missing');

  constructor(page: Page) {
    super(page);
  }

  async expectOnStep(step: keyof typeof STEPS, position: number, total = 2) {
    await this.expectPath(STEPS[step].path);
    await expect(this.page.getByRole('heading', { name: STEPS[step].heading })).toBeVisible();
    await expect(this.page.getByText(`Step ${position} of ${total}`)).toBeVisible();
  }

  async expectMissing(text: string) {
    await expect(this.missingAlert).toBeVisible();
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectStepDone(label: string) {
    await expect(this.page.getByRole('listitem').filter({ hasText: label })).toContainText(
      '(done)',
    );
  }

  async saveName(firstName: string, lastName: string) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.nextButton.click();
  }

  async doubleClickNext() {
    await this.nextButton.dblclick();
  }

  async doubleClickFinish() {
    await this.finishButton.dblclick();
  }

  async savePhone(phone: string) {
    await this.phone.fill(phone);
    await this.finishButton.click();
  }
}
