import { useQuery } from '@apollo/client/react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';

import { ALL_EMAIL_LOGS } from '@/graphql/queries/emailLogQueries';
import { useDateRangeFilters } from '@/shared/lib/use-date-range-filters';

import { EMAIL_LOGS_PER_PAGE } from '../constants';
import type { EmailLog, EmailLogFilter } from '../types';
import { isEmailLogStatus } from '../utils';

type AllEmailLogsData = {
  allEmailLogs?: {
    allData?: EmailLog[] | null;
    count?: number | null;
    totalPages?: number | null;
  } | null;
};

function buildFilter(
  search: string,
  status: string,
  startDate: string,
  endDate: string,
  page: number,
): EmailLogFilter {
  const filter: EmailLogFilter = {
    page,
    perPage: EMAIL_LOGS_PER_PAGE,
  };

  const keyword = search.trim();
  if (keyword) {
    filter.search = keyword;
  }

  if (isEmailLogStatus(status)) {
    filter.status = status;
  }

  if (startDate) {
    filter.startDate = startDate;
  }

  if (endDate) {
    filter.endDate = endDate;
  }

  return filter;
}

export function useEmailLogs() {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ history: 'replace' }),
  );
  const [urlPage, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'replace' }),
  );
  const [status, setStatus] = useQueryState(
    'status',
    parseAsString.withDefault('all').withOptions({ history: 'replace' }),
  );
  const { dateFilterCount, endDate, setEndDate, setStartDate, startDate } = useDateRangeFilters();

  // The search box writes the URL on its own, so a page from before the search changed is stale.
  const [pageSearch, setPageSearch] = useState(search);
  const searchChanged = search !== pageSearch;
  const page = searchChanged ? 1 : urlPage;

  if (searchChanged && urlPage === 1) {
    setPageSearch(search);
  }

  useEffect(() => {
    if (searchChanged && urlPage !== 1) {
      void setPage(1);
    }
  }, [searchChanged, setPage, urlPage]);

  function goToPage(next: number) {
    setPageSearch(search);
    return setPage(next);
  }

  const filter = useMemo(
    () => buildFilter(search, status, startDate, endDate, page),
    [endDate, page, search, startDate, status],
  );

  const { data, error, loading, refetch } = useQuery<AllEmailLogsData, { filter: EmailLogFilter }>(
    ALL_EMAIL_LOGS,
    {
      context: { silentErrors: true },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      variables: { filter },
    },
  );

  const payload = data?.allEmailLogs;
  const emailLogs = Array.isArray(payload?.allData) ? payload.allData : [];
  const totalPages = payload?.totalPages || 1;
  const count = payload?.count ?? emailLogs.length;

  const pastLastPage =
    !loading && !error && data !== undefined && emailLogs.length === 0 && page > 1;

  useEffect(() => {
    if (pastLastPage) {
      void setPage(1);
    }
  }, [pastLastPage, setPage]);

  const activeFilterCount = (isEmailLogStatus(status) ? 1 : 0) + dateFilterCount;

  function clearFilters() {
    void setSearch(null);
    void setStatus('all');
    void setStartDate('');
    void setEndDate('');
    void setPage(1);
  }

  function applyFilters(next: { endDate: string; startDate: string; status: string }) {
    void setStatus(next.status || 'all');
    void setStartDate(next.startDate);
    void setEndDate(next.endDate);
    void setPage(1);
  }

  const showingFrom = count === 0 ? 0 : (page - 1) * EMAIL_LOGS_PER_PAGE + 1;
  const showingTo = count === 0 ? 0 : showingFrom + emailLogs.length - 1;

  return {
    activeFilterCount,
    applyFilters,
    canReset: activeFilterCount > 0 || search !== '',
    clearFilters,
    count,
    emailLogs,
    endDate,
    error,
    loading,
    page,
    refetch,
    search,
    setPage: goToPage,
    showingFrom,
    showingTo,
    startDate,
    status,
    totalPages,
  };
}
