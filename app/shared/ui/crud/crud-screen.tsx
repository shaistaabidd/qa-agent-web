import { PlusIcon } from '@phosphor-icons/react/Plus';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { SEARCH_PARAM } from '@/shared/ui/search';
import { Toaster } from '@/shared/ui/toast';
import { Typography } from '@/shared/ui/Typography';

import { CrudPagination } from './crud-pagination';
import { CrudScreenDialogs } from './crud-screen-dialogs';
import { CrudEmptyState, CrudErrorState } from './crud-status';
import { CrudTable } from './crud-table';
import { CrudToolbar } from './crud-toolbar';
import type {
  CrudAction,
  CrudColumn,
  CrudCreateConfig,
  CrudDeleteConfig,
  CrudEditConfig,
  CrudEmptyConfig,
  CrudFilters,
  CrudPageParams,
  CrudPageResult,
  CrudSearchConfig,
  CrudTab,
} from './types';
import { useCrudList } from './use-crud-list';

export type CrudScreenProps<T extends object> = {
  columns: CrudColumn<T>[];
  fetchPage: (params: CrudPageParams) => Promise<CrudPageResult<T>>;
  getRowId: (row: T) => string;
  title?: string;
  description?: string;
  search?: CrudSearchConfig | false;
  paramPrefix?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  pagination?: boolean;
  toolbar?: React.ReactNode;
  filters?: CrudFilters;
  tabs?: CrudTab[];
  initialTab?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  create?: CrudCreateConfig<T>;
  edit?: CrudEditConfig<T>;
  delete?: CrudDeleteConfig<T>;
  empty?: CrudEmptyConfig;
  actions?: CrudAction<T>[];
  onRowClick?: (row: T) => void;
  getRowLabel?: (row: T) => string;
  className?: string;
  withToaster?: boolean;
  entityLabel?: string;
  /** Scrolling element to keep in place when the tab changes. Defaults to the app shell content area. */
  getScrollContainer?: () => HTMLElement | null;
  /** Keep the first column fixed while the rest of the table scrolls sideways. */
  stickyFirstColumn?: boolean;
};

