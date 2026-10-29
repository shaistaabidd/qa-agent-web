import { expect, test } from '../../fixtures';

test.describe('Forgot password', () => {
  test('is reachable from the login page', async ({ forgotPasswordPage, loginPage }) => {
    await loginPage.goto();

    await loginPage.forgotPasswordLink.click();

    await forgotPasswordPage.expectLoaded();
  });

  test('rejects an invalid email without sending a code', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.goto();

    await forgotPasswordPage.submitEmail('not-an-email');

    await forgotPasswordPage.expectInvalidEmail();
    await forgotPasswordPage.expectPath('/forgot-password');
  });

  test('requires an email', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.goto();

    await forgotPasswordPage.submitButton.click();

    await forgotPasswordPage.expectRequiredEmail();
  });

  test('goes back to login', async ({ forgotPasswordPage, loginPage }) => {
    await forgotPasswordPage.goto();

    await forgotPasswordPage.backToLoginLink.click();

    await loginPage.expectPath('/login');
    await expect(loginPage.submitButton).toBeVisible();
  });
});
