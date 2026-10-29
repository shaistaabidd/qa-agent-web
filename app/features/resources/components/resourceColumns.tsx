import type { CrudColumn } from '@/shared/ui/crud';

import type { Resource } from '../types';
import { formatResourceDate, formatResourceLabel } from '../utils';
import { ResourceAccessSwitch } from './ResourceAccessSwitch';
import { ResourceTitle } from './ResourceTitle';

export function buildResourceColumns(
  setAccess: (id: string, isActive: boolean) => Promise<void>,
): CrudColumn<Resource>[] {
  return [
    {
      header: 'Title',
      key: 'title',
      pairWith: 'isActive',
      render: (row) => <ResourceTitle title={row.title} />,
    },
    {
      header: 'Category',
      key: 'category',
      render: (row) => formatResourceLabel(row.category),
    },
    {
      header: 'Type',
      key: 'resourceType',
      render: (row) => formatResourceLabel(row.resourceType),
    },
    {
      header: 'Created on',
      key: 'createdAt',
      render: (row) => formatResourceDate(row.createdAt),
    },
    {
      header: 'Access',
      key: 'isActive',
      mobileLabel: 'Access',
      render: (row, list) =>
        row.archived ? (
          '—'
        ) : (
          <ResourceAccessSwitch
            checked={row.isActive}
            key={`${row.id}-${row.isActive}`}
            label={row.title}
            onChange={async (isActive) => {
              await setAccess(row.id, isActive);
              // Flipping access cannot move the row, so patching it in place is safe.
              list.replaceItem(row.id, { ...row, isActive });
            }}
          />
        ),
    },
  ];
}
