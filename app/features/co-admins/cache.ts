import type { ApolloCache } from '@apollo/client';

import { evictQueryField } from '@/shared/lib/apolloCache';

const USER_LIST_FIELD = 'allUsers';

/** Use when rows move between tabs or counts change (invite, archive, delete, edit). */
export function invalidateCoAdminLists(cache: ApolloCache) {
  evictQueryField(cache, USER_LIST_FIELD);
}
