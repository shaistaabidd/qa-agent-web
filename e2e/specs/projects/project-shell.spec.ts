import { expect, test } from '../../fixtures';
import { GraphqlFailure } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';
import {
  buildProject,
  buildRun,
  buildScopeFeature,
  connection,
  EMPTY_SUMMARY,
} from '../../fixtures/projects';

const baseHandlers = (project: ReturnType<typeof buildProject>, extra = {}) => ({
  AllProjects: () => ({ allProjects: connection([project]) }),
  AllRoleCredentials: () => ({ allRoleCredentials: [] }),
  AllRuns: () => ({ allRuns: connection([buildRun()]) }),
  AllScopeFeatures: () => ({
    allScopeFeatures: connection([buildScopeFeature({ approved: true })]),
  }),
  FetchFindingsSummary: () => ({ fetchFindingsSummary: { ...EMPTY_SUMMARY, total: 2 } }),
  FetchProject: () => ({ fetchProject: project }),
  ...extra,
});

test.describe('Project shell (mocked)', () => {
  test('shows the project header and moves between tabs, loading only the open tab', async ({
    projectPage,
    session,
  }) => {
    const mock = await session.signInAs(buildUser('user'), baseHandlers(buildProject()));

    await projectPage.open('/projects/project-1');
    await projectPage.expectProject('Checkout app');
    expect(mock.callsTo('AllRuns')).toHaveLength(0);

    await projectPage.openTab('Runs', '/projects/project-1/runs');
    await projectPage.expectRowTag('checkout', 'queued');
    expect(mock.callsTo('AllRuns').length).toBeGreaterThan(0);

    await projectPage.openTab('Credentials', '/projects/project-1/credentials');
    await projectPage.expectText('Role credentials');
  });

  test('shows the open issue count on the Issues tab', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), baseHandlers(buildProject()));

    await projectPage.open('/projects/project-1');

    await projectPage.expectTabBadge('Issues', 2);
  });

  test('tells a user without access that the project is not found', async ({
    projectPage,
    session,
  }) => {
    await session.signInAs(buildUser('user'), {
      FetchFindingsSummary: () => new GraphqlFailure('Not found.'),
      FetchProject: () => new GraphqlFailure('Not found.'),
    });

    await projectPage.open('/projects/someone-elses');

    await projectPage.expectText('Project not found');
  });

  test('hides the admin-only controls from a plain member', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), baseHandlers(buildProject({ myRole: 'MEMBER' })));

    await projectPage.open('/projects/project-1');
    await projectPage.expectText('Only project admins can connect GitHub.');
    await projectPage.expectButton('Connect GitHub', false);

    await projectPage.openTab('Credentials', '/projects/project-1/credentials');
    await projectPage.expectText('Only project admins can set credentials.');
    await projectPage.expectButton('Save credential', false);

    await projectPage.openTab('Scope features', '/projects/project-1/scope');
    await projectPage.expectButton('Approve', false);

    await projectPage.openTab('Runs', '/projects/project-1/runs');
    await expect(projectPage.button('Dispatch run')).toHaveCount(0);
  });

  test('shows the admin controls to a project admin', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), baseHandlers(buildProject({ myRole: 'ADMIN' })));

    await projectPage.open('/projects/project-1');

    await projectPage.expectButton('Connect GitHub');
  });
});
