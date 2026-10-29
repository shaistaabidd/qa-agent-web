import { expect, test } from '../../fixtures';
import type { GraphqlMock } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

// Twilio queued most logs, accepted log 5 through a Messaging Service and refused logs 3 and 7
// (invalid number, opted out); log 12 is still waiting to be handed over.
const STATUS_BY_LOG: Record<number, string> = {
  3: 'FAILED',
  5: 'ACCEPTED',
  7: 'FAILED',
  12: 'PENDING',
};
const ERROR_BY_LOG: Record<number, { code: string; message: string }> = {
  3: { code: '21211', message: 'The phone number is not valid.' },
  7: { code: '21610', message: 'The recipient has opted out of messages (replied STOP).' },
};
const pad = (n: number) => String(n).padStart(2, '0');

const LOGS = Array.from({ length: 12 }, (_, index) => {
  const n = index + 1;
  const status = STATUS_BY_LOG[n] ?? 'QUEUED';
  const error = ERROR_BY_LOG[n];

  return {
    __typename: 'SmsLog',
    body: `Welcome to SaaS App, User ${n}! Your account is all set.`,
    createdAt: '2026-10-01T09:00:00Z',
    errorCode: error?.code ?? null,
    errorMessage: error?.message ?? null,
    id: `sms-${pad(n)}`,
    messageType: 'WELCOME',
    providerSid: status === 'QUEUED' || status === 'ACCEPTED' ? `SM${pad(n)}abcdef` : null,
    recipient: `+120255501${pad(n)}`,
    sentAt: status === 'QUEUED' || status === 'ACCEPTED' ? '2026-10-01T09:00:00Z' : null,
    status,
    user: {
      __typename: 'User',
      email: `user${pad(n)}@example.test`,
      firstName: 'User',
      id: `user-${pad(n)}`,
      lastName: String(n),
    },
  };
});

const recipients = (from: number, to: number) =>
  LOGS.slice(from - 1, to).map((log) => log.recipient);

const handlers = {
  AllSmsLogs: (variables: Record<string, unknown>) => {
    const filter = (variables.filter ?? {}) as {
      messageType?: string;
      page?: number;
      perPage?: number;
      search?: string;
      status?: string;
    };
    const term = (filter.search ?? '').toLowerCase();
    const matches = LOGS.filter(
      (log) =>
        (!filter.status || log.status === filter.status) &&
        (!filter.messageType || log.messageType === filter.messageType) &&
        (!term || log.recipient.toLowerCase().includes(term)),
    );
    const perPage = filter.perPage ?? 10;
    const page = filter.page ?? 1;
    const totalPages = Math.max(Math.ceil(matches.length / perPage), 1);

    return {
      allSmsLogs: {
        allData: matches.slice((page - 1) * perPage, page * perPage),
        count: matches.length,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        totalPages,
      },
    };
  },
  FetchSmsLog: (variables: Record<string, unknown>) => ({
    fetchSmsLog: LOGS.find((log) => log.id === variables.id) ?? null,
  }),
};

