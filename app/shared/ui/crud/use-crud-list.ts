import * as React from 'react';

import { getMessageString } from '@/shared/lib/getMessageString';
import { useLatestRef } from '@/shared/lib/use-latest-ref';

import type { CrudFilters, CrudListMutators, CrudPageParams, CrudPageResult } from './types';
import { useCrudQueryState } from './use-crud-query-state';

export type UseCrudListOptions<T> = {
  fetchPage: (params: CrudPageParams) => Promise<CrudPageResult<T>>;
  getItemId: (item: T) => string;
  pageSize?: number;
  /** Allowed page sizes. A `pageSize` in the URL that is not listed falls back to `pageSize`. */
  pageSizeOptions?: number[];
  searchParam?: string;
  searchEnabled?: boolean;
  paramPrefix?: string;
  initialTab?: string | null;
  /** Known tab values. A `tab` in the URL that is not listed falls back to `initialTab`. */
  tabValues?: string[];
  activeTab?: string | null;
  onTabChange?: (tab: string) => void;
  filters?: CrudFilters;
  /** The scrolling element whose position is kept when the tab changes. Defaults to the app shell content area. */
  getScrollContainer?: () => HTMLElement | null;
};

function getAppContentScroller() {
  return document.querySelector<HTMLElement>('[data-slot="app-content-scroll"]');
}

function filtersKey(filters: CrudFilters | undefined) {
  return JSON.stringify(filters ?? {});
}

function lastPageOf(totalCount: number, pageSize: number) {
  return Math.max(1, Math.ceil(totalCount / pageSize) || 1);
}

type FetchKeyParts = {
  activeTab: string | null;
  filters: string;
  page: number;
  pageSize: number;
  reloadToken: number;
  search: string;
  sortKey: string;
};

function buildFetchKey(parts: FetchKeyParts) {
  return [
    parts.page,
    parts.pageSize,
    parts.search,
    parts.sortKey,
    parts.activeTab ?? '',
    parts.filters,
    parts.reloadToken,
  ].join('|');
}

const LIST_ERROR = 'Something went wrong. Please try again.';

export function useCrudList<T>({
  fetchPage,
  getItemId,
  pageSize: initialPageSize = 10,
  pageSizeOptions,
  searchParam,
  searchEnabled = true,
  paramPrefix,
  initialTab = null,
  tabValues,
  activeTab: activeTabProp,
  onTabChange,
  filters,
  getScrollContainer = getAppContentScroller,
}: UseCrudListOptions<T>) {
  const { activeTab, page, pageSize, search, setActiveTab, setPage, setPageSize, setSort, sort } =
    useCrudQueryState({
      activeTab: activeTabProp,
      getScrollContainer,
      initialTab,
      onTabChange,
      pageSize: initialPageSize,
      pageSizeOptions,
      paramPrefix,
      searchEnabled,
      searchParam,
      tabValues,
    });

  const sortKey = sort ? `${sort.field}:${sort.order}` : '';
  const resolvedFiltersKey = filtersKey(filters);
  const [items, setItems] = React.useState<T[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [error, setError] = React.useState<Error | null>(null);
  const [reloadToken, setReloadToken] = React.useState(0);
  /** The fetch key whose result is on screen. Anything else means a request is pending. */
  const [loadedKey, setLoadedKey] = React.useState<string | null>(null);

  const fetchPageRef = useLatestRef(fetchPage);
  const filtersRef = useLatestRef(filters);
  const loadedKeyRef = useLatestRef(loadedKey);

  const fetchKey = buildFetchKey({
    activeTab,
    filters: resolvedFiltersKey,
    page,
    pageSize,
    reloadToken,
    search,
    sortKey,
  });

  // A new search, sort, tab, page size or filter starts again from page 1.
  const [prevQuery, setPrevQuery] = React.useState({
    search,
    sortKey,
    activeTab,
    pageSize,
    resolvedFiltersKey,
  });
  if (
    prevQuery.search !== search ||
    prevQuery.sortKey !== sortKey ||
    prevQuery.activeTab !== activeTab ||
    prevQuery.pageSize !== pageSize ||
    prevQuery.resolvedFiltersKey !== resolvedFiltersKey
  ) {
    setPrevQuery({ search, sortKey, activeTab, pageSize, resolvedFiltersKey });
    if (page !== 1) {
      setPage(1);
    }
  }

  const [prevFetchKey, setPrevFetchKey] = React.useState(fetchKey);
  if (fetchKey !== prevFetchKey) {
    setPrevFetchKey(fetchKey);
    setError(null);
  }

  React.useEffect(() => {
    // The last page was already fetched while correcting an out-of-range page, so the page
    // change that correction caused must not fetch it again.
    if (loadedKeyRef.current === fetchKey) return;

    let cancelled = false;
    const load = (forPage: number) =>
      fetchPageRef.current({
        page: forPage,
        pageSize,
        search,
        sort,
        tab: activeTab,
        filters: filtersRef.current ?? {},
      });

    void (async () => {
      try {
        let result = await load(page);
        if (cancelled) return;

        let resolvedPage = page;
        const lastPage = lastPageOf(result.totalCount, pageSize);
        if (page > lastPage) {
          // Fetch the right page in the same chain, so the empty page is never painted and the
          // stale rows never show as loaded.
          resolvedPage = lastPage;
          result = await load(lastPage);
          if (cancelled) return;
        }

        setItems(result.items);
        setTotalCount(result.totalCount);
        setLoadedKey(
          buildFetchKey({
            activeTab,
            filters: resolvedFiltersKey,
            page: resolvedPage,
            pageSize,
            reloadToken,
            search,
            sortKey,
          }),
        );
        if (resolvedPage !== page) setPage(resolvedPage);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(new Error(getMessageString(err, LIST_ERROR)));
        setLoadedKey(fetchKey);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    fetchKey,
    fetchPageRef,
    filtersRef,
    loadedKeyRef,
    page,
    pageSize,
    reloadToken,
    resolvedFiltersKey,
    search,
    setPage,
    sort,
    sortKey,
  ]);

  function refetch() {
    setReloadToken((token) => token + 1);
  }

  function goToFirstPage() {
    setPage(1);
  }

  function insertItem(item: T) {
    setItems((current) =>
      [item, ...current.filter((row) => getItemId(row) !== getItemId(item))].slice(0, pageSize),
    );
    setTotalCount((count) => count + 1);
  }

  function replaceItem(id: string, item: T) {
    setItems((current) => current.map((row) => (getItemId(row) === id ? item : row)));
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((row) => getItemId(row) !== id));
    setTotalCount((count) => Math.max(0, count - 1));
  }

  const mutators: CrudListMutators<T> = {
    goToFirstPage,
    insertItem,
    refetch,
    removeItem,
    replaceItem,
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    pageCount: lastPageOf(totalCount, pageSize),
    search,
    sort,
    setSort,
    activeTab,
    setActiveTab,
    items,
    totalCount,
    loading: loadedKey === null && items.length === 0,
    isFetching: loadedKey !== fetchKey,
    error,
    mutators,
  };
}
