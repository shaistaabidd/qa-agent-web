import { gql } from '@apollo/client';

export const VALIDATE_INVITATION_TOKEN = gql`
  query ValidateInvitationToken($token: String!) {
    validateInvitationToken(token: $token) {
      valid
      error
    }
  }
`;
