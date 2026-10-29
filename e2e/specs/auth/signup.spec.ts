import { expect, test } from '../../fixtures';
import { publicFeatureFlagsResponse } from '../../fixtures/featureFlags';
import { GraphqlFailure } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

const NEW_USER = {
  email: 'grace@example.test',
  firstName: 'Grace',
  lastName: 'Hopper',
  password: 'Strong#Pass1',
};

const handlers = {
  RegisterUser: () => ({
    registerUser: { message: 'Verification code sent', token: null, user: null },
  }),
  ValidateOtp: () => ({
    validateOtp: {
      resetPasswordToken: null,
      token: 'e2e-token',
      user: buildUser('user', { email: NEW_USER.email }),
    },
  }),
};

test.describe('Signup', () => {
  test('shows every field and links back to login', async ({ loginPage, signupPage }) => {
    await signupPage.open();

    await expect(signupPage.firstName).toBeVisible();
    await expect(signupPage.lastName).toBeVisible();
    await expect(signupPage.email).toBeVisible();
    await expect(signupPage.password).toBeVisible();
    await expect(signupPage.confirmPassword).toBeVisible();

    await signupPage.loginLink.click();

    await loginPage.expectPath('/login');
  });

  test('submitting an empty form shows the errors and sends nothing', async ({
    mockApi,
    signupPage,
  }) => {
    const mock = await mockApi(handlers);
    await signupPage.open();

    await signupPage.submitButton.click();

    await signupPage.expectError('This field is required', 2);
    await expect(signupPage.email).toHaveAttribute('aria-invalid', 'true');
    await expect(signupPage.password).toHaveAttribute('aria-invalid', 'true');
    expect(mock.callsTo('RegisterUser')).toHaveLength(0);
  });

  test('an invalid email is refused', async ({ mockApi, signupPage }) => {
    const mock = await mockApi(handlers);
    await signupPage.open();

    await signupPage.submit({ ...NEW_USER, email: 'not-an-email' });

    await signupPage.expectError('Please enter a valid email address');
    expect(mock.callsTo('RegisterUser')).toHaveLength(0);
  });

  test('a password that misses the requirements is refused and not sent', async ({
    mockApi,
    signupPage,
  }) => {
    const mock = await mockApi(handlers);
    await signupPage.open();

    await signupPage.expectRequirement('8+ characters');
    await signupPage.expectRequirement('At least one uppercase letter');
    await signupPage.submit({ ...NEW_USER, password: 'weak' });

    await signupPage.expectError('Password must meet all the requirements listed below');
    expect(mock.callsTo('RegisterUser')).toHaveLength(0);
  });

  test('a confirmation that does not match is refused', async ({ mockApi, signupPage }) => {
    const mock = await mockApi(handlers);
    await signupPage.open();

    await signupPage.submit({ ...NEW_USER, confirmPassword: 'Different#Pass2' });

    await signupPage.expectError('Passwords do not match');
    expect(mock.callsTo('RegisterUser')).toHaveLength(0);
  });

  test('a valid signup sends the details and continues on the code screen', async ({
    mockApi,
    otpPage,
    signupPage,
  }) => {
    const mock = await mockApi(handlers);
    await signupPage.open();

    await signupPage.submit(NEW_USER);

    await otpPage.expectLoaded();
    await otpPage.expectSentTo(NEW_USER.email);
    expect(mock.callsTo('RegisterUser')[0]?.variables).toMatchObject({
      email: NEW_USER.email,
      firstName: NEW_USER.firstName,
      lastName: NEW_USER.lastName,
      password: NEW_USER.password,
      passwordConfirmation: NEW_USER.password,
    });
  });

  test('after the code, the new user is signed in to the dashboard', async ({
    appShell,
    mockApi,
    otpPage,
    signupPage,
  }) => {
    const mock = await mockApi(handlers);
    await signupPage.open();
    await signupPage.submit(NEW_USER);
    await otpPage.expectLoaded();

    await otpPage.submit('123456');

    await appShell.expectPath('/dashboard');
    expect(mock.callsTo('ValidateOtp')[0]?.variables).toMatchObject({
      email: NEW_USER.email,
      otpCode: '123456',
      purpose: 'login',
    });
  });

  test('when the server refuses, the user is told and stays on signup', async ({
    mockApi,
    signupPage,
  }) => {
    await mockApi({
      ...handlers,
      RegisterUser: () => new GraphqlFailure('Email has already been taken'),
    });
    await signupPage.open();

    await signupPage.submit(NEW_USER);

    await signupPage.expectToast('Email has already been taken');
    await signupPage.expectLoaded();
  });

  test('when sign-up is switched off while the form is open, a refused submit shows it closed', async ({
    mockApi,
    signupPage,
  }) => {
    await mockApi(handlers);
    await signupPage.open();
    await mockApi({
      FetchPublicFeatureFlags: () => publicFeatureFlagsResponse({ signUpEnabled: false }),
      RegisterUser: () => new GraphqlFailure('Sign-up is not available.'),
    });

    await signupPage.submit(NEW_USER);

    await signupPage.expectToast('Sign-up is not available.');
    await signupPage.expectClosed();
  });

  test('when the flags cannot be read, the form stays hidden until a retry succeeds', async ({
    mockApi,
    signupPage,
  }) => {
    let requests = 0;
    await mockApi({
      FetchPublicFeatureFlags: () =>
        ++requests === 1 ? new GraphqlFailure('Service unavailable') : publicFeatureFlagsResponse(),
    });
    await signupPage.goto('/signup');

    await signupPage.expectUnavailable();
    await signupPage.tryAgainButton.click();

    await signupPage.expectLoaded();
  });

  test('with sign-up off, the page says it is closed and links back to login', async ({
    loginPage,
    mockApi,
    signupPage,
  }) => {
    await mockApi({
      FetchPublicFeatureFlags: () => publicFeatureFlagsResponse({ signUpEnabled: false }),
    });
    await signupPage.goto('/signup');

    await signupPage.expectClosed();
    await signupPage.backToLoginLink.click();

    await loginPage.expectPath('/login');
  });
});
