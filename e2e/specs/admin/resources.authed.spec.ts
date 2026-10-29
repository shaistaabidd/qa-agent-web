import { test } from '../../fixtures';
import { COADMIN_STATE, hasAuthState } from '../../fixtures/users';
import { NO_MATCH_TERM } from '../../page-object/AdminListPage';

test.skip(!hasAuthState(COADMIN_STATE), 'No saved session. Run: E2E_OTP=<code> npm run e2e:auth');

test.use({ storageState: COADMIN_STATE });

test.describe('Resources (co-admin)', () => {
  test('opens on Client Resources with search and an add button', async ({ resourcesPage }) => {
    await resourcesPage.open();

    await resourcesPage.expectLoaded();
    await resourcesPage.expectTabSelected('Client Resources');
    await resourcesPage.expectAddVisible();
  });

  test('switches between the resource tabs', async ({ resourcesPage }) => {
    await resourcesPage.open();

    await resourcesPage.selectTab('Clinic Resources');
    await resourcesPage.selectTab('Archived');
    await resourcesPage.selectTab('Client Resources');
  });

  test('a search with no match shows the empty state and is kept in the URL', async ({
    resourcesPage,
  }) => {
    await resourcesPage.open();

    await resourcesPage.searchFor(NO_MATCH_TERM);

    await resourcesPage.expectSearchInUrl(NO_MATCH_TERM);
    await resourcesPage.expectEmpty();
  });
});
