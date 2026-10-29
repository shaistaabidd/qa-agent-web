import { gql } from '@apollo/client';

import { scopeFeatureFields } from '../fragments';

export const APPROVE_SCOPE_FEATURE = gql`
  mutation ApproveScopeFeature($input: ApproveScopeFeatureInput!) {
    approveScopeFeature(input: $input) {
      scopeFeature {
        ${scopeFeatureFields}
      }
    }
  }
`;

export const SCAN_CODEBASE = gql`
  mutation ScanCodebase($input: ScanCodebaseInput!) {
    scanCodebase(input: $input) {
      message
      success
    }
  }
`;
