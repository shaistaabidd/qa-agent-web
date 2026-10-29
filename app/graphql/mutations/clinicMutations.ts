import { gql } from '@apollo/client';

import {
  clinicDetailFields,
  clinicFields,
  userRecordFields,
  userSummaryFields,
} from '../fragments';

export const CLINIC_ONBOARDING = gql`
  mutation ClinicOnboarding(
    $firstName: String
    $name: String!
    $email: String
    $phone: String
    $address: String
    $city: String
    $state: String
    $zip: String
    $website: String
    $logo: Upload
    $profilePicture: Upload
    $lastName: String
    $theme: String
    $facebookLink: String
    $twitterLink: String
    $instagramLink: String
    $linkedinLink: String
    $tiktokLink: String
    $smsConsent: Boolean
  ) {
    clinicOnboarding(
      input: {
        onboardingAttributes: {
          firstName: $firstName
          name: $name
          email: $email
          phone: $phone
          address: $address
          city: $city
          state: $state
          zip: $zip
          website: $website
          logo: $logo
          profilePicture: $profilePicture
          lastName: $lastName
          theme: $theme
          facebookLink: $facebookLink
          twitterLink: $twitterLink
          instagramLink: $instagramLink
          linkedinLink: $linkedinLink
          tiktokLink: $tiktokLink
          smsConsent: $smsConsent
        }
      }
    ) {
      message
      clinic {
        ${clinicFields}
      }
      user {
        ${userRecordFields}
      }
    }
  }
`;

export const UPDATE_CLINIC = gql`
  mutation UpdateClinic(
    $firstName: String
    $name: String!
    $email: String
    $phone: String
    $address: String
    $city: String
    $state: String
    $zip: String
    $website: String
    $logo: Upload
    $profilePicture: Upload
    $lastName: String
    $theme: String
    $facebookLink: String
    $twitterLink: String
    $instagramLink: String
    $linkedinLink: String
    $tiktokLink: String
    $id: ID
    $revokeAccess: Boolean
  ) {
    updateClinic(
      input: {
        attributes: {
          firstName: $firstName
          name: $name
          email: $email
          phone: $phone
          address: $address
          city: $city
          state: $state
          zip: $zip
          website: $website
          logo: $logo
          profilePicture: $profilePicture
          lastName: $lastName
          theme: $theme
          facebookLink: $facebookLink
          twitterLink: $twitterLink
          instagramLink: $instagramLink
          linkedinLink: $linkedinLink
          tiktokLink: $tiktokLink
        }
        id: $id
        revokeAccess: $revokeAccess
      }
    ) {
      clinic {
        ${clinicDetailFields}
        clinicSuperAdmin {
          ${userSummaryFields}
        }
      }
    }
  }
`;
