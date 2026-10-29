import { test } from '../../fixtures';
import { COADMIN_STATE, hasAuthState } from '../../fixtures/users';
import { NO_MATCH_TERM } from '../../page-object/AdminListPage';

test.skip(!hasAuthState(COADMIN_STATE), 'No saved session. Run: E2E_OTP=<code> npm run e2e:auth');

test.use({ storageState: COADMIN_STATE });

test.describe('SMS logs (co-admin)', () => {
  test('loads with search and filters', async ({ smsLogsPage }) => {
    await smsLogsPage.open();

    await smsLogsPage.expectLoaded();
    await smsLogsPage.expectResetDisabled();
  });

  test('a search with no match shows the empty state and is kept in the URL', async ({
    smsLogsPage,
  }) => {
    await smsLogsPage.open();

    await smsLogsPage.searchFor(NO_MATCH_TERM);

    await smsLogsPage.expectSearchInUrl(NO_MATCH_TERM);
    await smsLogsPage.expectEmpty();
  });

  test('the filter drawer opens and closes', async ({ smsLogsPage }) => {
    await smsLogsPage.open();

    await smsLogsPage.openFilters();
    await smsLogsPage.closeFilters();
  });
});
