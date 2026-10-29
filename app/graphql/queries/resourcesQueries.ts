import { gql } from '@apollo/client';

import { resourceFields } from '../fragments';

export const ALL_RESOURCES = gql`
  query AllResources(
    $search: String
    $resourceType: ResourceFilterEnum
    $category: ResourceCategoryEnum
    $archived: Boolean
    $page: Int
    $perPage: Int
  ) {
    allResources(
      filters: {
        search: $search
        resourceType: $resourceType
        category: $category
        archived: $archived
        page: $page
        perPage: $perPage
      }
    ) {
      count
      nextPage
      prevPage
      totalPages
      allData {
        category
        createdAt
        id
        isActive
        title
        resourceType
        position
      }
    }
  }
`;

export const FETCH_RESOURCE = gql`
  query FetchResource($id: ID!) {
    fetchResource(id: $id) {
      ${resourceFields}
    }
  }
`;
