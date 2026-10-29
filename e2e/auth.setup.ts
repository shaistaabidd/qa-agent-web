import { mkdirSync } from 'node:fs';
import path from 'node:path';

import { test as setup } from './fixtures';
import { readEnv } from './fixtures/env';
import { COADMIN_STATE, coAdminCredentials } from './fixtures/users';

setup('sign in as co-admin and save the session', async ({ loginPage, otpPage, page }) => {
  const otp = readEnv('E2E_OTP');
  setup.skip(!otp, 'Set E2E_OTP to a current 6-digit code to refresh the saved session.');

  const { email, password } = coAdminCredentials();

  await loginPage.goto();
  await loginPage.login(email, password);
  await otpPage.expectLoaded();
  await otpPage.submit(otp as string);
  await loginPage.expectPath('/projects');

  mkdirSync(path.dirname(COADMIN_STATE), { recursive: true });
  await page.context().storageState({ path: COADMIN_STATE });
});
