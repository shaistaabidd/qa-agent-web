import { gql } from '@apollo/client';

import { userAuthFields, userInviteFields, userSignInFields } from '../fragments';

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $passwordConfirmation: String!
    $firstName: String
    $lastName: String
  ) {
    registerUser(
      input: {
        registerAttributes: {
          email: $email
          password: $password
          passwordConfirmation: $passwordConfirmation
          firstName: $firstName
          lastName: $lastName
        }
      }
    ) {
      message
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { loginAttributes: { email: $email, password: $password } }) {
      message
      token
      user {
        ${userSignInFields}
      }
    }
  }
`;

export const VALIDATE_OTP = gql`
  mutation ValidateOtp($otpCode: String!, $email: String!, $purpose: SignInPurposeEnum!) {
    validateOtp(input: { otpCode: $otpCode, email: $email, purpose: $purpose }) {
      token
      resetPasswordToken
      user {
        ${userSignInFields}
      }
    }
  }
`;

/** Swaps the one-time code from the API's Google callback (with this browser's nonce) for a session. */
export const SIGN_IN_WITH_GOOGLE = gql`
  mutation SignInWithGoogle($code: String!, $nonce: String!) {
    signInWithGoogle(input: { code: $code, nonce: $nonce }) {
      token
      user {
        ${userAuthFields}
      }
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendOtp($email: String!, $purpose: SignInPurposeEnum!) {
    resendOtp(input: { email: $email, purpose: $purpose }) {
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation SendResetPasswordInstructions($email: String!) {
    sendResetPasswordInstructions(input: { email: $email }) {
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation SetPassword(
    $password: String!
    $passwordConfirmation: String!
    $resetPasswordToken: String!
  ) {
    setPassword(
      input: {
        setPasswordAttributes: {
          password: $password
          passwordConfirmation: $passwordConfirmation
          resetPasswordToken: $resetPasswordToken
        }
      }
    ) {
      token
      user {
        ${userAuthFields}
      }
    }
  }
`;

export const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($password: String!, $passwordConfirmation: String!, $token: String!) {
    acceptInvitation(
      input: {
        setPasswordAttributes: {
          passwordConfirmation: $passwordConfirmation
          password: $password
          token: $token
        }
      }
    ) {
      token
      user {
        ${userInviteFields}
      }
    }
  }
`;

export const REQUEST_EMAIL_CHANGE = gql`
  mutation RequestEmailChange($email: String!, $currentPassword: String!) {
    requestEmailChange(input: { email: $email, currentPassword: $currentPassword }) {
      message
      user {
        ${userAuthFields}
      }
    }
  }
`;

export const RESEND_EMAIL_CHANGE_CODE = gql`
  mutation ResendEmailChangeCode {
    resendEmailChangeCode(input: {}) {
      message
    }
  }
`;

export const CONFIRM_EMAIL_CHANGE = gql`
  mutation ConfirmEmailChange($otpCode: String!) {
    confirmEmailChange(input: { otpCode: $otpCode }) {
      user {
        ${userAuthFields}
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout($clientMutationId: String) {
    logout(input: { clientMutationId: $clientMutationId }) {
      message
      success
    }
  }
`;

export const IMPERSONATE_USER = gql`
  mutation ImpersonateUser($userId: ID!) {
    impersonateUser(input: { userId: $userId }) {
      token
      user {
        ${userAuthFields}
      }
    }
  }
`;
