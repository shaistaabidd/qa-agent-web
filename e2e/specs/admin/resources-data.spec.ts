import { expect, test } from '../../fixtures';
import type { GraphqlMock } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

const resource = (id: string, title: string, extra: Record<string, unknown> = {}) => ({
  __typename: 'Resource',
  category: 'FAQS',
  createdAt: '2026-09-15T09:00:00Z',
  description: null,
  id,
  isActive: true,
  pdfFileUrl: null,
  position: 1,
  resourceType: 'CLIENT',
  title,
  videoLink: null,
  ...extra,
});

const GETTING_STARTED = resource('r1', 'Getting started');
const NUTRITION = resource('r2', 'Nutrition guide', { category: 'EDUCATION' });
const BILLING = resource('r3', 'Billing help', { isActive: false });
const CLINIC_SETUP = resource('r4', 'Clinic setup', {
  category: 'TUTORIALS',
  resourceType: 'CLINIC',
});
const HANDBOOK = resource('r5', 'Staff handbook', { category: 'NEWS', resourceType: 'CLINIC' });
const OLD_POLICY = resource('r6', 'Old policy', { category: 'MARKETING' });

const ACTIVE = [GETTING_STARTED, NUTRITION, BILLING, CLINIC_SETUP, HANDBOOK];

const handlers = {
  AccessResource: () => ({ updateResource: { resource: { id: 'r3' } } }),
  AllResources: (variables: Record<string, unknown>) => {
    const term = String(variables.search ?? '').toLowerCase();
    const rows = (variables.archived ? [OLD_POLICY] : ACTIVE).filter(
      (row) =>
        (!variables.resourceType || row.resourceType === variables.resourceType) &&
        (!variables.category || row.category === variables.category) &&
        (!term || row.title.toLowerCase().includes(term)),
    );

    return {
      allResources: {
        allData: rows,
        count: rows.length,
        nextPage: null,
        prevPage: null,
        totalPages: 1,
      },
    };
  },
  ArchiveResource: () => ({ updateResource: { resource: { id: 'r1' } } }),
};

test.describe('Resources with data (mocked)', () => {
  let mock: GraphqlMock;

  test.beforeEach(async ({ resourcesPage, session }) => {
    mock = await session.signInAs(buildUser('super_admin'), handlers);
    await resourcesPage.open();
    await resourcesPage.expectLoaded();
  });

  test('opens on client resources and asks for them', async ({ resourcesPage }) => {
    await resourcesPage.expectRows(['Getting started', 'Nutrition guide', 'Billing help']);

    expect(mock.callsTo('AllResources')[0]?.variables).toMatchObject({
      archived: false,
      resourceType: 'CLIENT',
    });
  });

  test('each row shows its category and type', async ({ resourcesPage }) => {
    await resourcesPage.expectRows(['Getting started', 'Nutrition guide', 'Billing help']);

    await resourcesPage.expectRowText('Getting started', 'Faqs');
    await resourcesPage.expectRowText('Getting started', 'Client');
    await resourcesPage.expectRowText('Nutrition guide', 'Education');
  });

  test('the Clinic Resources tab lists clinic resources only', async ({ resourcesPage }) => {
    await resourcesPage.selectTab('Clinic Resources');

    await resourcesPage.expectRows(['Clinic setup', 'Staff handbook']);
    expect(mock.callsTo('AllResources').at(-1)?.variables).toMatchObject({
      archived: false,
      resourceType: 'CLINIC',
    });
  });

  test('the Archived tab lists archived resources of any type', async ({ resourcesPage }) => {
    await resourcesPage.selectTab('Archived');

    await resourcesPage.expectRows(['Old policy']);
    const variables = mock.callsTo('AllResources').at(-1)?.variables;
    expect(variables).toMatchObject({ archived: true });
    expect(variables?.resourceType).toBeUndefined();
  });

  test('the category filter narrows the list and is kept in the URL', async ({ resourcesPage }) => {
    await resourcesPage.filterByCategory('FAQS');

    await resourcesPage.expectRows(['Getting started', 'Billing help']);
    await resourcesPage.expectCategoryInUrl('FAQS');
    expect(mock.callsTo('AllResources').at(-1)?.variables).toMatchObject({ category: 'FAQS' });
  });

  test('searching by title narrows the list and is sent to the server', async ({
    resourcesPage,
  }) => {
    await resourcesPage.searchFor('nutrition');

    await resourcesPage.expectRows(['Nutrition guide']);
    expect(mock.callsTo('AllResources').at(-1)?.variables).toMatchObject({ search: 'nutrition' });
  });

  test('the access switch shows each resource state and turns access on', async ({
    resourcesPage,
  }) => {
    await resourcesPage.expectRowsSettled();
    await expect(resourcesPage.accessSwitch('Getting started')).toBeChecked();
    await expect(resourcesPage.accessSwitch('Billing help')).not.toBeChecked();

    await resourcesPage.toggleAccess('Billing help');

    await resourcesPage.expectToast('Resource access updated');
    expect(mock.callsTo('AccessResource')[0]?.variables).toMatchObject({
      id: 'r3',
      isActive: true,
    });
  });

  test('the Add resource drawer Category dropdown can be chosen', async ({ resourcesPage }) => {
    await resourcesPage.openAddDrawer();

    await resourcesPage.choose('Category', 'FAQS');
  });

  test('archiving asks for confirmation first', async ({ resourcesPage }) => {
    await resourcesPage.expectRowsSettled();

    await resourcesPage.chooseRowAction('Getting started', 'Archive');
    await resourcesPage.cancelConfirm('Archive this resource?');

    expect(mock.callsTo('ArchiveResource')).toHaveLength(0);

    await resourcesPage.chooseRowAction('Getting started', 'Archive');
    await resourcesPage.confirm('Archive this resource?', 'Archive');

    expect(mock.callsTo('ArchiveResource')[0]?.variables).toMatchObject({
      archived: true,
      id: 'r1',
    });
  });

  test('an archived resource can be restored without a confirmation', async ({ resourcesPage }) => {
    await resourcesPage.selectTab('Archived');
    await resourcesPage.expectRowsSettled();

    await resourcesPage.chooseRowAction('Old policy', 'Unarchive');

    await expect.poll(() => mock.callsTo('ArchiveResource').length).toBe(1);
    expect(mock.callsTo('ArchiveResource')[0]?.variables).toMatchObject({
      archived: false,
      id: 'r6',
    });
  });
});
