import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export type ProfileValues = {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  zipCode: string;
};

export class ProfileSetupPage extends BasePage {
  readonly heading = this.page.getByText('Profile setup', { exact: true });
  readonly firstName = this.page.getByLabel('First name');
  readonly lastName = this.page.getByLabel('Last name');
  readonly clinicName = this.page.getByLabel('Clinic name');
  readonly website = this.page.getByLabel('Website');
  readonly phone = this.page.getByLabel('Phone', { exact: true });
  readonly address = this.page.getByLabel('Address', { exact: true });
  readonly city = this.page.getByLabel('City', { exact: true });
  readonly state = this.page.getByLabel('State', { exact: true });
  readonly zipCode = this.page.getByLabel('ZIP code');
  readonly smsConsent = this.page.getByRole('checkbox', { name: /receive SMS updates/i });
  readonly continueButton = this.page.getByRole('button', { name: 'Continue' });

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await this.expectPath('/profile-setup');
    await expect(this.heading).toBeVisible();
  }

  async fill(values: ProfileValues) {
    await this.firstName.fill(values.firstName);
    await this.lastName.fill(values.lastName);
    await this.phone.fill(values.phone);
    await this.address.fill(values.address);
    await this.city.fill(values.city);
    await this.state.fill(values.state);
    await this.zipCode.fill(values.zipCode);
  }

  async fillClinic(values: { clinicName: string; website?: string }) {
    await this.clinicName.fill(values.clinicName);
    if (values.website) {
      await this.website.fill(values.website);
    }
  }

  async submit() {
    await this.continueButton.click();
  }

  async expectRequiredErrors(count: number) {
    await expect(this.page.getByText('This field is required')).toHaveCount(count);
  }

  async expectInvalidPhone() {
    await expect(this.page.getByText('Please enter a valid phone number')).toBeVisible();
  }
}
