import { expect, test } from '../../fixtures';
import { featureFlags } from '../../fixtures/featureFlags';
import { GraphqlFailure, type GraphqlMock } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

const ADA = buildUser('user', { fullName: 'Ada Lovelace', id: 'ada' });
// impersonation_enabled is off for this user (by role or individually), so the API refuses.
const GRACE = buildUser('user', {
  featureFlags: featureFlags({ impersonationEnabled: false }),
  fullName: 'Grace Hopper',
  id: 'grace',
});

const handlers = {
  AllUsers: () => ({
    allUsers: { allData: [ADA, GRACE], count: 2, nextPage: null, prevPage: null, totalPages: 1 },
  }),
  ImpersonateUser: () => ({
    impersonateUser: { token: 'impersonation-token', user: ADA },
  }),
};

test.describe('Impersonation (super admin)', () => {
  // Each test reloads the whole app up to three times (sign-in, impersonate, back to admin),
  // which outlasts the default 30 seconds when the dev server is busy with parallel workers.
  test.describe.configure({ timeout: 90_000 });

  let mock: GraphqlMock;

  test.beforeEach(async ({ coAdminsPage, session }) => {
    mock = await session.signInAs(buildUser('super_admin'), handlers);
    await coAdminsPage.open();
    await coAdminsPage.expectLoaded();
    await coAdminsPage.expectRowsSettled();
  });

  test('impersonating a user lands on their dashboard', async ({
    appShell,
    coAdminsPage,
    dashboardPage,
  }) => {
    await coAdminsPage.chooseRowAction('Ada Lovelace', 'Impersonate');

    await dashboardPage.expectPersonalView();
    await dashboardPage.expectNavLinks(['Dashboard'], ['Email Logs', 'Users']);
    await appShell.expectImpersonating('Ada Lovelace');
    expect(mock.callsTo('ImpersonateUser')[0]?.variables).toMatchObject({ userId: 'ada' });
  });

  test('Back to Admin restores the admin session', async ({
    appShell,
    coAdminsPage,
    dashboardPage,
  }) => {
    await coAdminsPage.chooseRowAction('Ada Lovelace', 'Impersonate');
    await appShell.expectImpersonating('Ada Lovelace');

    await appShell.backToAdmin();

    await dashboardPage.expectAdminView();
    await dashboardPage.expectNavLinks(['Email Logs', 'Users'], []);
    await appShell.expectNotImpersonating();
  });

  test('when the API refuses, the user is told and the action is withdrawn', async ({
    coAdminsPage,
    mockApi,
  }) => {
    await mockApi({
      ...handlers,
      AllUsers: () => ({
        allUsers: {
          allData: [{ ...ADA, featureFlags: featureFlags({ impersonationEnabled: false }) }],
          count: 1,
          nextPage: null,
          prevPage: null,
          totalPages: 1,
        },
      }),
      ImpersonateUser: () => new GraphqlFailure('You are not allowed to perform this action.'),
    });

    await coAdminsPage.chooseRowAction('Ada Lovelace', 'Impersonate');

    await coAdminsPage.expectToast('You are not allowed to perform this action.');
    await coAdminsPage.expectRowActions('Ada Lovelace', ['Edit', 'Archive'], ['Impersonate']);
  });

  test('a user impersonation is off for has no Impersonate action', async ({ coAdminsPage }) => {
    await coAdminsPage.expectRowActions('Ada Lovelace', ['Impersonate'], []);
    await coAdminsPage.expectRowActions('Grace Hopper', ['Edit', 'Archive'], ['Impersonate']);
    expect(mock.callsTo('ImpersonateUser')).toHaveLength(0);
  });
});
