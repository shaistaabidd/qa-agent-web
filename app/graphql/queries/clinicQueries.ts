import { gql } from '@apollo/client';

import { clinicDetailFields } from '../fragments';

export const FETCH_CLINIC = gql`
  query FetchClinic {
    fetchClinic {
      ${clinicDetailFields}
    }
  }
`;
