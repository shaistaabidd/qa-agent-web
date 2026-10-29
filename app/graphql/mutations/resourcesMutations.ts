import { gql } from '@apollo/client';

import { resourceFields } from '../fragments';

export const CREATE_RESOURCE = gql`
  mutation CreateResource(
    $title: String!
    $category: ResourceCategoryEnum!
    $description: String
    $resourceType: ResourceTypeEnum!
    $videoLink: String
    $pdfFile: Upload
  ) {
    createResource(
      input: {
        resourceAttributes: {
          title: $title
          category: $category
          description: $description
          resourceType: $resourceType
          videoLink: $videoLink
          pdfFile: $pdfFile
        }
      }
    ) {
      resource {
        ${resourceFields}
      }
    }
  }
`;

export const UPDATE_RESOURCE = gql`
  mutation UpdateResource(
    $id: ID!
    $title: String!
    $category: ResourceCategoryEnum!
    $description: String
    $resourceType: ResourceTypeEnum!
    $videoLink: String
    $pdfFile: Upload
  ) {
    updateResource(
      input: {
        resourceAttributes: {
          id: $id
          title: $title
          category: $category
          description: $description
          resourceType: $resourceType
          videoLink: $videoLink
          pdfFile: $pdfFile
        }
      }
    ) {
      resource {
        ${resourceFields}
      }
    }
  }
`;

export const ACCESS_RESOURCE = gql`
  mutation AccessResource($id: ID!, $isActive: Boolean!) {
    updateResource(input: { resourceAttributes: { id: $id, isActive: $isActive } }) {
      resource {
        id
      }
    }
  }
`;

export const ARCHIVE_RESOURCE = gql`
  mutation ArchiveResource($id: ID!, $archived: Boolean!) {
    updateResource(input: { resourceAttributes: { id: $id, archived: $archived } }) {
      resource {
        id
      }
    }
  }
`;
