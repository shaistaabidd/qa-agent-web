import { expect, test } from '../../fixtures';
import { LEGACY_ROLE_SETUP_REDIRECT } from '../../fixtures/legacyRoles';
import { buildUser } from '../../fixtures/mockUsers';

const EMAIL = 'e2e+super_admin@example.test';
const STRONG_PASSWORD = 'Strong#Pass1';
const RESET_TOKEN = 'reset-token-123';

const resetHandlers = {
  SendResetPasswordInstructions: () => ({
    sendResetPasswordInstructions: { message: 'Verification code sent' },
  }),
  SetPassword: () => ({
    setPassword: { token: 'e2e-token', user: buildUser('super_admin') },
  }),
  ValidateOtp: () => ({
    validateOtp: {
      resetPasswordToken: RESET_TOKEN,
      token: null,
      user: buildUser('super_admin'),
    },
  }),
};

test.describe('Reset password', () => {
  test('forgot password, code, then a new password signs the user in', async ({
    appShell,
    forgotPasswordPage,
    mockApi,
    otpPage,
    resetPasswordPage,
  }) => {
    const mock = await mockApi(resetHandlers);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.submitEmail(EMAIL);
    await otpPage.expectLoaded();
    await otpPage.submit('123456');
    await resetPasswordPage.expectPath('/reset-password');
    await resetPasswordPage.submit(STRONG_PASSWORD);

    await appShell.expectPath('/dashboard');
    expect(mock.callsTo('SendResetPasswordInstructions')[0]?.variables).toMatchObject({
      email: EMAIL,
    });
    expect(mock.callsTo('ValidateOtp')[0]?.variables).toMatchObject({
      email: EMAIL,
      otpCode: '123456',
      purpose: 'password_reset',
    });
    expect(mock.callsTo('SetPassword')[0]?.variables).toMatchObject({
      password: STRONG_PASSWORD,
      passwordConfirmation: STRONG_PASSWORD,
      resetPasswordToken: RESET_TOKEN,
    });
  });

  test('a client with a signed document is signed in to the dashboard after resetting', async ({
    appShell,
    forgotPasswordPage,
    mockApi,
    otpPage,
    resetPasswordPage,
  }) => {
    test.fixme(true, LEGACY_ROLE_SETUP_REDIRECT);
    await mockApi({
      ...resetHandlers,
      SetPassword: () => ({ setPassword: { token: 'e2e-token', user: buildUser('client') } }),
      ValidateOtp: () => ({
        validateOtp: {
          resetPasswordToken: RESET_TOKEN,
          token: null,
          user: buildUser('client'),
        },
      }),
    });

    await forgotPasswordPage.goto();
    await forgotPasswordPage.submitEmail('e2e+client@example.test');
    await otpPage.expectLoaded();
    await otpPage.submit('123456');
    await resetPasswordPage.submit(STRONG_PASSWORD);

    await appShell.expectPath('/dashboard');
  });

  test('a password that misses the requirements is refused and not sent', async ({
    mockApi,
    resetPasswordPage,
  }) => {
    const mock = await mockApi(resetHandlers);
    await resetPasswordPage.open();

    await resetPasswordPage.expectRequirement('8+ characters');
    await resetPasswordPage.expectRequirement('At least one uppercase letter');
    await resetPasswordPage.submit('weak');

    await resetPasswordPage.expectError('Password must meet all the requirements listed below');
    expect(mock.callsTo('SetPassword')).toHaveLength(0);
  });

  test('a confirmation that does not match is refused', async ({ mockApi, resetPasswordPage }) => {
    const mock = await mockApi(resetHandlers);
    await resetPasswordPage.open();

    await resetPasswordPage.submit(STRONG_PASSWORD, 'Different#Pass2');

    await resetPasswordPage.expectError('Passwords do not match');
    expect(mock.callsTo('SetPassword')).toHaveLength(0);
  });

  test('without a verified code the user is sent back to log in', async ({
    loginPage,
    mockApi,
    resetPasswordPage,
  }) => {
    const mock = await mockApi(resetHandlers);
    await resetPasswordPage.open();

    await resetPasswordPage.submit(STRONG_PASSWORD);

    await resetPasswordPage.expectToast(
      'Your reset session has expired. Please request a new verification code.',
    );
    await loginPage.expectPath('/login');
    expect(mock.callsTo('SetPassword')).toHaveLength(0);
  });

  test('the success page links back to login', async ({ loginPage, resetPasswordPage }) => {
    await resetPasswordPage.openSuccess();
    await resetPasswordPage.expectSuccessShown();

    await resetPasswordPage.goToLogin();

    await loginPage.expectPath('/login');
  });
});