export function CrudScreen<T extends object>({
  columns,
  fetchPage,
  getRowId,
  title,
  description,
  search = {},
  paramPrefix,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  pagination = true,
  toolbar,
  filters,
  tabs,
  initialTab,
  activeTab: activeTabProp,
  onTabChange: onTabChangeProp,
  create,
  edit,
  delete: deleteConfig,
  empty,
  actions: extraActions,
  onRowClick,
  getRowLabel,
  className,
  withToaster = false,
  entityLabel = 'item',
  getScrollContainer,
  stickyFirstColumn = true,
}: CrudScreenProps<T>) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<T | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const showSearch = search !== false;
  const searchConfig = typeof search === 'object' ? search : undefined;

  const list = useCrudList<T>({
    fetchPage,
    filters,
    getItemId: getRowId,
    pageSize,
    pageSizeOptions,
    searchEnabled: showSearch,
    searchParam: searchConfig?.param ?? SEARCH_PARAM,
    paramPrefix,
    initialTab: initialTab ?? tabs?.[0]?.value ?? null,
    tabValues: tabs?.map((tab) => tab.value),
    activeTab: activeTabProp,
    onTabChange: onTabChangeProp,
    getScrollContainer,
  });

  const actions = React.useMemo(() => {
    const built: CrudAction<T>[] = [];

    if (edit) {
      built.push({
        key: 'edit',
        label: 'Edit',
        variant: 'outline',
        isVisible: edit.isVisible,
        onClick: (row) => setEditing(row),
      });
    }

    if (deleteConfig) {
      built.push({
        key: 'delete',
        label: 'Delete',
        variant: 'destructive',
        onClick: (row) => setDeleteTarget(row),
      });
    }

    if (extraActions?.length) built.push(...extraActions);
    return built;
  }, [edit, deleteConfig, extraActions]);

  const emptyTitle = list.search
    ? `No ${entityLabel}s match your search`
    : (empty?.title ?? `No ${entityLabel}s`);
  const emptySubheading = list.search
    ? 'Try a different search.'
    : (empty?.description ?? `No ${entityLabel}s found.`);

  const addLabel = create ? (create.addLabel ?? `Add ${entityLabel}`) : 'Add';
  const openCreate = create ? () => setCreateOpen(true) : undefined;
  const addInHeader = Boolean(title && openCreate);

  return (
    <div className={cn('mx-auto flex w-full flex-col gap-[16px]', className)} data-slot="crud-page">
      {withToaster ? <Toaster /> : null}

      {title ? (
        <header
          className="flex w-full flex-wrap items-start justify-between gap-x-[16px] gap-y-[12px]"
          data-slot="crud-header"
        >
          <div className="flex min-w-0 flex-1 basis-48 flex-col gap-[4px]">
            <div className="flex flex-wrap items-center gap-[8px]">
              <Typography as="h2" variant="h5">
                {title}
              </Typography>
              {list.error ? null : (
                <Badge
                  aria-hidden={list.totalCount <= 0 || undefined}
                  className={cn(list.totalCount <= 0 && 'invisible')}
                  variant="neutral"
                >
                  {list.totalCount > 0 ? list.totalCount : 0}
                </Badge>
              )}
            </div>
            {description ? (
              <Typography className="text-fg-secondary" variant="body3">
                {description}
              </Typography>
            ) : null}
          </div>
          {addInHeader ? (
            <Button onClick={openCreate} size="sm" type="button">
              <PlusIcon aria-hidden weight="bold" />
              {addLabel}
            </Button>
          ) : null}
        </header>
      ) : null}

      <div
        className="flex w-full flex-col overflow-clip rounded-[12px] border border-subtle bg-bg-surface"
        data-slot="crud-screen"
      >
        <CrudToolbar
          activeTab={list.activeTab}
          addLabel={addLabel}
          onAdd={addInHeader ? undefined : openCreate}
          onTabChange={list.setActiveTab}
          searchDebounceMs={searchConfig?.debounceMs}
          searchParam={searchConfig?.param ?? SEARCH_PARAM}
          searchPlaceholder={searchConfig?.placeholder}
          showSearch={showSearch}
          tabs={tabs}
          toolbar={toolbar}
        />

        {list.error ? (
          <CrudErrorState
            message={list.error.message || 'Something went wrong. Please try again.'}
            onRetry={list.mutators.refetch}
            title={`Unable to load ${entityLabel}s`}
          />
        ) : (
          <CrudTable
            actions={actions.length ? actions : undefined}
            columns={columns}
            data={list.items}
            emptyMessage={
              <CrudEmptyState
                action={empty?.action}
                searching={Boolean(list.search)}
                subheading={emptySubheading}
                title={emptyTitle}
              />
            }
            getRowId={getRowId}
            getRowLabel={getRowLabel}
            isLoading={list.isFetching}
            listMutators={list.mutators}
            onRowClick={onRowClick}
            onSortChange={list.setSort}
            sortState={list.sort}
            stickyFirstColumn={stickyFirstColumn}
          />
        )}

        {pagination && !list.error && (list.loading || list.totalCount > 0) ? (
          <CrudPagination
            itemLabel={`${entityLabel}s`}
            onPageChange={list.setPage}
            onPageSizeChange={list.setPageSize}
            page={list.page}
            pageCount={list.pageCount}
            pageSize={list.pageSize}
            pageSizeOptions={pageSizeOptions}
            total={list.totalCount}
          />
        ) : null}
      </div>

      <CrudScreenDialogs
        activeTab={list.activeTab}
        create={create}
        createOpen={createOpen}
        deleteConfig={deleteConfig}
        deleteTarget={deleteTarget}
        deleting={deleting}
        edit={edit}
        editing={editing}
        entityLabel={entityLabel}
        list={list.mutators}
        setCreateOpen={setCreateOpen}
        setDeleteTarget={setDeleteTarget}
        setDeleting={setDeleting}
        setEditing={setEditing}
        setTab={list.setActiveTab}
      />
    </div>
  );
}
