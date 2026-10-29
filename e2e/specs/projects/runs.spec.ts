import { expect, test } from '../../fixtures';
import { buildUser } from '../../fixtures/mockUsers';
import {
  buildFinding,
  buildProject,
  buildRun,
  buildRunDetail,
  buildScopeFeature,
  connection,
  EMPTY_SUMMARY,
} from '../../fixtures/projects';

const base = {
  AllScopeFeatures: () => ({
    allScopeFeatures: connection([buildScopeFeature({ approved: true, id: 'feature-1' })]),
  }),
  FetchFindingsSummary: () => ({ fetchFindingsSummary: EMPTY_SUMMARY }),
  FetchProject: () => ({ fetchProject: buildProject() }),
};

test.describe('Runs (mocked)', () => {
  test('dispatches a run for an approved feature and adds it to the queue', async ({
    projectPage,
    session,
  }) => {
    let runs: ReturnType<typeof buildRun>[] = [];
    const mock = await session.signInAs(buildUser('user'), {
      ...base,
      AllRuns: () => ({ allRuns: connection(runs) }),
      DispatchRun: () => {
        runs = [buildRun()];
        return { dispatchRun: { run: runs[0] } };
      },
    });

    await projectPage.open('/projects/project-1/runs');
    await projectPage.choose('Scope feature', 'GET checkout');
    await projectPage.fill('Role', 'admin');
    await projectPage.button('Dispatch run').click();

    await projectPage.expectRowTag('GET checkout', 'queued');
    expect(mock.callsTo('DispatchRun')[0].variables).toEqual({
      input: { roleName: 'admin', scopeFeatureId: 'feature-1' },
    });
  });

  test('keeps refreshing while a run is active, then shows it finished', async ({
    projectPage,
    session,
  }) => {
    let calls = 0;
    await session.signInAs(buildUser('user'), {
      ...base,
      AllRuns: () => {
        calls += 1;
        return {
          allRuns: connection([buildRun({ status: calls < 2 ? 'RUNNING' : 'COMPLETED' })]),
        };
      },
    });

    await projectPage.open('/projects/project-1/runs');
    await projectPage.expectRowTag('GET checkout', 'running');

    await expect(projectPage.row('GET checkout')).toContainText('completed', { timeout: 20_000 });
  });

  test('filters the queue by status', async ({ projectPage, session }) => {
    const mock = await session.signInAs(buildUser('user'), {
      ...base,
      AllRuns: () => ({ allRuns: connection([buildRun({ status: 'FAILED' })]) }),
    });

    await projectPage.open('/projects/project-1/runs?status=FAILED');

    await projectPage.expectRowTag('GET checkout', 'failed');
    const filter = mock.callsTo('AllRuns')[0].variables.filter as { status?: string };
    expect(filter.status).toBe('FAILED');
  });

  test('opens a run to see its summary, endpoints, and audit log', async ({
    projectPage,
    session,
  }) => {
    await session.signInAs(buildUser('user'), {
      ...base,
      AllFindings: () => ({ allFindings: connection([buildFinding({ title: 'Slow checkout' })]) }),
      FetchRun: () => ({ fetchRun: buildRunDetail() }),
    });

    await projectPage.open('/projects/project-1/runs/run-1');
    await projectPage.expectText('GET checkout');
    await projectPage.expectText('3 pages');
    await projectPage.expectText('Slow checkout');

    await projectPage.clickTab('Endpoints');
    await projectPage.expectText('GraphQL AllOrders');

    await projectPage.clickTab('Audit log');
    await projectPage.expectText('#pay-button');
  });

  test('says so when the run does not exist', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), { ...base, FetchRun: () => ({ fetchRun: null }) });

    await projectPage.open('/projects/project-1/runs/missing');

    await projectPage.expectText('Run not found');
  });
});
