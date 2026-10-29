import { expect, test } from '../../fixtures';
import type { GraphqlMock } from '../../fixtures/graphql';
import { LEGACY_ROLE_SETUP_REDIRECT } from '../../fixtures/legacyRoles';
import { buildUser } from '../../fixtures/mockUsers';

const CALENDAR_LINK = 'https://cal.example.test/ada';

test.describe('Add calendar', () => {
  test.fixme(true, LEGACY_ROLE_SETUP_REDIRECT);

  let mock: GraphqlMock;

  // A practitioner signs the document first, then reaches the calendar step.
  test.beforeEach(async ({ addCalendarPage, session, signDocumentPage }) => {
    mock = await session.signInAs(
      buildUser('practitioner', { calendarLink: null, documentSigned: false }),
      {
        UpdateUser: (variables) => ({
          updateUser: {
            user: buildUser('practitioner', {
              calendarLink:
                typeof variables.calendarLink === 'string' ? variables.calendarLink : null,
            }),
          },
        }),
      },
    );
    await signDocumentPage.expectLoaded();
    await signDocumentPage.signAndContinue();
    await addCalendarPage.expectLoaded();
  });

  test('skipping continues to the dashboard without saving a link', async ({
    addCalendarPage,
    appShell,
  }) => {
    await addCalendarPage.skipButton.click();

    await appShell.expectPath('/dashboard');
    // Only the document signing called UpdateUser.
    expect(mock.callsTo('UpdateUser')).toHaveLength(1);
  });

  test('a calendar link is saved and continues to the dashboard', async ({
    addCalendarPage,
    appShell,
  }) => {
    await addCalendarPage.continueWith(CALENDAR_LINK);

    await appShell.expectPath('/dashboard');
    const [, saveLink] = mock.callsTo('UpdateUser');
    expect(saveLink?.variables).toMatchObject({
      calendarLink: CALENDAR_LINK,
      id: 'e2e-practitioner',
    });
  });

  test('the link is optional: continuing without one still moves on', async ({
    addCalendarPage,
    appShell,
  }) => {
    await addCalendarPage.continueButton.click();

    await appShell.expectPath('/dashboard');
    const [, saveLink] = mock.callsTo('UpdateUser');
    expect(saveLink?.variables.calendarLink).toBeUndefined();
  });
});
