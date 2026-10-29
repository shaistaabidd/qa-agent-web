import type { ApolloCache } from '@apollo/client';

/**
 * Drops every cached variant (any page, search, or filter) of a root query field.
 * The next read of that field goes to the network.
 */
export function evictQueryField(cache: ApolloCache, fieldName: string) {
  cache.evict({ fieldName, id: 'ROOT_QUERY' });
  cache.gc();
}

/**
 * Writes new field values onto one normalized entity. Every cached list that
 * contains it reflects the change without another request.
 */
export function patchEntity(
  cache: ApolloCache,
  typename: string,
  id: string,
  fields: Record<string, unknown>,
) {
  const entityId = cache.identify({ __typename: typename, id });
  if (!entityId) {
    return;
  }

  cache.modify({
    fields: Object.fromEntries(Object.keys(fields).map((name) => [name, () => fields[name]])),
    id: entityId,
  });
}
