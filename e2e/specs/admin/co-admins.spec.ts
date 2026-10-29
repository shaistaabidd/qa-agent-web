import { expect, test } from '../../fixtures';
import { featureFlagsResponse } from '../../fixtures/featureFlags';
import { GraphqlFailure, type GraphqlMock } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

const person = (id: string, name: string, extra: Record<string, unknown> = {}) =>
  buildUser('user', {
    email: `${id}@example.test`,
    firstName: name.split(' ')[0],
    fullName: name,
    id,
    lastName: name.split(' ')[1],
    ...extra,
  });

const ADA = person('ada', 'Ada Lovelace');
const GRACE = person('grace', 'Grace Hopper', { revokeAccess: true });
const LINUS = person('linus', 'Linus Torvalds', { invitationSentAt: '2026-10-01T09:00:00Z' });
const ALAN = person('alan', 'Alan Turing');

const BY_TAB = { active: [ADA, GRACE], archived: [ALAN], pending: [LINUS] };

const handlers = {
  AllUsers: (variables: Record<string, unknown>) => {
    const tab = variables.pending ? 'pending' : variables.archived ? 'archived' : 'active';
    const term = String(variables.search ?? '').toLowerCase();
    const rows = BY_TAB[tab].filter(
      (row) => !term || `${row.fullName} ${row.email}`.toLowerCase().includes(term),
    );

    return {
      allUsers: {
        allData: rows,
        count: rows.length,
        nextPage: null,
        prevPage: null,
        totalPages: 1,
      },
    };
  },
  ArchiveUser: () => ({ archiveUser: { user: { id: 'ada' } } }),
  CreateInvitation: () => ({ createInvitation: { message: 'Sent', rejected: [], users: [] } }),
  DeleteInvitation: () => ({ deleteInvitation: { message: 'Deleted' } }),
  ResendInvitation: () => ({ resendInvitation: { user: LINUS } }),
  UpdateCoAdmin: () => ({ updateUser: { user: ADA } }),
  RevokeUserAccess: () => ({ updateUserAccess: { user: GRACE } }),
};

