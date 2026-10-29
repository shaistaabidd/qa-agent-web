import type { CrudColumn } from '@/shared/ui/crud';

import type { CoAdmin } from '../types';
import { coAdminLabel, formatCoAdminDate } from '../utils';
import { CoAdminAccessSwitch } from './CoAdminAccessSwitch';
import { CoAdminContact } from './CoAdminContact';
import { CoAdminName } from './CoAdminName';

type BuildCoAdminColumnsOptions = {
  setAccess: (row: CoAdmin, hasAccess: boolean) => Promise<void>;
};

export function buildCoAdminColumns({
  setAccess,
}: BuildCoAdminColumnsOptions): CrudColumn<CoAdmin>[] {
  return [
    {
      className: 'max-w-[320px]',
      header: 'Name',
      key: 'name',
      pairWith: 'status',
      render: (row) => <CoAdminName row={row} />,
    },
    {
      className: 'max-w-[320px]',
      header: 'Contact details',
      key: 'contact',
      render: (row) => <CoAdminContact row={row} />,
    },
    {
      header: 'Access / Invited',
      key: 'status',
      mobileLabel: 'Access',
      render: (row, list) => {
        if (row.status === 'pending') {
          return `Invited ${formatCoAdminDate(row.invitationSentAt)}`;
        }

        if (row.status === 'archived') {
          return 'Archived';
        }

        return (
          <CoAdminAccessSwitch
            checked={!row.revokeAccess}
            key={`${row.id}-${row.revokeAccess}`}
            label={coAdminLabel(row)}
            onChange={async (hasAccess) => {
              await setAccess(row, hasAccess);
              list.replaceItem(row.id, { ...row, revokeAccess: !hasAccess });
            }}
          />
        );
      },
    },
  ];
}
