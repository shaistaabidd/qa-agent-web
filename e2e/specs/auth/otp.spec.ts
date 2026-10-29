import { expect, test } from '../../fixtures';
import { publicFeatureFlagsResponse } from '../../fixtures/featureFlags';
import { GraphqlFailure, type GraphqlHandlers } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

const USER = buildUser('super_admin');

const handlers: GraphqlHandlers = {
  LoginUser: () => ({ loginUser: { message: 'OTP sent', token: null, user: null } }),
  ResendOtp: () => ({ resendOtp: { message: 'A new code is on its way' } }),
  ValidateOtp: () => ({
    validateOtp: { resetPasswordToken: null, token: 'e2e-token', user: USER },
  }),
};

test.describe('Verification code', () => {
  // Every case starts on the code screen, reached through the real login form. A case that
  // mocks again replaces these answers, and its mock records the calls it makes from then on.
  test.beforeEach(async ({ loginPage, mockApi, otpPage }) => {
    await mockApi(handlers);
    await loginPage.goto();
    await loginPage.login(USER.email, 'E2e-Password-1!');
    await otpPage.expectLoaded();
  });

  test('shows where the code was sent', async ({ otpPage }) => {
    await otpPage.expectSentTo(USER.email);
  });

  test('a code that is too short is refused and not sent', async ({ mockApi, otpPage }) => {
    const mock = await mockApi(handlers);

    await otpPage.submitIncomplete('123');

    await otpPage.expectCodeRequired();
    expect(mock.callsTo('ValidateOtp')).toHaveLength(0);
  });

  test('a wrong code is refused and the user stays on the code screen', async ({
    mockApi,
    otpPage,
  }) => {
    await mockApi({
      ...handlers,
      ValidateOtp: () => new GraphqlFailure('Invalid verification code.'),
    });

    await otpPage.submit('000000');

    await otpPage.expectToast('Invalid verification code.');
    await otpPage.expectLoaded();
  });

  test('a right code signs the user in with the login purpose', async ({
    appShell,
    mockApi,
    otpPage,
  }) => {
    const mock = await mockApi(handlers);

    await otpPage.submit('123456');

    await appShell.expectPath('/projects');
    expect(mock.callsTo('ValidateOtp')[0]?.variables).toMatchObject({
      email: USER.email,
      otpCode: '123456',
      purpose: 'login',
    });
  });

  test('a new code cannot be requested until the cooldown ends', async ({ mockApi, otpPage }) => {
    const mock = await mockApi(handlers);

    await otpPage.expectResendWaiting();

    expect(mock.callsTo('ResendOtp')).toHaveLength(0);
  });

  test('after the cooldown a new code can be requested', async ({ mockApi, otpPage }) => {
    const mock = await mockApi(handlers);
    await otpPage.finishResendCooldown();

    await otpPage.resendButton.click();

    await otpPage.expectToast('A new code is on its way');
    await otpPage.expectResendWaiting();
    expect(mock.callsTo('ResendOtp')[0]?.variables).toMatchObject({
      email: USER.email,
      purpose: 'login',
    });
  });

  test('back to login returns to the login screen', async ({ loginPage, otpPage }) => {
    await otpPage.backLink.click();

    await loginPage.expectPath('/login');
  });
});

test.describe('Verification code switched off while open', () => {
  const flagsOff = {
    FetchPublicFeatureFlags: () => publicFeatureFlagsResponse({ otpEnabled: false }),
  };

  test('a refused code sends the user back to login', async ({ loginPage, mockApi, otpPage }) => {
    await mockApi(handlers);
    await loginPage.goto();
    await loginPage.login(USER.email, 'E2e-Password-1!');
    await otpPage.expectLoaded();
    await mockApi({
      ...handlers,
      ...flagsOff,
      ValidateOtp: () => new GraphqlFailure('Code step is off.'),
    });

    await otpPage.submit('000000');

    await loginPage.expectLoaded();
    await loginPage.expectToast('Verification codes are no longer required. Please log in again.');
  });

  test('a refresh on the code screen sends the user back to login', async ({
    loginPage,
    mockApi,
    otpPage,
  }) => {
    await mockApi(handlers);
    await loginPage.goto();
    await loginPage.login(USER.email, 'E2e-Password-1!');
    await otpPage.expectLoaded();
    await mockApi({ ...handlers, ...flagsOff });

    await otpPage.reload();

    await loginPage.expectLoaded();
  });

  test('a flag that was never on at login does not take the user off the code screen', async ({
    loginPage,
    mockApi,
    otpPage,
  }) => {
    // The public flag is read for the sign-up role, so for a user who still needs a code it can be off.
    await mockApi({ ...handlers, ...flagsOff });
    await loginPage.goto();
    await loginPage.login(USER.email, 'E2e-Password-1!');

    await otpPage.expectLoaded();
    await otpPage.reload();

    await otpPage.expectLoaded();
  });
});
