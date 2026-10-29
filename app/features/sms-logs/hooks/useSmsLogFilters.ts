import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';

import { useDateRangeFilters } from '@/shared/lib/use-date-range-filters';
import { SEARCH_PARAM } from '@/shared/ui/search';

import type { SmsLogListFilters } from '../types';
import { isSmsLogStatus, isSmsMessageType } from '../utils';

export function useSmsLogFilters() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsString.withDefault('all').withOptions({ history: 'replace' }),
  );
  const [messageType, setMessageType] = useQueryState(
    'type',
    parseAsString.withDefault('all').withOptions({ history: 'replace' }),
  );
  const [search, setSearch] = useQueryState(
    SEARCH_PARAM,
    parseAsString.withDefault('').withOptions({ history: 'replace' }),
  );
  const { dateFilterCount, endDate, setEndDate, setStartDate, startDate } = useDateRangeFilters();

  const filters = useMemo<SmsLogListFilters>(
    () => ({
      endDate,
      messageType,
      startDate,
      status,
    }),
    [endDate, messageType, startDate, status],
  );

  const activeFilterCount =
    (isSmsLogStatus(status) ? 1 : 0) + (isSmsMessageType(messageType) ? 1 : 0) + dateFilterCount;

  function clearFilters() {
    void setSearch(null);
    void setStatus('all');
    void setMessageType('all');
    void setStartDate('');
    void setEndDate('');
  }

  function applyFilters(next: SmsLogListFilters) {
    void setStatus(next.status || 'all');
    void setMessageType(next.messageType || 'all');
    void setStartDate(next.startDate);
    void setEndDate(next.endDate);
  }

  return {
    activeFilterCount,
    applyFilters,
    canReset: activeFilterCount > 0 || search !== '',
    clearFilters,
    endDate,
    filters,
    messageType,
    startDate,
    status,
  };
}
