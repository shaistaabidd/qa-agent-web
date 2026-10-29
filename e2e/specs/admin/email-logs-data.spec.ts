import { expect, test } from '../../fixtures';
import type { GraphqlMock } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

const FAILED = new Set([3, 7]);
const pad = (n: number) => String(n).padStart(2, '0');

const LOGS = Array.from({ length: 12 }, (_, index) => {
  const n = index + 1;
  const failed = FAILED.has(n);

  return {
    __typename: 'EmailLog',
    attempts: failed ? 3 : 1,
    body: `Hello user ${pad(n)}, welcome aboard.`,
    createdAt: '2026-10-01T09:00:00Z',
    errorMessage: failed ? 'SMTP rejected the message' : null,
    id: `log-${pad(n)}`,
    mailer: 'UserMailer',
    mailerMethod: 'welcome',
    recipient: `user${pad(n)}@example.test`,
    sentAt: '2026-10-01T09:00:00Z',
    status: failed ? 'FAILED' : 'SUCCESS',
    subject: `Welcome ${n}`,
    updatedAt: '2026-10-01T09:00:00Z',
  };
});

// Not in the list: opened by URL to see how the detail page copes with missing values.
const BARE_LOG = {
  ...LOGS[0],
  attempts: 0,
  id: 'log-bare',
  recipient: 'bare@example.test',
  sentAt: null,
  subject: null,
};

const recipients = (from: number, to: number) =>
  LOGS.slice(from - 1, to).map((log) => log.recipient);

const handlers = {
  AllEmailLogs: (variables: Record<string, unknown>) => {
    const filter = (variables.filter ?? {}) as {
      page?: number;
      perPage?: number;
      search?: string;
      status?: string;
    };
    const term = (filter.search ?? '').toLowerCase();
    const matches = LOGS.filter(
      (log) =>
        (!filter.status || log.status === filter.status) &&
        (!term || `${log.recipient} ${log.subject}`.toLowerCase().includes(term)),
    );
    const perPage = filter.perPage ?? 10;
    const page = filter.page ?? 1;
    const totalPages = Math.max(Math.ceil(matches.length / perPage), 1);

    return {
      allEmailLogs: {
        allData: matches.slice((page - 1) * perPage, page * perPage),
        count: matches.length,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        totalPages,
      },
    };
  },
  EmailLogDetail: (variables: Record<string, unknown>) => ({
    fetchEmailLog: [...LOGS, BARE_LOG].find((log) => log.id === variables.id) ?? null,
  }),
};

test.describe('Email logs with data (mocked)', () => {
  let mock: GraphqlMock;

  test.beforeEach(async ({ emailLogsPage, session }) => {
    mock = await session.signInAs(buildUser('super_admin'), handlers);
    await emailLogsPage.open();
    await emailLogsPage.expectLoaded();
  });

  test('shows the first page of logs and a summary', async ({ emailLogsPage }) => {
    await emailLogsPage.expectRows(recipients(1, 10));
    await emailLogsPage.expectSummary('Showing 1 – 10 of 12 emails');
    expect(mock.callsTo('AllEmailLogs')[0]?.variables.filter).toMatchObject({
      page: 1,
      perPage: 10,
    });
  });

  test('shows each log with its status', async ({ emailLogsPage }) => {
    await emailLogsPage.expectStatusTag('user03@example.test', /failed/i);
    await emailLogsPage.expectStatusTag('user04@example.test', /success/i);
  });

  test('the next page shows the rest and asks the server for page 2', async ({ emailLogsPage }) => {
    await emailLogsPage.goToNextPage();

    await emailLogsPage.expectRows(recipients(11, 12));
    await emailLogsPage.expectSummary('Showing 11 – 12 of 12 emails');
    expect(mock.callsTo('AllEmailLogs').at(-1)?.variables.filter).toMatchObject({ page: 2 });
  });

  test('searching narrows the list and is sent to the server', async ({ emailLogsPage }) => {
    await emailLogsPage.searchFor('user05');

    await emailLogsPage.expectRows(['user05@example.test']);
    await emailLogsPage.expectSearchInUrl('user05');
    expect(mock.callsTo('AllEmailLogs').at(-1)?.variables.filter).toMatchObject({
      search: 'user05',
    });
  });

  test('filtering by status shows only those logs and can be reset', async ({ emailLogsPage }) => {
    await emailLogsPage.filterByStatus('Failed');

    await emailLogsPage.expectRows(['user03@example.test', 'user07@example.test']);
    await emailLogsPage.expectFilterCount(1);
    expect(mock.callsTo('AllEmailLogs').at(-1)?.variables.filter).toMatchObject({
      status: 'FAILED',
    });

    await emailLogsPage.resetFilters();

    await emailLogsPage.expectFilterCount(0);
    await emailLogsPage.expectRows(recipients(1, 10));
  });

  test('the status can also be chosen with the keyboard', async ({ emailLogsPage }) => {
    await emailLogsPage.filterByStatusWithKeyboard('Failed');

    await emailLogsPage.expectRows(['user03@example.test', 'user07@example.test']);
  });

  test('opens a failed log with its error and goes back to the list', async ({ emailLogsPage }) => {
    await emailLogsPage.openLogFor('user03@example.test');

    await emailLogsPage.expectDetail({ recipient: 'user03@example.test', subject: 'Welcome 3' });
    await emailLogsPage.expectDetailText('SMTP rejected the message');
    await emailLogsPage.expectAttempts(3);
    await emailLogsPage.expectDetailText('Hello user 03, welcome aboard.');
    expect(mock.callsTo('EmailLogDetail')[0]?.variables).toMatchObject({ id: 'log-03' });

    await emailLogsPage.goBackToList();
  });

  test('a successful log shows no error message', async ({ emailLogsPage }) => {
    await emailLogsPage.openLogFor('user04@example.test');

    await emailLogsPage.expectDetail({ recipient: 'user04@example.test', subject: 'Welcome 4' });
    await emailLogsPage.expectNoDetailText('Error message');
    await emailLogsPage.expectAttempts(1);
  });

  test('a log without a subject, sent date or attempts shows the fallbacks', async ({
    emailLogsPage,
  }) => {
    await emailLogsPage.openDetail('log-bare');

    await emailLogsPage.expectDetailTitle('Email log');
    await emailLogsPage.expectDetailRow('Subject', 'N/A');
    await emailLogsPage.expectDetailRow('Sent at', 'N/A');
    await emailLogsPage.expectNoDetailText('Attempts');
  });
});
