import { test } from '../../fixtures';
import { COADMIN_STATE, hasAuthState } from '../../fixtures/users';
import { NO_MATCH_TERM } from '../../page-object/AdminListPage';

test.skip(!hasAuthState(COADMIN_STATE), 'No saved session. Run: E2E_OTP=<code> npm run e2e:auth');

test.use({ storageState: COADMIN_STATE });

test.describe('Email logs (co-admin)', () => {
  test('loads with search and filters', async ({ emailLogsPage }) => {
    await emailLogsPage.open();

    await emailLogsPage.expectLoaded();
    await emailLogsPage.expectResetDisabled();
  });

  test('a search with no match shows the empty state and is kept in the URL', async ({
    emailLogsPage,
  }) => {
    await emailLogsPage.open();

    await emailLogsPage.searchFor(NO_MATCH_TERM);

    await emailLogsPage.expectSearchInUrl(NO_MATCH_TERM);
    await emailLogsPage.expectEmpty();
  });

  test('clearing the search brings the list back', async ({ emailLogsPage }) => {
    await emailLogsPage.open();
    await emailLogsPage.searchFor(NO_MATCH_TERM);
    await emailLogsPage.expectEmpty();

    await emailLogsPage.clearSearch();

    await emailLogsPage.expectSearchInUrl('');
  });

  test('the filter drawer opens and closes', async ({ emailLogsPage }) => {
    await emailLogsPage.open();

    await emailLogsPage.openFilters();
    await emailLogsPage.closeFilters();
  });

  test('opens a log from the list and returns to it', async ({ emailLogsPage }) => {
    await emailLogsPage.open();
    test.skip(!(await emailLogsPage.hasRows()), 'No email logs on this environment.');

    await emailLogsPage.openFirstLog();
    await emailLogsPage.goBackToList();
  });
});
