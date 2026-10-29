import { gql } from '@apollo/client';

import { runListFields } from '../fragments';

export const DISPATCH_RUN = gql`
  mutation DispatchRun($input: DispatchRunInput!) {
    dispatchRun(input: $input) {
      run {
        ${runListFields}
      }
    }
  }
`;
