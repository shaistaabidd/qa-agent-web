import { expect, test } from '../../fixtures';
import { GraphqlFailure } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';
import { buildProject, connection } from '../../fixtures/projects';

const PROJECTS = [
  buildProject({ id: 'p1', name: 'Checkout app', repoConnected: true }),
  buildProject({ id: 'p2', name: 'Admin portal' }),
];

test.describe('Projects list (mocked)', () => {
  test('lists the projects the user belongs to, with their GitHub status', async ({
    projectsPage,
    session,
  }) => {
    await session.signInAs(buildUser('user'), {
      AllProjects: () => ({ allProjects: connection(PROJECTS) }),
    });

    await projectsPage.expectLoaded();
    await projectsPage.expectProjects(['Checkout app', 'Admin portal']);
    await expect(projectsPage.rows.filter({ hasText: 'Checkout app' })).toContainText(
      'GitHub connected',
    );
    await expect(projectsPage.rows.filter({ hasText: 'Admin portal' })).toContainText(
      'GitHub not connected',
    );
  });

  test('shows a friendly message when there are no projects', async ({ projectsPage, session }) => {
    await session.signInAs(buildUser('user'), {
      AllProjects: () => ({ allProjects: connection([]) }),
    });

    await projectsPage.expectEmpty();
  });

  test('creates a project and opens it', async ({ appShell, projectsPage, session }) => {
    const mock = await session.signInAs(buildUser('user'), {
      AllProjects: () => ({ allProjects: connection([]) }),
      CreateProject: () => ({
        createProject: { project: buildProject({ id: 'new-1', name: 'Shop' }) },
      }),
      FetchProject: () => ({ fetchProject: buildProject({ id: 'new-1', name: 'Shop' }) }),
    });
    await projectsPage.expectLoaded();

    await projectsPage.createProject('Shop', 'https://shop.example.test');

    await appShell.expectPath('/projects/new-1');
    expect(mock.callsTo('CreateProject')[0].variables).toEqual({
      input: { name: 'Shop', targetUrl: 'https://shop.example.test' },
    });
  });

  test('keeps the dialog open and shows the message when the API rejects the address', async ({
    projectsPage,
    session,
  }) => {
    await session.signInAs(buildUser('user'), {
      AllProjects: () => ({ allProjects: connection([]) }),
      CreateProject: () =>
        new GraphqlFailure('Target url must be a public web address, not a local or private one'),
    });
    await projectsPage.expectLoaded();

    await projectsPage.createProject('Shop', 'http://169.254.169.254');

    await projectsPage.expectDialogError('must be a public web address');
    await projectsPage.expectDialogOpen();
  });

  test('refuses an address that is not a web address before sending anything', async ({
    projectsPage,
    session,
  }) => {
    const mock = await session.signInAs(buildUser('user'), {
      AllProjects: () => ({ allProjects: connection([]) }),
    });
    await projectsPage.expectLoaded();

    await projectsPage.createProject('Shop', 'not a url');

    await projectsPage.expectDialogError('Enter a web address');
    expect(mock.callsTo('CreateProject')).toHaveLength(0);
  });
});
