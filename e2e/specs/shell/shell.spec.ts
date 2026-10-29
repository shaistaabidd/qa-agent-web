import { expect, test } from '../../fixtures';
import { buildUser } from '../../fixtures/mockUsers';

const handlers = {
  Logout: () => ({ logout: { message: 'Logged out', success: true } }),
};

test.describe('App shell (signed in)', () => {
  test('logging out asks first and cancelling keeps the session', async ({
    appShell,
    dashboardPage,
    session,
  }) => {
    const mock = await session.signInAs(buildUser('super_admin'), handlers);
    await dashboardPage.expectAdminView();

    await appShell.openLogoutDialog();
    await appShell.cancelLogout();

    await dashboardPage.expectAdminView();
    expect(mock.callsTo('Logout')).toHaveLength(0);
  });

  test('confirming logs out and the dashboard is blocked afterwards', async ({
    appShell,
    dashboardPage,
    loginPage,
    session,
  }) => {
    const mock = await session.signInAs(buildUser('super_admin'), handlers);
    await dashboardPage.expectAdminView();

    await appShell.openLogoutDialog();
    await appShell.confirmLogout();

    await loginPage.expectPath('/login');
    expect(mock.callsTo('Logout')).toHaveLength(1);

    await appShell.open('/dashboard');

    await loginPage.expectRedirectTo('/dashboard');
  });

  test('logging out still works when the server cannot revoke the session', async ({
    appShell,
    dashboardPage,
    loginPage,
    session,
  }) => {
    await session.signInAs(buildUser('super_admin'), {});
    await dashboardPage.expectAdminView();

    await appShell.openLogoutDialog();
    await appShell.confirmLogout();

    await loginPage.expectPath('/login');
  });

  test('an unknown address shows page not found with a way back to the dashboard', async ({
    appShell,
    session,
  }) => {
    await session.signInAs(buildUser('super_admin'), handlers);

    await appShell.open('/no-such-page');

    await appShell.expectNotFound();
    // Home sends a signed-in user on to their dashboard.
    await appShell.expectBackLink('Back to home', '/dashboard');
  });
});

test.describe('App shell (signed out)', () => {
  test('an unknown address sends a signed-out visitor to login', async ({
    appShell,
    loginPage,
  }) => {
    await appShell.open('/no-such-page');

    await loginPage.expectPath('/login');
  });
});