test.describe('Users page (super admin)', () => {
  let mock: GraphqlMock;

  test.beforeEach(async ({ coAdminsPage, session }) => {
    mock = await session.signInAs(buildUser('super_admin'), handlers);
    await coAdminsPage.open();
    await coAdminsPage.expectLoaded();
    await coAdminsPage.expectRowsSettled();
  });

  test('lists the active users by default and asks only for regular users', async ({
    coAdminsPage,
  }) => {
    await coAdminsPage.expectTabs();
    await coAdminsPage.expectPeople(['Ada Lovelace', 'Grace Hopper']);

    expect(mock.callsTo('AllUsers')[0]?.variables).toMatchObject({
      archived: false,
      pending: false,
      userType: 'user',
    });
  });

  test('the Pending Invites tab lists invited people', async ({ coAdminsPage }) => {
    await coAdminsPage.selectTab('Pending Invites');

    await coAdminsPage.expectPeople(['Linus Torvalds']);
    expect(mock.callsTo('AllUsers').at(-1)?.variables).toMatchObject({ pending: true });
  });

  test('the Archived tab lists archived people', async ({ coAdminsPage }) => {
    await coAdminsPage.selectTab('Archived');

    await coAdminsPage.expectPeople(['Alan Turing']);
    expect(mock.callsTo('AllUsers').at(-1)?.variables).toMatchObject({ archived: true });
  });

  test('searching narrows the list and is sent to the server', async ({ coAdminsPage }) => {
    await coAdminsPage.searchFor('grace');

    await coAdminsPage.expectPeople(['Grace Hopper']);
    expect(mock.callsTo('AllUsers').at(-1)?.variables).toMatchObject({ search: 'grace' });
  });

  test('the access switch reflects revoked access and can restore it', async ({ coAdminsPage }) => {
    await expect(coAdminsPage.accessSwitch('Ada Lovelace')).toBeChecked();
    await expect(coAdminsPage.accessSwitch('Grace Hopper')).not.toBeChecked();

    await coAdminsPage.toggleAccess('Grace Hopper');

    await coAdminsPage.expectToast('User access updated');
    expect(mock.callsTo('RevokeUserAccess')[0]?.variables).toMatchObject({
      id: 'grace',
      revokeAccess: false,
    });
  });

  test('archiving asks for confirmation first', async ({ coAdminsPage }) => {
    await coAdminsPage.chooseRowAction('Ada Lovelace', 'Archive');
    await coAdminsPage.cancelConfirm('Archive this user?');

    expect(mock.callsTo('ArchiveUser')).toHaveLength(0);

    await coAdminsPage.chooseRowAction('Ada Lovelace', 'Archive');
    await coAdminsPage.confirm('Archive this user?', 'Archive');

    expect(mock.callsTo('ArchiveUser')[0]?.variables).toMatchObject({
      archived: true,
      id: 'ada',
    });
  });

  test('a pending invite can be resent', async ({ coAdminsPage }) => {
    await coAdminsPage.selectTab('Pending Invites');

    await coAdminsPage.chooseRowAction('Linus Torvalds', 'Resend invite');

    await expect.poll(() => mock.callsTo('ResendInvitation').length).toBe(1);
    expect(mock.callsTo('ResendInvitation')[0]?.variables).toMatchObject({ id: 'linus' });
  });

  test('resending an invite updates the row without reloading the list', async ({
    coAdminsPage,
  }) => {
    await coAdminsPage.selectTab('Pending Invites');
    const listCalls = mock.callsTo('AllUsers').length;

    await coAdminsPage.chooseRowAction('Linus Torvalds', 'Resend invite');

    await expect.poll(() => mock.callsTo('ResendInvitation').length).toBe(1);
    await coAdminsPage.expectPeople(['Linus Torvalds']);
    expect(mock.callsTo('AllUsers')).toHaveLength(listCalls);
  });

  test('a pending invite can be deleted after confirming', async ({ coAdminsPage }) => {
    await coAdminsPage.selectTab('Pending Invites');

    await coAdminsPage.chooseRowAction('Linus Torvalds', 'Delete invite');
    await coAdminsPage.confirm('Delete this invitation?', 'Delete');

    expect(mock.callsTo('DeleteInvitation')[0]?.variables).toMatchObject({ id: 'linus' });
  });

  test('the invite form checks the emails before sending', async ({ coAdminsPage }) => {
    await coAdminsPage.openInvite();

    await coAdminsPage.sendInvite('   ');
    await coAdminsPage.expectInviteError('Please enter at least one email address');

    await coAdminsPage.sendInvite('not-an-email');
    await coAdminsPage.expectInviteError('not-an-email is not a valid email address');

    await coAdminsPage.sendInvite('a@example.test, A@example.test');
    await coAdminsPage.expectInviteError('a@example.test is entered more than once');

    expect(mock.callsTo('CreateInvitation')).toHaveLength(0);
  });

  test('inviting several people invites them as regular users', async ({ coAdminsPage }) => {
    await coAdminsPage.openInvite();

    await coAdminsPage.sendInvite('new1@example.test, new2@example.test');

    await coAdminsPage.expectToast('Sent');
    expect(mock.callsTo('CreateInvitation')[0]?.variables).toMatchObject({
      emails: ['new1@example.test', 'new2@example.test'],
      userType: 'user',
    });
  });

  test('inviting from the Active tab opens Pending Invites and loads only that list', async ({
    coAdminsPage,
  }) => {
    await coAdminsPage.openInvite();

    await coAdminsPage.sendInvite('new1@example.test');

    await coAdminsPage.expectToast('Sent');
    await coAdminsPage.expectTabSelected('Pending Invites');
    await coAdminsPage.expectPeople(['Linus Torvalds']);
    expect(mock.callsTo('AllUsers').at(-1)?.variables).toMatchObject({ pending: true });
  });

  test('invite emails are sent in lowercase', async ({ coAdminsPage }) => {
    await coAdminsPage.openInvite();

    await coAdminsPage.sendInvite('QA@Example.test');

    await expect.poll(() => mock.callsTo('CreateInvitation').length).toBe(1);
    expect(mock.callsTo('CreateInvitation')[0]?.variables).toMatchObject({
      emails: ['qa@example.test'],
    });
  });

  test('an invite is limited to 20 emails', async ({ coAdminsPage }) => {
    const emails = (count: number) =>
      Array.from({ length: count }, (_, index) => `p${index}@example.test`).join(', ');
    await coAdminsPage.openInvite();

    await coAdminsPage.sendInvite(emails(21));
    await coAdminsPage.expectInviteError('You can invite up to 20 people at a time');
    expect(mock.callsTo('CreateInvitation')).toHaveLength(0);

    await coAdminsPage.sendInvite(emails(20));
    await expect.poll(() => mock.callsTo('CreateInvitation').length).toBe(1);
  });

  test('Edit opens the profile with the email shown but locked', async ({ coAdminsPage }) => {
    await coAdminsPage.openEdit('Ada Lovelace');

    await coAdminsPage.expectEditFormValues({
      email: 'ada@example.test',
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
  });

  test('Edit asks for both names and sends nothing until they are filled', async ({
    coAdminsPage,
  }) => {
    await coAdminsPage.openEdit('Ada Lovelace');

    await coAdminsPage.saveEdit('', '');

    await coAdminsPage.expectInviteError('Please enter a first name');
    await coAdminsPage.expectInviteError('Please enter a last name');
    expect(mock.callsTo('UpdateCoAdmin')).toHaveLength(0);
  });

  test('saving the profile sends the new names and closes the drawer', async ({ coAdminsPage }) => {
    await coAdminsPage.openEdit('Ada Lovelace');

    await coAdminsPage.saveEdit('Augusta', 'King');

    await coAdminsPage.expectToast('User updated successfully');
    await expect(coAdminsPage.drawer).toBeHidden();
    const [call] = mock.callsTo('UpdateCoAdmin');
    expect(call?.variables).toMatchObject({ firstName: 'Augusta', id: 'ada', lastName: 'King' });
    expect(call?.variables).not.toHaveProperty('image');
  });

  test('when the server refuses, the user is told and the drawer stays open', async ({
    coAdminsPage,
    mockApi,
  }) => {
    await mockApi({
      ...handlers,
      UpdateCoAdmin: () => new GraphqlFailure('Name is too long'),
    });
    await coAdminsPage.openEdit('Ada Lovelace');

    await coAdminsPage.saveEdit('Augusta', 'King');

    await coAdminsPage.expectToast('Name is too long');
    await expect(coAdminsPage.drawer).toBeVisible();
  });

  test('when the API refuses an invite because the flag is now off, the invite option goes away', async ({
    coAdminsPage,
    mockApi,
  }) => {
    await mockApi({
      ...handlers,
      CreateInvitation: () => new GraphqlFailure('You are not allowed to perform this action.'),
      FetchFeatureFlags: () => featureFlagsResponse({ invitationsEnabled: false }),
    });
    await coAdminsPage.openInvite();

    await coAdminsPage.sendInvite('new1@example.test');

    await coAdminsPage.expectToast('You are not allowed to perform this action.');
    await coAdminsPage.expectInviteWithdrawn();
  });

  test('an active user can be edited and archived, a pending invite cannot be edited', async ({
    coAdminsPage,
  }) => {
    await coAdminsPage.expectRowActions('Ada Lovelace', ['Edit', 'Archive'], ['Resend invite']);

    await coAdminsPage.selectTab('Pending Invites');

    await coAdminsPage.expectRowActions(
      'Linus Torvalds',
      ['Resend invite', 'Delete invite'],
      ['Edit', 'Archive', 'Impersonate'],
    );
  });
});

test.describe('Users page with invitations off', () => {
  test('there is no way to invite when users cannot be invited', async ({
    coAdminsPage,
    session,
  }) => {
    const mock = await session.signInAs(buildUser('super_admin'), {
      ...handlers,
      FetchFeatureFlags: () => featureFlagsResponse({ invitationsEnabled: false }),
    });
    await coAdminsPage.open();
    await expect.poll(() => mock.callsTo('FetchFeatureFlags').length).toBeGreaterThan(0);

    await coAdminsPage.expectLoadedWithoutInvite();
    expect(mock.callsTo('FetchFeatureFlags')[0]?.variables).toEqual({ role: 'user' });
  });
});

test.describe('Users page when some invited emails are skipped', () => {
  test('skipped emails stay in the form with the reason', async ({ coAdminsPage, session }) => {
    await session.signInAs(buildUser('super_admin'), {
      ...handlers,
      CreateInvitation: () => ({
        createInvitation: {
          message: '1 invitation sent.',
          rejected: [{ email: 'bad@example.test', message: 'Email is invalid' }],
          users: [{ email: 'good@example.test' }],
        },
      }),
    });
    await coAdminsPage.open();
    await coAdminsPage.expectLoaded();
    await coAdminsPage.openInvite();

    await coAdminsPage.sendInvite('good@example.test, bad@example.test');

    await coAdminsPage.expectToast('1 invitation sent.');
    await coAdminsPage.expectRejectedInvite('bad@example.test', 'Email is invalid');
  });

  test('fixing the skipped email and resending closes the form', async ({
    coAdminsPage,
    session,
  }) => {
    const mock = await session.signInAs(buildUser('super_admin'), {
      ...handlers,
      CreateInvitation: (variables) => {
        const emails = variables.emails as string[];
        return emails.includes('bad@example.test')
          ? {
              createInvitation: {
                message: '1 invitation sent.',
                rejected: [{ email: 'bad@example.test', message: 'Email is invalid' }],
                users: [{ email: 'good@example.test' }],
              },
            }
          : { createInvitation: { message: 'Invitation sent.', rejected: [], users: [] } };
      },
    });
    await coAdminsPage.open();
    await coAdminsPage.expectLoaded();
    await coAdminsPage.openInvite();
    await coAdminsPage.sendInvite('good@example.test, bad@example.test');
    await coAdminsPage.expectRejectedInvite('bad@example.test', 'Email is invalid');

    await coAdminsPage.sendInvite('fixed@example.test');

    await coAdminsPage.expectToast('Invitation sent.', { exact: true });
    await expect(coAdminsPage.drawer).toBeHidden();
    expect(mock.callsTo('CreateInvitation').at(-1)?.variables).toMatchObject({
      emails: ['fixed@example.test'],
    });
  });

  test('the skipped list is gone when the form is closed and reopened', async ({
    coAdminsPage,
    session,
  }) => {
    await session.signInAs(buildUser('super_admin'), {
      ...handlers,
      CreateInvitation: () => ({
        createInvitation: {
          message: '1 invitation sent.',
          rejected: [{ email: 'bad@example.test', message: 'Email is invalid' }],
          users: [],
        },
      }),
    });
    await coAdminsPage.open();
    await coAdminsPage.expectLoaded();
    await coAdminsPage.openInvite();
    await coAdminsPage.sendInvite('bad@example.test');
    await coAdminsPage.expectRejectedInvite('bad@example.test', 'Email is invalid');

    await coAdminsPage.cancelInvite();
    await coAdminsPage.openInvite();

    await coAdminsPage.expectNoRejectedInvites();
    await expect(coAdminsPage.emails).toHaveValue('');
  });

  test('when every email is refused the form stays open with an error toast', async ({
    coAdminsPage,
    session,
  }) => {
    await session.signInAs(buildUser('super_admin'), {
      ...handlers,
      CreateInvitation: () => new GraphqlFailure('Email is invalid'),
    });
    await coAdminsPage.open();
    await coAdminsPage.expectLoaded();
    await coAdminsPage.openInvite();

    await coAdminsPage.sendInvite('bad@example.test');

    await coAdminsPage.expectToast('Email is invalid');
    await coAdminsPage.expectNoRejectedInvites();
    await expect(coAdminsPage.emails).toHaveValue('bad@example.test');
  });
});
