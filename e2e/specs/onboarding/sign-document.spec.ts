import { expect, test } from '../../fixtures';
import { LEGACY_ROLE_SETUP_REDIRECT } from '../../fixtures/legacyRoles';
import { buildUser } from '../../fixtures/mockUsers';

const UNSIGNED_CLIENT = buildUser('client', { documentSigned: false });

test.describe('Sign document', () => {
  test.fixme(true, LEGACY_ROLE_SETUP_REDIRECT);

  test('confirming stays disabled until the agreement is ticked', async ({
    session,
    signDocumentPage,
  }) => {
    await session.signInAs(UNSIGNED_CLIENT);
    await signDocumentPage.expectLoaded();

    await expect(signDocumentPage.confirmButton).toBeDisabled();
    await signDocumentPage.agree();

    await expect(signDocumentPage.confirmButton).toBeEnabled();
  });

  test('signing saves the document and continues to the dashboard', async ({
    appShell,
    session,
    signDocumentPage,
  }) => {
    const mock = await session.signInAs(UNSIGNED_CLIENT, {
      UpdateUser: () => ({ updateUser: { user: buildUser('client') } }),
    });
    await signDocumentPage.expectLoaded();

    await signDocumentPage.signAndContinue();

    await appShell.expectPath('/dashboard');
    const [call] = mock.callsTo('UpdateUser');
    expect(call?.variables).toMatchObject({ documentSigned: true, id: 'e2e-client' });
  });
});
