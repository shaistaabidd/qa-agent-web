import { test } from '../../fixtures';

test.describe('Invitation screens', () => {
  test('an expired invite offers a way back to login', async ({ invitePage, loginPage }) => {
    await invitePage.openInviteExpired();

    await invitePage.backToLoginLink.click();

    await loginPage.expectPath('/login');
  });
});
