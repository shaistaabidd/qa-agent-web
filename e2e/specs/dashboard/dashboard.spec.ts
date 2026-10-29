import { test } from '../../fixtures';
import { LEGACY_ROLE_SETUP_REDIRECT } from '../../fixtures/legacyRoles';
import { buildUser } from '../../fixtures/mockUsers';

const ADMIN_LINKS = ['Dashboard', 'Email Logs'];

test.describe('Dashboard and navigation by user type', () => {
  test('a team member sees the admin dashboard and the admin links, without Users', async ({
    dashboardPage,
    session,
  }) => {
    test.fixme(true, LEGACY_ROLE_SETUP_REDIRECT);
    await session.signInAs(buildUser('team_member'));

    await dashboardPage.expectAdminView();
    await dashboardPage.expectNavLinks(ADMIN_LINKS, ['Users']);
  });

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

  // A client has to sign the document before reaching the dashboard, so go through that step.
  test('a client sees the personal dashboard and no admin links', async ({
    dashboardPage,
    session,
    signDocumentPage,
  }) => {
    test.fixme(true, LEGACY_ROLE_SETUP_REDIRECT);
    await session.signInAs(buildUser('client', { documentSigned: false }), {
      UpdateUser: () => ({ updateUser: { user: buildUser('client') } }),
    });
    await signDocumentPage.expectLoaded();
    await signDocumentPage.signAndContinue();

    await dashboardPage.expectPersonalView();
    await dashboardPage.expectNavLinks(
      ['Dashboard'],
      ['Email Logs', 'SMS Logs', 'Resources', 'CRUD', 'Users'],
    );
  });
});
