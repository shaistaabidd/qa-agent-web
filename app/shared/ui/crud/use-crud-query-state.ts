import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import * as React from 'react';

import { useLatestRef } from '@/shared/lib/use-latest-ref';
import { SEARCH_PARAM } from '@/shared/ui/search';

import type { CrudSortOrder, CrudSortState } from './types';

export type UseCrudQueryStateOptions = {
  pageSize: number;
  /** When set, a `pageSize` in the URL that is not listed here falls back to `pageSize`. */
  pageSizeOptions?: number[];
  searchParam?: string;
  searchEnabled?: boolean;
  paramPrefix?: string;
  initialTab: string | null;
  /** When set, a `tab` that is not listed here falls back to `initialTab`. */
  tabValues?: string[];
  activeTab?: string | null;
  onTabChange?: (tab: string) => void;
  getScrollContainer: () => HTMLElement | null;
};

const URL_OPTIONS = { history: 'replace' as const };
const SORT_ORDERS = ['asc', 'desc'] as const satisfies readonly CrudSortOrder[];

function crudParam(prefix: string | undefined, name: string) {
  const trimmed = prefix?.trim();
  return trimmed ? `${trimmed}_${name}` : name;
}

/** Reads the list state from the URL and keeps every value inside what the screen allows. */
export function useCrudQueryState({
  pageSize: defaultPageSize,
  pageSizeOptions,
  searchParam = SEARCH_PARAM,
  searchEnabled = true,
  paramPrefix,
  initialTab,
  tabValues,
  activeTab: activeTabProp,
  onTabChange,
  getScrollContainer,
}: UseCrudQueryStateOptions) {
  const [pageQuery, setPageQuery] = useQueryState(
    crudParam(paramPrefix, 'page'),
    parseAsInteger.withDefault(1).withOptions(URL_OPTIONS),
  );
  const [pageSizeQuery, setPageSizeQuery] = useQueryState(
    crudParam(paramPrefix, 'pageSize'),
    parseAsInteger.withDefault(defaultPageSize).withOptions(URL_OPTIONS),
  );
  const [urlSearch] = useQueryState(
    searchParam,
    parseAsString.withDefault('').withOptions(URL_OPTIONS),
  );
  const [sortField, setSortField] = useQueryState(
    crudParam(paramPrefix, 'sort'),
    parseAsString.withOptions(URL_OPTIONS),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    crudParam(paramPrefix, 'order'),
    parseAsStringLiteral(SORT_ORDERS).withOptions(URL_OPTIONS),
  );
  const [urlTab, setUrlTab] = useQueryState(
    crudParam(paramPrefix, 'tab'),
    parseAsString.withDefault(initialTab ?? '').withOptions(URL_OPTIONS),
  );

  const page = pageQuery > 0 ? pageQuery : 1;
  const pageSizeValid =
    pageSizeQuery > 0 && (!pageSizeOptions?.length || pageSizeOptions.includes(pageSizeQuery));
  const pageSize = pageSizeValid ? pageSizeQuery : defaultPageSize;
  const search = searchEnabled ? urlSearch.trim() : '';

  const sort = React.useMemo<CrudSortState>(() => {
    if (!sortField) return null;
    return { field: sortField, order: sortOrder ?? 'asc' };
  }, [sortField, sortOrder]);

  const tabControlled = activeTabProp !== undefined;
  const isKnownTab = (value: string | null) =>
    value != null && (!tabValues?.length || tabValues.includes(value));
  const candidateTab = tabControlled ? activeTabProp : urlTab || null;
  const activeTab = isKnownTab(candidateTab) ? candidateTab : initialTab;
  const urlTabValid = !urlTab || isKnownTab(urlTab);

  // A bad value from an old link is dropped from the URL instead of being sent to the backend.
  React.useEffect(() => {
    if (!pageSizeValid) void setPageSizeQuery(null);
  }, [pageSizeValid, setPageSizeQuery]);

  React.useEffect(() => {
    if (!urlTabValid && !tabControlled) void setUrlTab(null);
  }, [setUrlTab, tabControlled, urlTabValid]);

  const getScrollContainerRef = useLatestRef(getScrollContainer);

  const setPage = React.useCallback(
    (next: number) => {
      void setPageQuery(Math.max(1, next));
    },
    [setPageQuery],
  );

  const setPageSize = React.useCallback(
    (next: number) => {
      void setPageSizeQuery(Math.max(1, next));
      void setPageQuery(1);
    },
    [setPageQuery, setPageSizeQuery],
  );

  const setSort = React.useCallback(
    (next: CrudSortState) => {
      void setSortField(next?.field ?? null);
      void setSortOrder(next?.order ?? null);
    },
    [setSortField, setSortOrder],
  );

  const setActiveTab = React.useCallback(
    (next: string | null) => {
      const scroller = getScrollContainerRef.current();
      const scrollTop = scroller?.scrollTop ?? 0;
      const restoreScroll = () => {
        if (!scroller) return;
        scroller.scrollTop = scrollTop;
      };

      if (tabControlled) {
        if (next != null) onTabChange?.(next);
        requestAnimationFrame(restoreScroll);
        return;
      }
      void setUrlTab(next);
      void setPageQuery(1);
      requestAnimationFrame(restoreScroll);
    },
    [getScrollContainerRef, onTabChange, setPageQuery, setUrlTab, tabControlled],
  );

  return {
    activeTab,
    page,
    pageSize,
    search,
    setActiveTab,
    setPage,
    setPageSize,
    setSort,
    sort,
  };
}
