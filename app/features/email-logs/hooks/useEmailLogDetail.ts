import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router';

import { EMAIL_LOG_DETAIL } from '@/graphql/queries/emailLogQueries';

import type { EmailLog } from '../types';

type EmailLogDetailData = {
  fetchEmailLog?: EmailLog | null;
};

export function useEmailLogDetail() {
  const { id } = useParams();

  const { data, error, loading } = useQuery(EMAIL_LOG_DETAIL, {
    context: { silentErrors: true },
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    skip: !id,
    variables: { id },
  });

  return {
    emailLog: (data as EmailLogDetailData | null | undefined)?.fetchEmailLog ?? null,
    error,
    loading,
  };
}
