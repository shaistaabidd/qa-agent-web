import { expect, test } from '../../fixtures';
import { buildUser } from '../../fixtures/mockUsers';

const STRONG_PASSWORD = 'Strong#Pass1';
const INVITE_TOKEN = 'invite-123';

function inviteHandlers(valid: boolean) {
  return {
    AcceptInvitation: () => ({
      acceptInvitation: { token: 'e2e-token', user: buildUser('super_admin') },
    }),
    ValidateInvitationToken: () => ({ validateInvitationToken: { error: null, valid } }),
  };
}

test.describe('Set up your account (invite)', () => {
  test('a link without a token goes to the expired invite page', async ({
    invitePage,
    mockApi,
    setupAccountPage,
  }) => {
    await mockApi(inviteHandlers(true));

    await setupAccountPage.openWithoutToken();

    await invitePage.expectPath('/invite-expired');
  });

  test('a token the server rejects goes to the expired invite page', async ({
    invitePage,
    mockApi,
    setupAccountPage,
  }) => {
    await mockApi(inviteHandlers(false));

    await setupAccountPage.openInvite(INVITE_TOKEN);

    await invitePage.expectPath('/invite-expired');
  });

  test('a valid invite shows the password form', async ({ mockApi, setupAccountPage }) => {
    const mock = await mockApi(inviteHandlers(true));

    await setupAccountPage.openInvite(INVITE_TOKEN);

    await setupAccountPage.expectLoaded();
    expect(mock.callsTo('ValidateInvitationToken')[0]?.variables).toMatchObject({
      token: INVITE_TOKEN,
    });
  });

  test('the same screen opens from the set-password link', async ({
    mockApi,
    setupAccountPage,
  }) => {
    await mockApi(inviteHandlers(true));

    await setupAccountPage.openInvite(INVITE_TOKEN, '/set-password');

    await setupAccountPage.expectLoaded();
  });

  test('a weak password is refused and not sent', async ({ mockApi, setupAccountPage }) => {
    const mock = await mockApi(inviteHandlers(true));
    await setupAccountPage.openInvite(INVITE_TOKEN);
    await setupAccountPage.expectLoaded();

    await setupAccountPage.submit('weak');

    await setupAccountPage.expectError('Password must meet all the requirements listed below');
    expect(mock.callsTo('AcceptInvitation')).toHaveLength(0);
  });

  test('creating the account signs the user in and goes to the projects page', async ({
    appShell,
    mockApi,
    setupAccountPage,
  }) => {
    const mock = await mockApi(inviteHandlers(true));
    await setupAccountPage.openInvite(INVITE_TOKEN);
    await setupAccountPage.expectLoaded();

    await setupAccountPage.submit(STRONG_PASSWORD);

    await appShell.expectPath('/projects');
    expect(mock.callsTo('AcceptInvitation')[0]?.variables).toMatchObject({
      password: STRONG_PASSWORD,
      passwordConfirmation: STRONG_PASSWORD,
      token: INVITE_TOKEN,
    });
  });
});
