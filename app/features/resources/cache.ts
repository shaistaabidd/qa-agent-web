import type { ApolloCache } from '@apollo/client';

import { evictQueryField, patchEntity } from '@/shared/lib/apolloCache';

const RESOURCE_TYPENAME = 'Resource';
const RESOURCE_LIST_FIELD = 'allResources';

/** Use when rows move between lists or counts change (create, archive, unarchive). */
export function invalidateResourceLists(cache: ApolloCache) {
  evictQueryField(cache, RESOURCE_LIST_FIELD);
}

/** Use when a row stays in place and only its own fields change (edit, access). */
export function patchResource(cache: ApolloCache, id: string, fields: Record<string, unknown>) {
  patchEntity(cache, RESOURCE_TYPENAME, id, fields);
}
