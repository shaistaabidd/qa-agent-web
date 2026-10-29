import { gql } from '@apollo/client';

import { sessionUserFields, userAuthFields } from '../fragments';

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID
    $firstName: String
    $lastName: String
    $phone: String
    $image: Upload
  ) {
    updateUser(
      input: {
        id: $id
        userAttributes: {
          firstName: $firstName
          lastName: $lastName
          phone: $phone
          image: $image
        }
      }
    ) {
      user {
        ${sessionUserFields}
      }
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword(
    $password: String!
    $currentPassword: String!
    $passwordConfirmation: String!
  ) {
    updatePassword(
      input: {
        password: $password
        currentPassword: $currentPassword
        passwordConfirmation: $passwordConfirmation
      }
    ) {
      success
    }
  }
`;

export const REMOVE_IMAGE = gql`
  mutation RemoveImage {
    updateUser(input: { userAttributes: { image: null } }) {
      user {
        ${userAuthFields}
      }
    }
  }
`;

/** Saves an onboarding step and returns the user with their updated onboarding progress. */
export const SAVE_ONBOARDING_STEP = gql`
  mutation SaveOnboardingStep($attributes: UserAttributesInput!) {
    updateUser(input: { userAttributes: $attributes }) {
      user {
        ${sessionUserFields}
      }
    }
  }
`;
