import { expect, test } from '../../fixtures';
import { featureFlags } from '../../fixtures/featureFlags';
import { GraphqlFailure, type GraphqlMock } from '../../fixtures/graphql';
import { buildFetchedUser, buildUser } from '../../fixtures/mockUsers';
import type { MockSession } from '../../fixtures/session';
import type { SettingsPage } from '../../page-object/SettingsPage';

const STRONG_PASSWORD = 'Strong#Pass1';

// A fake account that changes when the app saves, so the page shows what was saved.
// Like the API, an email change waits for a code (unconfirmedEmail) unless emailChangeOtp is off.
function accountApi(
  overrides: {
    changePasswordOk?: boolean;
    emailChangeOtp?: boolean;
    emailCodeOk?: boolean;
    pendingEmail?: string;
  } = {},
) {
  const { changePasswordOk = true, emailChangeOtp = true, emailCodeOk = true } = overrides;
  let pendingEmail = overrides.pendingEmail ?? '';
  let account = buildFetchedUser('super_admin', {
    featureFlags: featureFlags({ emailChangeOtpEnabled: emailChangeOtp }),
    email: 'ada@example.test',
    firstName: 'Ada',
    fullName: 'Ada Lovelace',
    lastName: 'Lovelace',
    unconfirmedEmail: overrides.pendingEmail ?? null,
  });

  return {
    ConfirmEmailChange: () => {
      if (!emailCodeOk) {
        return new GraphqlFailure('Invalid verification code.');
      }
      account = { ...account, email: pendingEmail, unconfirmedEmail: null };

      return { confirmEmailChange: { user: account } };
    },
    RequestEmailChange: (variables: Record<string, unknown>) => {
      pendingEmail = String(variables.email);
      if (!emailChangeOtp) {
        account = { ...account, email: pendingEmail, unconfirmedEmail: null };
        return {
          requestEmailChange: { message: 'Your email address has been updated.', user: account },
        };
      }

      return {
        requestEmailChange: {
          message: 'Code sent',
          user: { ...account, unconfirmedEmail: pendingEmail },
        },
      };
    },
    UpdatePassword: () => ({ updatePassword: { success: changePasswordOk } }),
    UpdateUser: (variables: Record<string, unknown>) => {
      account = { ...account, ...variables };
      if ('firstName' in variables || 'lastName' in variables) {
        account.fullName = `${account.firstName} ${account.lastName}`;
      }

      return { updateUser: { user: account } };
    },
    FetchUser: () => ({ fetchUser: account }),
  };
}

test.describe('Settings (mocked account)', () => {
  test('shows the name and email from the account', async ({ session, settingsPage }) => {
    await session.signInAs(buildUser('super_admin'), accountApi());

    await settingsPage.open();

    await settingsPage.expectLoaded();
    await settingsPage.expectShown('Ada Lovelace', 'ada@example.test');
  });

  test('saving a new name updates the page and tells the user', async ({
    session,
    settingsPage,
  }) => {
    const mock = await session.signInAs(buildUser('super_admin'), accountApi());
    await settingsPage.open();
    await settingsPage.expectLoaded();

    await settingsPage.saveName('Grace', 'Hopper');

    await settingsPage.expectToast('Profile updated successfully.');
    await settingsPage.expectShown('Grace Hopper');
    expect(mock.callsTo('UpdateUser')[0]?.variables).toMatchObject({
      firstName: 'Grace',
      lastName: 'Hopper',
    });
  });

  test('the phone is shown and edited with the name, and email is not part of it', async ({
    session,
    settingsPage,
  }) => {
    const mock = await session.signInAs(buildUser('super_admin'), accountApi());
    await settingsPage.open();
    await settingsPage.expectShown('+1 201 555 0123');

    await settingsPage.openEditDetails();
    await settingsPage.expectNoEmailField();
    await settingsPage.cancelDialog();
    await settingsPage.savePhone('2025550199');

    await settingsPage.expectToast('Profile updated successfully.');
    await settingsPage.expectShown('+1 202 555 0199');
    expect(mock.callsTo('UpdateUser')[0]?.variables).toMatchObject({ phone: '+12025550199' });
  });
});

