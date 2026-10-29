import { gql } from '@apollo/client';

import { managedUserFields } from '../fragments';

export const CREATE_INVITATION = gql`
  mutation CreateInvitation($emails: [String!]!, $userType: UserRoleEnum!) {
    createInvitation(input: { emails: $emails, role: $userType }) {
      message
      users {
        email
      }
      rejected {
        email
        message
      }
    }
  }
`;

export const RESEND_INVITATION = gql`
  mutation ResendInvitation($id: ID!) {
    resendInvitation(input: { id: $id }) {
      user {
        ${managedUserFields}
      }
    }
  }
`;

export const DELETE_INVITATION = gql`
  mutation DeleteInvitation($id: ID!) {
    deleteInvitation(input: { id: $id }) {
      message
    }
  }
`;

export const ARCHIVE_USER = gql`
  mutation ArchiveUser($id: ID!, $archived: Boolean!) {
    archiveUser(input: { id: $id, archived: $archived }) {
      user {
        id
      }
    }
  }
`;

export const REVOKE_USER_ACCESS = gql`
  mutation RevokeUserAccess($id: ID!, $revokeAccess: Boolean!) {
    updateUserAccess(input: { id: $id, accessRevoked: $revokeAccess }) {
      user {
        ${managedUserFields}
      }
    }
  }
`;

export const UPDATE_CO_ADMIN = gql`
  mutation UpdateCoAdmin(
    $id: ID
    $firstName: String
    $lastName: String
    $image: Upload
  ) {
    updateUser(
      input: {
        id: $id
        userAttributes: {
          firstName: $firstName
          lastName: $lastName
          image: $image
        }
      }
    ) {
      user {
        ${managedUserFields}
      }
    }
  }
`;
