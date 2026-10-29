import { gql } from '@apollo/client';

import { sessionUserFields } from '../fragments';

export const FETCH_USER = gql`
  query FetchUser($fetchUserId: ID) {
    fetchUser(id: $fetchUserId) {
      ${sessionUserFields}
    }
  }
`;
