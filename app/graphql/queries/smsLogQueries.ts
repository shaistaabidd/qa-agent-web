import { gql } from '@apollo/client';

import { connectionFields, smsLogFields } from '../fragments';

export const ALL_SMS_LOGS = gql`
  query AllSmsLogs($filter: SmsLogFilterInput) {
    allSmsLogs(filter: $filter) {
      ${connectionFields}
      allData {
        createdAt
        ${smsLogFields}
      }
    }
  }
`;

export const SMS_LOG_DETAIL = gql`
  query FetchSmsLog($id: ID!) {
    fetchSmsLog(id: $id) {
      ${smsLogFields}
    }
  }
`;
