import { test } from '../../fixtures';

const PROTECTED_PATHS = ['/dashboard', '/settings', '/email-logs', '/crud'];

test.describe('Route protection (signed out)', () => {
  for (const path of PROTECTED_PATHS) {
    test(`${path} sends a signed-out visitor to login and remembers the destination`, async ({
      appShell,
      loginPage,
    }) => {
      await appShell.open(path);

      await loginPage.expectRedirectTo(path);
    });
  }

  test('the OTP page without a started login goes back to login', async ({
    appShell,
    loginPage,
  }) => {
    await appShell.open('/otp');

    await loginPage.expectPath('/login');
  });
});
