import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

const OTP_LENGTH = 6;

export class OtpPage extends BasePage {
  readonly heading = this.page.getByText('Two-factor Authentication');
  readonly resendButton = this.page.getByRole('button', { name: 'Resend Code' });
  readonly backLink = this.page.getByRole('button', { name: 'Back to login' });
  readonly submitButton = this.page.getByRole('button', { name: /verify/i });

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await this.expectPath('/otp');
    await expect(this.heading).toBeVisible();
  }

  async expectSignedIn() {
    // The app finishes sign-in with a full page navigation, so wait for it before moving on.
    await expect(this.page).not.toHaveURL((url) => url.pathname === '/otp');
    await this.page.waitForLoadState('load');
  }

  async expectSentTo(email: string) {
    await expect(this.page.getByText(`verification code sent to ${email}`)).toBeVisible();
  }

  async expectCodeRequired() {
    await expect(this.page.getByText('Please enter the 6-digit verification code')).toBeVisible();
  }

  async expectResendWaiting() {
    await expect(this.page.getByText(/You can resend a new code in \d+ seconds?/)).toBeVisible();
    await expect(this.resendButton).toBeDisabled();
  }

  /** Makes the resend cooldown look finished, like waiting it out. */
  async finishResendCooldown() {
    await this.page.evaluate(() => {
      localStorage.setItem('otp_timer_simple_timestamp', String(Date.now() - 60_000));
    });
    await expect(this.resendButton).toBeEnabled();
  }

  async enterCode(code: string) {
    if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) {
      throw new Error(`OTP must be ${OTP_LENGTH} digits.`);
    }

    // The first slot accepts a pasted/typed full code and spreads it across the slots.
    await this.page.getByLabel('Digit 1').fill(code);
  }

  async submitIncomplete(code: string) {
    await this.page.getByLabel('Digit 1').fill(code);
    await this.submitButton.click();
  }

  async submit(code: string) {
    await this.enterCode(code);
    await this.submitButton.click();
  }
}
