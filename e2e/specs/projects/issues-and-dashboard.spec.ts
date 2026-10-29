import { expect, test } from '../../fixtures';
import { buildUser } from '../../fixtures/mockUsers';
import {
  buildFinding,
  buildFindingDetail,
  buildProject,
  connection,
  EMPTY_SUMMARY,
} from '../../fixtures/projects';

const ISSUES = [
  buildFinding({
    id: 'f1',
    issueStatus: 'regressed',
    timesSeen: 3,
    title: 'TypeError: x is undefined',
  }),
  buildFinding({
    id: 'f2',
    issueStatus: 'new',
    severity: 'LOW',
    source: 'BACKEND',
    title: 'Slow query on orders',
  }),
];

const base = {
  FetchProject: () => ({ fetchProject: buildProject() }),
};

test.describe('Issues (mocked)', () => {
  test('lists issues with their status, severity, source and how often they came up', async ({
    projectPage,
    session,
  }) => {
    await session.signInAs(buildUser('user'), {
      ...base,
      AllFindings: () => ({ allFindings: connection(ISSUES) }),
      FetchFindingsSummary: () => ({ fetchFindingsSummary: { ...EMPTY_SUMMARY, total: 2 } }),
    });

    await projectPage.open('/projects/project-1/issues');

    await projectPage.expectRowTag('TypeError: x is undefined', 'regressed');
    await projectPage.expectRowTag('TypeError: x is undefined', 'high');
    await projectPage.expectRowTag('Slow query on orders', 'backend');
  });

  test('filters by severity', async ({ projectPage, session }) => {
    const mock = await session.signInAs(buildUser('user'), {
      ...base,
      AllFindings: () => ({ allFindings: connection(ISSUES) }),
      FetchFindingsSummary: () => ({ fetchFindingsSummary: EMPTY_SUMMARY }),
    });
    await projectPage.open('/projects/project-1/issues');

    await projectPage.choose('Filter by severity', 'Critical');

    await expect
      .poll(() => mock.callsTo('AllFindings').at(-1)?.variables.filter)
      .toMatchObject({ severity: 'CRITICAL' });
  });

  test('opens an issue to see the steps and the evidence', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), {
      ...base,
      AllFindings: () => ({ allFindings: connection(ISSUES) }),
      FetchFinding: () => ({ fetchFinding: buildFindingDetail({ id: 'f1' }) }),
      FetchFindingsSummary: () => ({ fetchFindingsSummary: EMPTY_SUMMARY }),
    });
    await projectPage.open('/projects/project-1/issues');

    await projectPage.clickLink('TypeError: x is undefined');

    await projectPage.expectText('Steps to reproduce');
    await projectPage.expectText('Click Pay');
    await projectPage.expectText('Backtrace (server)');
    await projectPage.expectText('app/models/order.rb:12');
  });

  test('shows an empty state before any run has reported', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), {
      ...base,
      AllFindings: () => ({ allFindings: connection([]) }),
      FetchFindingsSummary: () => ({ fetchFindingsSummary: EMPTY_SUMMARY }),
    });

    await projectPage.open('/projects/project-1/issues');

    await projectPage.expectText('No issues');
  });
});

test.describe('Project dashboard (mocked)', () => {
  test('shows coverage and the open issue counts', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), {
      ...base,
      FetchCoverage: () => ({
        fetchCoverage: {
          approvedScopeFeatures: 2,
          coveragePercentage: 50,
          testedScopeFeatures: 1,
          totalScopeFeatures: 3,
        },
      }),
      FetchFindingsSummary: () => ({
        fetchFindingsSummary: {
          ...EMPTY_SUMMARY,
          bySeverity: [
            { count: 0, severity: 'LOW' },
            { count: 0, severity: 'MEDIUM' },
            { count: 1, severity: 'HIGH' },
            { count: 1, severity: 'CRITICAL' },
          ],
          resolved: 1,
          total: 2,
          totalFindings: 5,
        },
      }),
    });

    await projectPage.open('/projects/project-1/dashboard');

    await projectPage.expectText('1 of 2 approved features tested (3 total in scope)');
    await projectPage.expectText('1 resolved · 5 findings across all runs');
  });
});