test.describe('SMS logs with data (mocked)', () => {
  let mock: GraphqlMock;

  test.beforeEach(async ({ session, smsLogsPage }) => {
    mock = await session.signInAs(buildUser('super_admin'), handlers);
    await smsLogsPage.open();
    await smsLogsPage.expectLoaded();
  });

  test('shows the first page of logs and a summary', async ({ smsLogsPage }) => {
    await smsLogsPage.expectRows(recipients(1, 10));
    await smsLogsPage.expectSummary('Showing 1 – 10 of 12 SMS logs');
    expect(mock.callsTo('AllSmsLogs')[0]?.variables.filter).toMatchObject({
      page: 1,
      perPage: 10,
    });
  });

  test('each row shows the message type, status and user', async ({ smsLogsPage }) => {
    await smsLogsPage.expectRows(recipients(1, 10));

    await smsLogsPage.expectStatusTag('+12025550101', /queued/i);
    await smsLogsPage.expectStatusTag('+12025550105', /accepted/i);
    await smsLogsPage.expectStatusTag('+12025550103', /failed/i);
    await smsLogsPage.expectRowText('+12025550101', 'Welcome');
    await smsLogsPage.expectRowText('+12025550101', 'User 1');
  });

  test('the next page shows the rest and asks the server for page 2', async ({ smsLogsPage }) => {
    await smsLogsPage.goToNextPage();

    await smsLogsPage.expectRows(recipients(11, 12));
    await smsLogsPage.expectSummary('Showing 11 – 12 of 12 SMS logs');
    expect(mock.callsTo('AllSmsLogs').at(-1)?.variables.filter).toMatchObject({ page: 2 });
  });

  test('searching by recipient narrows the list and is sent to the server', async ({
    smsLogsPage,
  }) => {
    await smsLogsPage.searchFor('0105');

    await smsLogsPage.expectRows(['+12025550105']);
    await smsLogsPage.expectSearchInUrl('0105');
    expect(mock.callsTo('AllSmsLogs').at(-1)?.variables.filter).toMatchObject({ search: '0105' });
  });

  test('filtering by status shows only those logs and can be reset', async ({ smsLogsPage }) => {
    await smsLogsPage.filterBy({ status: 'Failed' });

    await smsLogsPage.expectRows(['+12025550103', '+12025550107']);
    await smsLogsPage.expectFilterCount(1);
    expect(mock.callsTo('AllSmsLogs').at(-1)?.variables.filter).toMatchObject({
      status: 'FAILED',
    });

    await smsLogsPage.resetFilters();

    await smsLogsPage.expectFilterCount(0);
    await smsLogsPage.expectRows(recipients(1, 10));
  });

  test('filtering by message type sends the type to the server', async ({ smsLogsPage }) => {
    await smsLogsPage.filterBy({ messageType: 'Welcome' });

    await smsLogsPage.expectRows(recipients(1, 10));
    expect(mock.callsTo('AllSmsLogs').at(-1)?.variables.filter).toMatchObject({
      messageType: 'WELCOME',
    });
  });

  test('both filters can be combined', async ({ smsLogsPage }) => {
    await smsLogsPage.filterBy({ messageType: 'Welcome', status: 'Pending' });

    await smsLogsPage.expectRows(['+12025550112']);
    await smsLogsPage.expectFilterCount(2);
    expect(mock.callsTo('AllSmsLogs').at(-1)?.variables.filter).toMatchObject({
      messageType: 'WELCOME',
      status: 'PENDING',
    });
  });

  test("a failed log shows Twilio's error code and what went wrong", async ({ smsLogsPage }) => {
    await smsLogsPage.openLogFor('+12025550103');

    await smsLogsPage.expectDetailText('Failed');
    await smsLogsPage.expectDetailText('21211');
    await smsLogsPage.expectDetailText('The phone number is not valid.');
    await smsLogsPage.expectDetailText('Welcome to SaaS App, User 3!');
    await smsLogsPage.expectDetailText('user03@example.test');
    expect(mock.callsTo('FetchSmsLog')[0]?.variables).toMatchObject({ id: 'sms-03' });

    await smsLogsPage.closeDetails();
  });

  test('a sent log shows its Twilio SID and when it was sent', async ({ smsLogsPage }) => {
    await smsLogsPage.openLogFor('+12025550101');

    await smsLogsPage.expectDetailText('SM01abcdef');
    await smsLogsPage.expectDetailText('Sent at');

    await smsLogsPage.closeDetails();
  });

  test('dates in the URL that are not real days are ignored', async ({ smsLogsPage }) => {
    await smsLogsPage.goto('/sms-logs?start=garbage&end=2026-02-31');

    await smsLogsPage.expectRows(recipients(1, 10));
    await smsLogsPage.expectFilterCount(0);
    const filter = mock.callsTo('AllSmsLogs').at(-1)?.variables.filter;
    expect(filter).not.toHaveProperty('startDate');
    expect(filter).not.toHaveProperty('endDate');
  });

  test('a real date range in the URL is sent to the server', async ({ smsLogsPage }) => {
    await smsLogsPage.goto('/sms-logs?start=2026-10-01&end=2026-10-31');

    await smsLogsPage.expectFilterCount(2);
    await expect
      .poll(() => mock.callsTo('AllSmsLogs').at(-1)?.variables.filter)
      .toMatchObject({ endDate: '2026-10-31', startDate: '2026-10-01' });
  });

  test('an unknown status or type in the URL is not sent to the server', async ({
    smsLogsPage,
  }) => {
    await smsLogsPage.goto('/sms-logs?status=bogus&type=%3Cscript%3E');

    await smsLogsPage.expectRows(recipients(1, 10));
    await smsLogsPage.expectFilterCount(0);
    const filter = mock.callsTo('AllSmsLogs').at(-1)?.variables.filter;
    expect(filter).not.toHaveProperty('status');
    expect(filter).not.toHaveProperty('messageType');
  });
});

test.describe('SMS logs with hostile content (mocked)', () => {
  const MARKUP = '<img src=x onerror="window.injected=1"><script>window.injected=1</script>';
  const hostile = {
    __typename: 'SmsLog',
    body: MARKUP,
    createdAt: '2026-10-01T09:00:00Z',
    errorCode: '21211',
    errorMessage: '<b>bold error</b>',
    id: 'sms-hostile',
    messageType: 'WELCOME',
    providerSid: null,
    recipient: '+12025550199',
    sentAt: null,
    status: 'FAILED',
    user: {
      __typename: 'User',
      email: 'a@example.test',
      firstName: '<i>italic</i>',
      id: 'u',
      lastName: '',
    },
  };

  test('is shown as plain text and never runs', async ({ session, smsLogsPage }) => {
    await session.signInAs(buildUser('super_admin'), {
      AllSmsLogs: () => ({
        allSmsLogs: { allData: [hostile], count: 1, nextPage: null, prevPage: null, totalPages: 1 },
      }),
      FetchSmsLog: () => ({ fetchSmsLog: hostile }),
    });
    await smsLogsPage.open();
    await smsLogsPage.expectLoaded();

    await smsLogsPage.openFirstLog();

    await smsLogsPage.expectDetailText(MARKUP);
    await smsLogsPage.expectDetailText('<b>bold error</b>');
    await smsLogsPage.expectDetailText('<i>italic</i>');
    await smsLogsPage.expectNoMarkupInjected();
  });
});
