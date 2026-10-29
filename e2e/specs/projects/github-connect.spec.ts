import { expect, test } from '../../fixtures';
import { GraphqlFailure } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';
import { buildProject, EMPTY_SUMMARY } from '../../fixtures/projects';

const project = buildProject({ githubInstalled: true, repoConnected: false });

const handlers = (extra = {}) => ({
  FetchFindingsSummary: () => ({ fetchFindingsSummary: EMPTY_SUMMARY }),
  FetchProject: () => ({ fetchProject: project }),
  ...extra,
});

test.describe('GitHub connection (mocked)', () => {
  test('finishes the install redirect and opens the project', async ({ appShell, session }) => {
    const mock = await session.signInAs(
      buildUser('user'),
      handlers({
        CompleteGithubInstallation: () => ({ completeGithubInstallation: { project } }),
      }),
    );

    await appShell.open('/github/callback?installation_id=777&code=oauth-code&state=signed-state');

    await appShell.expectPath('/projects/project-1');
    expect(mock.callsTo('CompleteGithubInstallation')[0].variables).toEqual({
      input: { code: 'oauth-code', installationId: '777', state: 'signed-state' },
    });
  });

  test('lets the user choose when several installations are available', async ({
    appShell,
    projectPage,
    session,
  }) => {
    const mock = await session.signInAs(
      buildUser('user'),
      handlers({
        AuthorizeGithubUser: () => ({
          authorizeGithubUser: {
            choiceToken: 'choice',
            installations: [
              { accountLogin: 'me', accountType: 'User', id: '1' },
              { accountLogin: 'acme', accountType: 'Organization', id: '2' },
            ],
          },
        }),
        SelectGithubInstallation: () => ({ selectGithubInstallation: { project } }),
      }),
    );

    await appShell.open('/github/callback?code=oauth-code&state=signed-state');
    await projectPage.button('acme (organization)').click();

    await appShell.expectPath('/projects/project-1');
    expect(mock.callsTo('SelectGithubInstallation')[0].variables).toEqual({
      input: { choiceToken: 'choice', installationId: '2' },
    });
  });

  test('explains a requested installation without calling the API', async ({
    appShell,
    projectPage,
    session,
  }) => {
    const mock = await session.signInAs(buildUser('user'), handlers());

    await appShell.open('/github/callback?setup_action=request');

    await projectPage.expectText('Installation requested.');
    expect(mock.callsTo('CompleteGithubInstallation')).toHaveLength(0);
  });

  test('says so when GitHub returns without the details to finish', async ({
    appShell,
    projectPage,
    session,
  }) => {
    await session.signInAs(buildUser('user'), handlers());

    await appShell.open('/github/callback');

    await projectPage.expectText('did not return the details needed');
  });

  test('shows the API message when linking fails', async ({ appShell, projectPage, session }) => {
    await session.signInAs(
      buildUser('user'),
      handlers({
        CompleteGithubInstallation: () =>
          new GraphqlFailure('You do not have access to that GitHub installation.'),
      }),
    );

    await appShell.open('/github/callback?installation_id=999&code=oauth-code&state=signed-state');

    await projectPage.expectText('You do not have access to that GitHub installation.');
  });

  test('links the chosen repository and starts a scan', async ({ projectPage, session }) => {
    const mock = await session.signInAs(
      buildUser('user'),
      handlers({
        AllGithubRepositories: () => ({ allGithubRepositories: ['acme/checkout', 'acme/api'] }),
        ConnectGithub: () => ({
          connectGithub: {
            project: { ...project, repoConnected: true, repoFullName: 'acme/checkout' },
          },
        }),
        ScanCodebase: () => ({ scanCodebase: { message: 'Scan enqueued', success: true } }),
      }),
    );

    await projectPage.open('/projects/project-1');
    await projectPage.choose('Repository', 'acme/checkout');
    await projectPage.button('Link repository').click();

    await projectPage.expectText('GitHub repository connected');
    expect(mock.callsTo('ConnectGithub')[0].variables).toEqual({
      input: { projectId: 'project-1', repoFullName: 'acme/checkout' },
    });
  });
});
