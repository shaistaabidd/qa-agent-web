import { useMemo } from 'react';

import { useImpersonation } from '@/features/auth';
import { useRoleFeatureFlags } from '@/features/feature-flags';
import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import type { CrudAction } from '@/shared/ui/crud';
import { CrudScreen } from '@/shared/ui/crud';

import { buildCoAdminColumns } from './components/coAdminColumns';
import { CoAdminEditDrawer } from './components/CoAdminEditDrawer';
import { InviteCoAdminDialog } from './components/InviteCoAdminDialog';
import { CO_ADMIN_TAB_ACTIVE, CO_ADMIN_TABS, MANAGED_USER_TYPE } from './constants';
import { useCoAdminActions } from './hooks/useCoAdminActions';
import { useCoAdmins } from './hooks/useCoAdmins';
import type { CoAdmin } from './types';
import { coAdminLabel } from './utils';

export function CoAdminsPage() {
  // Whether users of the role this page invites can be invited, not the admin's own flags.
  const { isEnabled, refresh: refreshFlags } = useRoleFeatureFlags(MANAGED_USER_TYPE);
  const fetchPage = useCoAdmins();
  const coAdminActions = useCoAdminActions();
  const { impersonate } = useImpersonation();

  const columns = useMemo(
    () => buildCoAdminColumns({ setAccess: coAdminActions.setAccess }),
    [coAdminActions.setAccess],
  );

  const actions = useMemo<CrudAction<CoAdmin>[]>(
    () => [
      {
        // The API decides per user (role and per-user flag); it refuses anyone else anyway.
        isVisible: (row) =>
          row.status === 'active' &&
          !row.revokeAccess &&
          row.featureFlags?.impersonationEnabled === true,
        key: 'impersonate',
        label: 'Impersonate',
        onClick: async (row, list) => {
          // Refused (the flag or the user changed since the list loaded): show what is allowed now.
          if (!(await impersonate(row.id))) {
            list.refetch();
            refreshFlags();
          }
        },
        variant: 'outline',
      },
      {
        confirm: {
          confirmLabel: 'Archive',
          confirmingLabel: 'Archiving…',
          description: 'This user will lose access and move to the Archived tab.',
          title: 'Archive this user?',
        },
        isVisible: (row) => row.status === 'active',
        key: 'archive',
        label: 'Archive',
        onClick: async (row, list) => {
          await coAdminActions.setArchived(row, true);
          list.refetch();
        },
        variant: 'outline',
      },
      {
        confirm: {
          confirmLabel: 'Unarchive',
          confirmingLabel: 'Unarchiving…',
          description: 'This user will move back to the Active tab.',
          title: 'Unarchive this user?',
        },
        isVisible: (row) => row.status === 'archived',
        key: 'unarchive',
        label: 'Unarchive',
        onClick: async (row, list) => {
          await coAdminActions.setArchived(row, false);
          list.refetch();
        },
        variant: 'outline',
      },
      {
        isVisible: (row) => row.status === 'pending',
        key: 'resend',
        label: 'Resend invite',
        onClick: async (row, list) => {
          list.replaceItem(row.id, await coAdminActions.resendInvite(row));
        },
        variant: 'outline',
      },
      {
        confirm: {
          confirmLabel: 'Delete',
          confirmingLabel: 'Deleting…',
          description: 'The invitation link will stop working.',
          title: 'Delete this invitation?',
        },
        isVisible: (row) => row.status === 'pending',
        key: 'delete-invite',
        label: 'Delete invite',
        onClick: async (row, list) => {
          await coAdminActions.deleteInvite(row);
          list.refetch();
        },
        variant: 'destructive',
      },
    ],
    [coAdminActions, impersonate, refreshFlags],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
      >
        <CrudScreen<CoAdmin>
          actions={actions}
          columns={columns}
          create={
            // invitations_enabled is off for the role this page invites: the API would refuse.
            isEnabled('invitationsEnabled')
              ? {
                  addLabel: 'Invite user',
                  render: (api) => (
                    <InviteCoAdminDialog
                      {...api}
                      actions={coAdminActions}
                      onInviteFailed={refreshFlags}
                    />
                  ),
                  title: 'Invite user',
                }
              : undefined
          }
          description="Invite and manage the users of the platform."
          edit={{
            isVisible: (row) => row.status === 'active',
            render: (api) => (
              <CoAdminEditDrawer key={api.row.id} {...api} actions={coAdminActions} />
            ),
            title: 'Edit user',
          }}
          empty={{ description: 'No users found.', title: 'No users' }}
          entityLabel="user"
          fetchPage={fetchPage}
          getRowId={(row) => row.id}
          getRowLabel={coAdminLabel}
          initialTab={CO_ADMIN_TAB_ACTIVE}
          search={{ debounceMs: 400, placeholder: 'Search by name or email' }}
          tabs={CO_ADMIN_TABS}
          title="Users"
        />
      </div>
    </div>
  );
}
