import { test } from '../../fixtures';
import { buildUser } from '../../fixtures/mockUsers';

const ADMIN_LINKS = ['Projects', 'Email Logs'];

test.describe('Navigation by user type', () => {
  test('a super admin sees the admin navigation and the Users link as well', async ({
    homePage,
    session,
  }) => {
    await session.signInAs(buildUser('super_admin'));

    await homePage.expectLoaded();
    await homePage.expectNavLinks([...ADMIN_LINKS, 'Users'], []);
  });

  test('a user sees the personal navigation and only the Projects link', async ({
    homePage,
    session,
  }) => {
    await session.signInAs(buildUser('user'));

    await homePage.expectLoaded();
    await homePage.expectNavLinks(['Projects'], ['Email Logs', 'Users']);
  });
});
