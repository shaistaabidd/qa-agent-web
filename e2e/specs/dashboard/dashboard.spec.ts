import { test } from '../../fixtures';
import { buildUser } from '../../fixtures/mockUsers';

const ADMIN_LINKS = ['Dashboard', 'Email Logs'];

test.describe('Dashboard and navigation by user type', () => {
  test('a super admin sees the admin dashboard and the Users link as well', async ({
    dashboardPage,
    session,
  }) => {
    await session.signInAs(buildUser('super_admin'));

    await dashboardPage.expectAdminView();
    await dashboardPage.expectNavLinks([...ADMIN_LINKS, 'Users'], []);
  });

  test('a user sees the personal dashboard and only the Dashboard link', async ({
    dashboardPage,
    session,
  }) => {
    await session.signInAs(buildUser('user'));

    await dashboardPage.expectPersonalView();
    await dashboardPage.expectNavLinks(['Dashboard'], ['Email Logs', 'Users']);
  });
});
