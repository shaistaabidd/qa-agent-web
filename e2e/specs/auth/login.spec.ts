import { expect, test } from '../../fixtures';
import { publicFeatureFlagsResponse } from '../../fixtures/featureFlags';
import { GraphqlFailure } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

test.describe('Login', () => {
  test('renders the email and password fields', async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('rejects an invalid email before submitting', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.login('not-an-email', 'irrelevant');

    await loginPage.expectInvalidEmail();
  });

  test('requires both fields before submitting', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.submitButton.click();

    await expect(loginPage.emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(loginPage.passwordInput).toHaveAttribute('aria-invalid', 'true');
    await loginPage.expectPath('/login');
  });

  test('valid credentials send a code and continue on the code screen', async ({
    loginPage,
    mockApi,
    otpPage,
  }) => {
    const mock = await mockApi({
      LoginUser: () => ({ loginUser: { message: 'OTP sent', token: null, user: null } }),
    });
    await loginPage.goto();

    await loginPage.login('ada@example.test', 'E2e-Password-1!');

    await otpPage.expectLoaded();
    expect(mock.callsTo('LoginUser')[0]?.variables).toMatchObject({
      email: 'ada@example.test',
      password: 'E2e-Password-1!',
    });
  });

  test('wrong credentials show the server message and stay on login', async ({
    loginPage,
    mockApi,
  }) => {
    await mockApi({ LoginUser: () => new GraphqlFailure('Invalid email or password.') });
    await loginPage.goto();

    await loginPage.login('ada@example.test', 'Wrong-Password-1!');

    await loginPage.expectToast('Invalid email or password.');
    await loginPage.expectPath('/login');
  });

  test('the sign up link opens the signup screen', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.signupLink.click();

    await loginPage.expectPath('/signup');
  });

  test('with sign-up off, there is no sign up link', async ({ loginPage, mockApi }) => {
    const mock = await mockApi({
      FetchPublicFeatureFlags: () => publicFeatureFlagsResponse({ signUpEnabled: false }),
    });
    await loginPage.goto();
    await expect.poll(() => mock.callsTo('FetchPublicFeatureFlags').length).toBeGreaterThan(0);

    await loginPage.expectNoSignupLink();
  });

  test('when the API signs the user in without a code, the code screen is skipped', async ({
    loginPage,
    mockApi,
  }) => {
    const user = buildUser('super_admin');
    const mock = await mockApi({
      LoginUser: () => ({ loginUser: { message: "You're signed in.", token: 'e2e-token', user } }),
    });
    await loginPage.goto();

    await loginPage.login(user.email, 'E2e-Password-1!');

    await loginPage.expectSignedInWithoutCode();
    expect(mock.callsTo('ValidateOtp')).toHaveLength(0);
  });
});
