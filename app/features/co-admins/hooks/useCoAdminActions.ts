import type { ApolloCache, DocumentNode } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { useMemo } from 'react';

import {
  ARCHIVE_USER,
  CREATE_INVITATION,
  DELETE_INVITATION,
  RESEND_INVITATION,
  REVOKE_USER_ACCESS,
  UPDATE_CO_ADMIN,
} from '@/graphql/mutations/coAdminMutations';

import { invalidateCoAdminLists } from '../cache';
import { MANAGED_USER_TYPE } from '../constants';
import type { CoAdmin, CoAdminFormValues, CoAdminPhotoChange, InviteResult } from '../types';

export function useCoAdminActions() {
  const client = useApolloClient();

  return useMemo(() => {
    async function mutate(
      mutation: DocumentNode,
      variables: Record<string, unknown>,
      update?: (cache: ApolloCache) => void,
    ) {
      // The caller shows the error toast, so the error link stays quiet to avoid a second one.
      const result = await client.mutate({
        context: { silentErrors: true },
        mutation,
        update,
        variables,
      });
      if (result.error) {
        throw result.error;
      }
      return result.data;
    }

    return {
      async invite(emails: string[]): Promise<InviteResult> {
        const data = (await mutate(
          CREATE_INVITATION,
          { emails, userType: MANAGED_USER_TYPE },
          invalidateCoAdminLists,
        )) as { createInvitation: InviteResult };
        return data.createInvitation;
      },

      async resendInvite(row: CoAdmin): Promise<CoAdmin> {
        const data = (await mutate(RESEND_INVITATION, { id: row.id })) as
          | { resendInvitation?: { user?: Omit<CoAdmin, 'status'> | null } | null }
          | null
          | undefined;
        const user = data?.resendInvitation?.user;
        return user ? { ...user, status: row.status } : row;
      },

      async deleteInvite(row: CoAdmin) {
        await mutate(DELETE_INVITATION, { id: row.id }, invalidateCoAdminLists);
      },

      async setArchived(row: CoAdmin, archived: boolean) {
        await mutate(ARCHIVE_USER, { archived, id: row.id }, invalidateCoAdminLists);
      },

      async setAccess(row: CoAdmin, hasAccess: boolean) {
        await mutate(
          REVOKE_USER_ACCESS,
          { id: row.id, revokeAccess: !hasAccess },
          invalidateCoAdminLists,
        );
      },

      async update(row: CoAdmin, values: CoAdminFormValues, photo: CoAdminPhotoChange) {
        await mutate(
          UPDATE_CO_ADMIN,
          {
            firstName: values.firstName.trim(),
            id: row.id,
            lastName: values.lastName.trim(),
            // Leave `image` out to keep the photo; null removes it.
            ...(photo === undefined ? {} : { image: photo }),
          },
          invalidateCoAdminLists,
        );
      },
    };
  }, [client]);
}

export type CoAdminActions = ReturnType<typeof useCoAdminActions>;
