import { test } from '../../fixtures';
import { COADMIN_STATE, hasAuthState } from '../../fixtures/users';

test.skip(!hasAuthState(COADMIN_STATE), 'No saved session. Run: E2E_OTP=<code> npm run e2e:auth');

test.use({ storageState: COADMIN_STATE });

test.describe('Settings (co-admin)', () => {
  test('opens on the Account tab', async ({ settingsPage }) => {
    await settingsPage.open();

    await settingsPage.expectLoaded();
    await settingsPage.expectTabSelected('account');
    await settingsPage.expectAccountContent();
  });

  test('switching to Security keeps the choice in the URL', async ({ settingsPage }) => {
    await settingsPage.open();

    await settingsPage.openSecurityTab();

    await settingsPage.expectSecurityContent();
    await settingsPage.expectTabInUrl('security');
  });

  test('opening the Security tab by URL selects it', async ({ settingsPage }) => {
    await settingsPage.open('security');

    await settingsPage.expectTabSelected('security');
    await settingsPage.expectSecurityContent();
  });

  test('Edit Details requires a first name and does not save', async ({ settingsPage }) => {
    await settingsPage.open();

    await settingsPage.openEditDetails();
    await settingsPage.clearFirstNameAndSave();

    await settingsPage.expectFirstNameRequired();
  });

  test('Edit Details can be cancelled', async ({ settingsPage }) => {
    await settingsPage.open();

    await settingsPage.openEditDetails();
    await settingsPage.cancelDialog();
  });

  test('Change Password can be opened and cancelled', async ({ settingsPage }) => {
    await settingsPage.open('security');

    await settingsPage.openChangePassword();
    await settingsPage.cancelDialog();
  });
});
