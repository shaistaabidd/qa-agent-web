import { gql } from '@apollo/client';

import { managedUserFields } from '../fragments';

export const ALL_USERS = gql`
  query AllUsers(
    $userType: UserRoleEnum
    $page: Int
    $perPage: Int
    $search: String
    $status: UserAccessStatusEnum
    $pending: Boolean
    $archived: Boolean
  ) {
    allUsers(
      filters: {
        role: $userType
        search: $search
        status: $status
        pending: $pending
        archived: $archived
        page: $page
        perPage: $perPage
      }
    ) {
      count
      nextPage
      prevPage
      totalPages
      allData {
        ${managedUserFields}
      }
    }
  }
`;
