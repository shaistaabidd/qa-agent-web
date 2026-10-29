import { expect, test } from '../../fixtures';
import { buildUser } from '../../fixtures/mockUsers';
import {
  buildProject,
  buildScopeFeature,
  connection,
  EMPTY_SUMMARY,
} from '../../fixtures/projects';

const SECRET = 'correct-horse-battery-staple';

const base = {
  FetchFindingsSummary: () => ({ fetchFindingsSummary: EMPTY_SUMMARY }),
  FetchProject: () => ({ fetchProject: buildProject() }),
};

test.describe('Credentials (mocked)', () => {
  test('saves a credential, lists only the role, and never shows the value', async ({
    projectPage,
    session,
  }) => {
    let roles: { createdAt: string; id: string; roleName: string; updatedAt: string }[] = [];
    const mock = await session.signInAs(buildUser('user'), {
      ...base,
      AllRoleCredentials: () => ({ allRoleCredentials: roles }),
      SetRoleCredential: (variables) => {
        const input = variables.input as { roleName: string };
        roles = [
          {
            createdAt: '2026-10-01T09:00:00Z',
            id: 'c1',
            roleName: input.roleName,
            updatedAt: '2026-10-01T09:00:00Z',
          },
        ];
        return { setRoleCredential: { roleCredential: roles[0] } };
      },
    });

    await projectPage.open('/projects/project-1/credentials');
    await projectPage.expectText('No credentials configured yet');
    await projectPage.fill('Role name', 'admin');
    await projectPage.fill('Credential', SECRET);
    await projectPage.button('Save credential').click();

    await projectPage.expectRowTag('admin', 'admin');
    await projectPage.expectFieldValue('Credential', '');
    await projectPage.expectNoText(SECRET);
    expect(mock.callsTo('SetRoleCredential')[0].variables).toEqual({
      input: { credentialValue: SECRET, projectId: 'project-1', roleName: 'admin' },
    });
  });

  test('keeps the credential field masked', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), {
      ...base,
      AllRoleCredentials: () => ({ allRoleCredentials: [] }),
    });

    await projectPage.open('/projects/project-1/credentials');

    await projectPage.expectFieldType('Credential', 'password');
  });
});

test.describe('Scope features (mocked)', () => {
  test('approves a pending feature', async ({ projectPage, session }) => {
    let approved = false;
    const mock = await session.signInAs(buildUser('user'), {
      ...base,
      AllScopeFeatures: () => ({
        allScopeFeatures: connection([
          buildScopeFeature({ approved, id: 'f1', name: 'GET checkout' }),
        ]),
      }),
      ApproveScopeFeature: () => {
        approved = true;
        return {
          approveScopeFeature: { scopeFeature: buildScopeFeature({ approved: true, id: 'f1' }) },
        };
      },
    });

    await projectPage.open('/projects/project-1/scope');
    await projectPage.expectRowTag('GET checkout', 'Pending');
    await projectPage.button('Approve').click();

    await projectPage.expectRowTag('GET checkout', 'Approved');
    expect(mock.callsTo('ApproveScopeFeature')[0].variables).toEqual({ input: { id: 'f1' } });
  });

  test('points to the scan when there are no features', async ({ projectPage, session }) => {
    await session.signInAs(buildUser('user'), {
      ...base,
      AllScopeFeatures: () => ({ allScopeFeatures: connection([]) }),
    });

    await projectPage.open('/projects/project-1/scope');

    await projectPage.expectText('No scope features yet');
  });
});