test.describe('Settings: change password (mocked account)', () => {
  let mock: GraphqlMock;

  async function openChangePassword(
    session: MockSession,
    settingsPage: SettingsPage,
    api = accountApi(),
  ) {
    mock = await session.signInAs(buildUser('super_admin'), api);
    await settingsPage.open('security');
    await settingsPage.expectLoaded();
    await settingsPage.openChangePassword();
  }

  test('the form checks every field before sending', async ({ session, settingsPage }) => {
    await openChangePassword(session, settingsPage);

    await settingsPage.submitPassword('', 'weak', 'other');

    await settingsPage.expectDialogError('Password is required');
    await settingsPage.expectDialogError('Password must meet all the requirements listed below');
    await settingsPage.expectDialogError('Passwords do not match');
    expect(mock.callsTo('UpdatePassword')).toHaveLength(0);
  });

  test('a valid change is sent, confirmed and closes the dialog', async ({
    session,
    settingsPage,
  }) => {
    await openChangePassword(session, settingsPage);

    await settingsPage.submitPassword('Old#Password1', STRONG_PASSWORD);

    await settingsPage.expectToast('Password changed successfully.');
    await settingsPage.expectDialogClosed();
    expect(mock.callsTo('UpdatePassword')[0]?.variables).toMatchObject({
      currentPassword: 'Old#Password1',
      password: STRONG_PASSWORD,
      passwordConfirmation: STRONG_PASSWORD,
    });
  });

  test('when the server refuses, the user is told and the dialog stays open', async ({
    session,
    settingsPage,
  }) => {
    await openChangePassword(session, settingsPage, accountApi({ changePasswordOk: false }));

    await settingsPage.submitPassword('Wrong#Password1', STRONG_PASSWORD);

    await settingsPage.expectToast('Unable to change password.');
    await expect(settingsPage.dialog).toBeVisible();
  });
});

test.describe('Settings: change email (mocked account)', () => {
  test('a code sent to the new address lets the user save a new login email', async ({
    session,
    settingsPage,
  }) => {
    const mock = await session.signInAs(buildUser('super_admin'), accountApi());
    await settingsPage.open();
    await settingsPage.expectLoaded();

    await settingsPage.requestEmailChange('grace@example.test', 'Old#Password1');
    await settingsPage.verifyEmailCode('123456');

    await settingsPage.expectToast('Login email changed successfully.');
    await settingsPage.expectShown('grace@example.test');
    expect(mock.callsTo('RequestEmailChange')[0]?.variables).toMatchObject({
      currentPassword: 'Old#Password1',
      email: 'grace@example.test',
    });
    expect(mock.callsTo('ConfirmEmailChange')[0]?.variables).toMatchObject({
      otpCode: '123456',
    });
  });

  test('a change still waiting for its code shows after a reload and can be finished', async ({
    session,
    settingsPage,
  }) => {
    const mock = await session.signInAs(
      buildUser('super_admin'),
      accountApi({ pendingEmail: 'grace@example.test' }),
    );
    await settingsPage.open();
    await settingsPage.expectLoaded();

    await settingsPage.expectPendingEmail('grace@example.test');
    await settingsPage.openPendingEmailCode();
    await settingsPage.verifyEmailCode('123456');

    await settingsPage.expectToast('Login email changed successfully.');
    await settingsPage.expectShown('grace@example.test');
    expect(mock.callsTo('RequestEmailChange')).toHaveLength(0);
    expect(mock.callsTo('ConfirmEmailChange')[0]?.variables).toMatchObject({ otpCode: '123456' });
  });

  test('a wrong code is refused and the email stays the same', async ({
    session,
    settingsPage,
  }) => {
    await session.signInAs(buildUser('super_admin'), accountApi({ emailCodeOk: false }));
    await settingsPage.open();
    await settingsPage.expectLoaded();

    await settingsPage.requestEmailChange('grace@example.test', 'Old#Password1');
    await settingsPage.verifyEmailCode('000000');

    await settingsPage.expectToast('Invalid verification code.');
    await settingsPage.expectShown('ada@example.test');
  });

  test('with the code step off, the email changes at once without a code', async ({
    session,
    settingsPage,
  }) => {
    const mock = await session.signInAs(
      buildUser('super_admin', { featureFlags: featureFlags({ emailChangeOtpEnabled: false }) }),
      accountApi({ emailChangeOtp: false }),
    );
    await settingsPage.open();
    await settingsPage.expectLoaded();

    await settingsPage.changeEmailAtOnce('grace@example.test', 'Old#Password1');

    await settingsPage.expectToast('Your email address has been updated.');
    await settingsPage.expectShown('grace@example.test');
    expect(mock.callsTo('ConfirmEmailChange')).toHaveLength(0);
  });
});
