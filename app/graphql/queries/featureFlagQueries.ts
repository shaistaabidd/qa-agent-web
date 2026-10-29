import { gql, type TypedDocumentNode } from '@apollo/client';

import type { FeatureFlagRole, FeatureFlags, PublicFeatureFlags } from '@/features/feature-flags';

import { featureFlagFields } from '../fragments';

/** Signed-out pages only: the flags saas-api shares without sign-in, for the sign-up role. */
export const FETCH_PUBLIC_FEATURE_FLAGS: TypedDocumentNode<
  { fetchPublicFeatureFlags?: PublicFeatureFlags | null },
  Record<string, never>
> = gql`
  query FetchPublicFeatureFlags {
    fetchPublicFeatureFlags {
      googleSignInEnabled
      otpEnabled
      signUpEnabled
    }
  }
`;

/** Signed in: every flag as it applies to users of `role` (e.g. can they be invited). */
export const FETCH_FEATURE_FLAGS_FOR_ROLE: TypedDocumentNode<
  { fetchFeatureFlags?: FeatureFlags | null },
  { role?: FeatureFlagRole | null }
> = gql`
  query FetchFeatureFlags($role: UserRoleEnum) {
    fetchFeatureFlags(role: $role) {
      ${featureFlagFields}
    }
  }
`;
