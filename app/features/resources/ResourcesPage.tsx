import { useMemo } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import type { CrudAction } from '@/shared/ui/crud';
import { CrudScreen } from '@/shared/ui/crud';

import { ResourceCategoryFilter } from './components/ResourceCategoryFilter';
import { buildResourceColumns } from './components/resourceColumns';
import { ResourceCreateDrawer } from './components/ResourceCreateDrawer';
import { ResourceEditDrawer } from './components/ResourceEditDrawer';
import { RESOURCE_TAB_CLIENT, RESOURCE_TABS } from './constants';
import { useResourceActions } from './hooks/useResourceActions';
import { useResourceFilters } from './hooks/useResourceFilters';
import { useResources } from './hooks/useResources';
import type { Resource } from './types';

export function ResourcesPage() {
  const fetchPage = useResources();
  const resourceActions = useResourceActions();
  const { category, filters, setCategory } = useResourceFilters();

  const columns = useMemo(
    () => buildResourceColumns(resourceActions.setAccess),
    [resourceActions.setAccess],
  );

  const actions = useMemo<CrudAction<Resource>[]>(
    () => [
      {
        confirm: {
          confirmLabel: 'Archive',
          confirmingLabel: 'Archiving…',
          description: 'This resource will move to the Archived tab.',
          title: 'Archive this resource?',
        },
        isVisible: (row) => !row.archived,
        key: 'archive',
        label: 'Archive',
        onClick: async (row, list) => {
          await resourceActions.setArchived(row, true);
          list.refetch();
        },
        variant: 'outline',
      },
      {
        isVisible: (row) => row.archived,
        key: 'unarchive',
        label: 'Unarchive',
        onClick: async (row, list) => {
          await resourceActions.setArchived(row, false);
          list.refetch();
        },
        variant: 'outline',
      },
    ],
    [resourceActions],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
      >
        <CrudScreen<Resource>
          actions={actions}
          columns={columns}
          create={{
            addLabel: 'Add resource',
            render: (api) => <ResourceCreateDrawer {...api} actions={resourceActions} />,
            title: 'Add resource',
          }}
          description="Manage the resources available to clients and clinics."
          edit={{
            isVisible: (row) => !row.archived,
            render: (api) => <ResourceEditDrawer {...api} actions={resourceActions} />,
            title: 'Edit resource',
          }}
          empty={{ description: 'No resources found.', title: 'No resources' }}
          entityLabel="resource"
          fetchPage={fetchPage}
          filters={filters}
          getRowId={(row) => row.id}
          getRowLabel={(row) => row.title}
          initialTab={RESOURCE_TAB_CLIENT}
          search={{ debounceMs: 400, placeholder: 'Search resources by title' }}
          tabs={RESOURCE_TABS}
          title="Resources"
          toolbar={<ResourceCategoryFilter onChange={setCategory} value={category} />}
        />
      </div>
    </div>
  );
}
