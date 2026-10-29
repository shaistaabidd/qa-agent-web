import { parseAsString, useQueryState } from 'nuqs';

import { isIsoDate } from './dates';

const URL_OPTIONS = { history: 'replace' as const };

export function useDateRangeFilters() {
  const [rawStartDate, setStartDate] = useQueryState(
    'start',
    parseAsString.withDefault('').withOptions(URL_OPTIONS),
  );
  const [rawEndDate, setEndDate] = useQueryState(
    'end',
    parseAsString.withDefault('').withOptions(URL_OPTIONS),
  );

  // A hand-edited URL can hold anything; only real days become filters.
  const startDate = isIsoDate(rawStartDate) ? rawStartDate : '';
  const endDate = isIsoDate(rawEndDate) ? rawEndDate : '';
  const dateFilterCount = (startDate ? 1 : 0) + (endDate ? 1 : 0);

  return {
    dateFilterCount,
    endDate,
    setEndDate,
    setStartDate,
    startDate,
  };
}
