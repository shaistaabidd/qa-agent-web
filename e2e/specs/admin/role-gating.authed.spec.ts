import { expect, test } from '../../fixtures';
import { COADMIN_STATE, hasAuthState } from '../../fixtures/users';

test.skip(!hasAuthState(COADMIN_STATE), 'No saved session. Run: E2E_OTP=<code> npm run e2e:auth');

test.use({ storageState: COADMIN_STATE });

const ADMIN_PAGES = [
  { label: 'Email Logs', path: '/email-logs' },
  { label: 'SMS Logs', path: '/sms-logs' },
  { label: 'Resources', path: '/resources' },
  { label: 'CRUD', path: '/crud' },
];

test.describe('Admin shell (signed in as co-admin)', () => {
  test('lands on the dashboard with the admin navigation', async ({ appShell }) => {
    await appShell.open('/dashboard');

    await appShell.expectOnPage('/dashboard');
    await expect(appShell.navLink('Dashboard')).toBeVisible();
  });

  for (const { label, path } of ADMIN_PAGES) {
    test(`can open ${label}`, async ({ appShell }) => {
      await appShell.open(path);

      await appShell.expectOnPage(path);
      await expect(appShell.navLink(label)).toBeVisible();
    });
  }

  test('the Users page is reachable only when the nav shows it', async ({ appShell }) => {
    await appShell.open('/dashboard');
    const hasNavLink = await appShell.navLink('Users').isVisible();

    await appShell.open('/co-admin');

    if (hasNavLink) {
      await appShell.expectOnPage('/co-admin');
    } else {
      await appShell.expectNotFound();
    }
  });

  test('does not show login to a signed-in user', async ({ appShell }) => {
    await appShell.open('/login');

    await appShell.expectPath('/dashboard');
  });

  test('logs out and blocks the dashboard afterwards', async ({ appShell, loginPage }) => {
    await appShell.open('/dashboard');

    await appShell.logout();
    await appShell.open('/dashboard');

    await loginPage.expectRedirectTo('/dashboard');
  });
});
