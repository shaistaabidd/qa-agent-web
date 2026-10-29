import type { ApolloCache, DocumentNode } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { useMemo } from 'react';

import {
  ACCESS_RESOURCE,
  ARCHIVE_RESOURCE,
  CREATE_RESOURCE,
  UPDATE_RESOURCE,
} from '@/graphql/mutations/resourcesMutations';

import { invalidateResourceLists, patchResource } from '../cache';
import type { Resource, ResourceFormValues } from '../types';

type ResourcePayload = Record<string, { resource?: Omit<Resource, 'archived'> | null } | null>;

function toVariables(values: ResourceFormValues) {
  return {
    category: values.category,
    description: values.description.trim() || undefined,
    pdfFile: values.file ?? undefined,
    resourceType: values.resourceType,
    title: values.title.trim(),
    videoLink: values.videoLink.trim() || undefined,
  };
}

export function useResourceActions() {
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
      return result.data as ResourcePayload | null | undefined;
    }

    function readResource(data: ResourcePayload | null | undefined, field: string): Resource {
      const resource = data?.[field]?.resource;
      if (!resource) {
        throw new Error('Something went wrong. Please try again.');
      }
      return { ...resource, archived: false };
    }

    return {
      async create(values: ResourceFormValues) {
        const data = await mutate(CREATE_RESOURCE, toVariables(values), invalidateResourceLists);
        return readResource(data, 'createResource');
      },

      async update(row: Resource, values: ResourceFormValues) {
        // Always drop cached lists: the edit may move the row to another tab, filter or search.
        const data = await mutate(
          UPDATE_RESOURCE,
          { ...toVariables(values), id: row.id },
          invalidateResourceLists,
        );
        return readResource(data, 'updateResource');
      },

      async setArchived(row: Resource, archived: boolean) {
        await mutate(ARCHIVE_RESOURCE, { archived, id: row.id }, invalidateResourceLists);
      },

      async setAccess(id: string, isActive: boolean) {
        await mutate(ACCESS_RESOURCE, { id, isActive }, (cache) =>
          patchResource(cache, id, { isActive }),
        );
      },
    };
  }, [client]);
}
