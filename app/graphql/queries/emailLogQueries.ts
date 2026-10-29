import { gql } from '@apollo/client';

import { connectionFields, emailLogFields, emailLogListFields } from '../fragments';

export const ALL_EMAIL_LOGS = gql`
  query AllEmailLogs($filter: EmailLogFilterInput) {
    allEmailLogs(filter: $filter) {
      ${connectionFields}
      allData {
        ${emailLogListFields}
      }
    }
  }
`;

export const EMAIL_LOG_DETAIL = gql`
  query EmailLogDetail($id: ID!) {
    fetchEmailLog(id: $id) {
      ${emailLogFields}
    }
  }
`;
