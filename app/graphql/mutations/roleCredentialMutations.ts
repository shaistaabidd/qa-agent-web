import { gql } from '@apollo/client';

export const SET_ROLE_CREDENTIAL = gql`
  mutation SetRoleCredential($input: SetRoleCredentialInput!) {
    setRoleCredential(input: $input) {
      roleCredential {
        createdAt
        id
        roleName
        updatedAt
      }
    }
  }
`;
