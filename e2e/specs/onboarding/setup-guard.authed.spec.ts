import { test } from '../../fixtures';
import { COADMIN_STATE, hasAuthState } from '../../fixtures/users';
import { SETUP_STEP_PATHS } from '../../page-object/SetupPage';

test.skip(!hasAuthState(COADMIN_STATE), 'No saved session. Run: E2E_OTP=<code> npm run e2e:auth');

test.use({ storageState: COADMIN_STATE });

test.describe('Onboarding guard (co-admin with setup complete)', () => {
  for (const path of SETUP_STEP_PATHS) {
    test(`${path} sends a user with setup complete to the dashboard`, async ({ setupPage }) => {
      await setupPage.open(path);

      await setupPage.expectSentToDashboard();
    });
  }

  test('/payment-success stays reachable and shows the confirmation', async ({ setupPage }) => {
    await setupPage.open('/payment-success');

    await setupPage.expectPaymentSuccessShown();
  });
});
