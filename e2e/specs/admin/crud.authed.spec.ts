import { test } from '../../fixtures';
import { COADMIN_STATE, hasAuthState } from '../../fixtures/users';

test.skip(!hasAuthState(COADMIN_STATE), 'No saved session. Run: E2E_OTP=<code> npm run e2e:auth');

test.use({ storageState: COADMIN_STATE });

// /crud is an in-memory demo: six seeded posts, five per page, reset on every page load.
const FIRST_PAGE = [
  'Clinic onboarding',
  'License review',
  'Payment retry',
  'Invite staff',
  'Email logs',
];

test.describe('CRUD demo (co-admin)', () => {
  test.beforeEach(async ({ crudDemoPage }) => {
    await crudDemoPage.open();
    await crudDemoPage.expectLoaded();
  });

  test('shows the first page of seeded posts with a summary', async ({ crudDemoPage }) => {
    await crudDemoPage.expectTitles(FIRST_PAGE);
    await crudDemoPage.expectSummary('Showing 1 – 5 of 6 posts');
  });

  test('pages through the list', async ({ crudDemoPage }) => {
    await crudDemoPage.goToNextPage();

    await crudDemoPage.expectTitles(['Old checklist']);
    await crudDemoPage.expectSummary('Showing 6 – 6 of 6 posts');
  });

  test('previous and next are disabled at the ends of the list', async ({ crudDemoPage }) => {
    await crudDemoPage.expectPageButtons({ next: true, previous: false });

    await crudDemoPage.goToNextPage();

    await crudDemoPage.expectPageButtons({ next: false, previous: true });
  });

  test('a larger page size shows every post on one page', async ({ crudDemoPage }) => {
    await crudDemoPage.choosePageSize(10);

    await crudDemoPage.expectTitles([...FIRST_PAGE, 'Old checklist']);
    await crudDemoPage.expectSummary('Showing 1 – 6 of 6 posts');
    await crudDemoPage.expectPageButtons({ next: false, previous: false });
  });

  test('tabs filter by status', async ({ crudDemoPage }) => {
    await crudDemoPage.selectTab('Archived');
    await crudDemoPage.expectTitles(['Payment retry', 'Old checklist']);

    await crudDemoPage.selectTab('Active');
    await crudDemoPage.expectTitles([
      'Clinic onboarding',
      'License review',
      'Invite staff',
      'Email logs',
    ]);

    await crudDemoPage.selectTab('All');
    await crudDemoPage.expectTitles(FIRST_PAGE);
  });

  test('search matches title and body', async ({ crudDemoPage }) => {
    await crudDemoPage.searchFor('subscription');

    await crudDemoPage.expectTitles(['Payment retry']);
  });

  test('a search with no match shows the no-results state', async ({ crudDemoPage }) => {
    await crudDemoPage.searchFor('zzzz-e2e-no-match');

    await crudDemoPage.expectNoResults();
  });

  test('the featured filter keeps only even ids', async ({ crudDemoPage }) => {
    await crudDemoPage.toggleFeatured();

    await crudDemoPage.expectFeaturedOn(true);
    await crudDemoPage.expectTitles(['License review', 'Invite staff', 'Old checklist']);
  });

  test('sorting by title toggles ascending then descending', async ({ crudDemoPage }) => {
    await crudDemoPage.sortByTitle();
    await crudDemoPage.expectTitleSort('ascending');
    await crudDemoPage.expectTitles([
      'Clinic onboarding',
      'Email logs',
      'Invite staff',
      'License review',
      'Old checklist',
    ]);

    await crudDemoPage.sortByTitle();
    await crudDemoPage.expectTitleSort('descending');
    await crudDemoPage.expectTitles([
      'Payment retry',
      'Old checklist',
      'License review',
      'Invite staff',
      'Email logs',
    ]);
  });

  test('adding a post puts it at the top', async ({ crudDemoPage }) => {
    await crudDemoPage.addPost('E2E post', 'Created by the E2E suite.');

    await crudDemoPage.expectRowPresent('E2E post');
    await crudDemoPage.expectSummary('Showing 1 – 5 of 7 posts');
  });

  test('the add form requires a title and a body', async ({ crudDemoPage }) => {
    await crudDemoPage.addButton.click();
    await crudDemoPage.submitDialog('Create post');

    await crudDemoPage.expectFieldError('Title is required');
    await crudDemoPage.expectFieldError('Body is required');
  });

  test('editing a post updates its title', async ({ crudDemoPage }) => {
    await crudDemoPage.chooseRowAction('Clinic onboarding', 'Edit');
    await crudDemoPage.fillPostForm({ title: 'Clinic onboarding v2' });
    await crudDemoPage.submitDialog('Save changes');
    await crudDemoPage.expectDialogClosed();

    await crudDemoPage.expectRowPresent('Clinic onboarding v2');
  });

  test('deleting a post removes it', async ({ crudDemoPage }) => {
    await crudDemoPage.chooseRowAction('Email logs', 'Delete');
    await crudDemoPage.confirmDelete('Email logs');

    await crudDemoPage.expectRowAbsent('Email logs');
    await crudDemoPage.expectSummary('Showing 1 – 5 of 5 posts');
  });

  test('cancelling a delete keeps the post', async ({ crudDemoPage }) => {
    await crudDemoPage.chooseRowAction('Email logs', 'Delete');
    await crudDemoPage.cancelDialog();

    await crudDemoPage.expectRowPresent('Email logs');
  });
});
