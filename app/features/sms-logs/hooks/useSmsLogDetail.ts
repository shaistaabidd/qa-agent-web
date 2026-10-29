import { useQuery } from '@apollo/client/react';

import { SMS_LOG_DETAIL } from '@/graphql/queries/smsLogQueries';

import type { SmsLog } from '../types';
import { smsLogMatchesDetail } from '../utils';

type SmsLogDetailData = {
  fetchSmsLog?: SmsLog | null;
};

export function useSmsLogDetail(id: string | null, open: boolean) {
  const { data, error, loading } = useQuery(SMS_LOG_DETAIL, {
    context: { silentErrors: true },
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    skip: !open || !id,
    variables: { id: id ?? '' },
  });

  const smsLog = (data as SmsLogDetailData | null | undefined)?.fetchSmsLog ?? null;

  return {
    error,
    loading,
    smsLog: smsLogMatchesDetail(smsLog, id) ? smsLog : null,
  };
}
