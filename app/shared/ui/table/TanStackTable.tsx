import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import type { ExpandedState, SortingState, Updater } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type LegacyTableOptions,
  useLegacyTable as useReactTable,
} from '@tanstack/react-table/legacy';
import React from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';

import { resolvePaginationOptions } from './resolvePaginationOptions';
import { TanStackTableBody } from './TanStackTableBody';
import {
  columnDefsHaveMinWidth,
  columnDefsHavePin,
  columnPinningFromDefs,
  prepareColumns,
} from './tanStackTableColumns';
import { expandedPanelChromeFromColumns } from './tanStackTableExpand';
import { TanStackTableHead } from './TanStackTableHead';
import { TanStackTablePagination } from './TanStackTablePagination';
import { cssLength, resolveTableScroll } from './tanStackTableScroll';
import { DEFAULT_SORT_ICON } from './tanStackTableSortIcon';
import type { PinColumnMeta, TanStackTableProps } from './tanStackTableTypes';
import { DEFAULT_STICKY_SCROLL_Y } from './useTanStackTablePin';

export type { PinColumnMeta, SortIconProps, TanStackTableProps } from './tanStackTableTypes';

function TanStackTable<TData extends object>({
  columns,
  data,
  sorting,
  onSortingChange,
  manualSorting = onSortingChange != null,
  ariaLabel = 'Table',
  pagination: paginationConfig = true,
  pageSize: initialPageSize = 10,
  stickyHeader = false,
  stickyHeaderScrollY = DEFAULT_STICKY_SCROLL_Y,
  sortIcon: sortIconProp,
  scroll: scrollProp,
  renderExpandedRow,
  getSubRows: getSubRowsOption,
  expandedContentClassName,
  animateExpandedRows = false,
  expanded: expandedProp,
  onExpandedChange,
  getRowCanExpand,
  getRowId: getRowIdOption,
  showVerticalLines = true,
  showExpandedRowAccent = true,
  card = true,
  className,
  loading = false,
  locale,
  expandable,
  onRow,
}: TanStackTableProps<TData>) {
  const {
    enabled: enablePagination,
    itemLabel: paginationItemLabel,
    label: paginationLabel,
    pageSize: resolvedPageSize,
  } = resolvePaginationOptions(paginationConfig, initialPageSize);
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const effectiveSorting = sorting !== undefined ? sorting : internalSorting;
  const [internalExpanded, setInternalExpanded] = React.useState<ExpandedState>({});
  const effectiveExpanded = expandedProp !== undefined ? expandedProp : internalExpanded;
  const sortIcon = sortIconProp ?? DEFAULT_SORT_ICON;
  const preparedColumns = React.useMemo(() => prepareColumns(columns), [columns]);
  const columnPinning = React.useMemo(() => columnPinningFromDefs(columns, true), [columns]);

  const treeExpandEnabled = getSubRowsOption != null;
  const panelExpandEnabled = !!renderExpandedRow;
  const expandEnabled = panelExpandEnabled || treeExpandEnabled;
  const showExpandColumn = panelExpandEnabled && expandable?.showExpandColumn === true;
  const expandRowByClick = expandable?.expandRowByClick ?? true;
  const expandedPanelChrome = React.useMemo(
    () => expandedPanelChromeFromColumns(columns),
    [columns],
  );
  const expandedRowAccentVisible =
    panelExpandEnabled && expandedPanelChrome.leftBorder && showExpandedRowAccent;

  const table = useReactTable({
    data,
    columns: preparedColumns,
    ...(getRowIdOption != null && { getRowId: getRowIdOption }),
    ...(getSubRowsOption != null && { getSubRows: getSubRowsOption }),
    state: {
      sorting: effectiveSorting,
      columnPinning,
      ...(expandEnabled && { expanded: effectiveExpanded }),
    },
    onSortingChange: (updaterOrValue: Updater<SortingState>) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(effectiveSorting) : updaterOrValue;
      onSortingChange?.(next);
      if (sorting === undefined) setInternalSorting(next);
    },
    ...(expandEnabled && {
      onExpandedChange: (updaterOrValue: Updater<ExpandedState>) => {
        const next =
          typeof updaterOrValue === 'function' ? updaterOrValue(effectiveExpanded) : updaterOrValue;
        onExpandedChange?.(next);
        if (expandedProp === undefined) setInternalExpanded(next);
      },
      getRowCanExpand:
        getRowCanExpand ?? (treeExpandEnabled ? (row) => row.subRows.length > 0 : () => true),
    }),
    initialState: {
      pagination: { pageIndex: 0, pageSize: resolvedPageSize },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: treeExpandEnabled ? getExpandedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    manualSorting,
    manualPagination: !enablePagination,
  } as LegacyTableOptions<TData>);

  const rows = table.getRowModel().rows;
  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const { pageIndex, pageSize } = table.getState().pagination;
  const page = pageIndex + 1;
  const showingFrom = filteredRowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const showingTo = Math.min((pageIndex + 1) * pageSize, filteredRowCount);
  const columnCount = table.getVisibleLeafColumns().length + (showExpandColumn ? 1 : 0);
  const hasPinnedColumn = columnDefsHavePin(columns);
  const hasMinWidthColumn = columnDefsHaveMinWidth(columns);
  const resolvedScroll = React.useMemo(
    () =>
      resolveTableScroll({
        hasMinWidthColumn,
        hasPinnedColumn,
        scroll: scrollProp,
        stickyHeader,
        stickyHeaderScrollY,
      }),
    [hasMinWidthColumn, hasPinnedColumn, scrollProp, stickyHeader, stickyHeaderScrollY],
  );
  const maxHeight = cssLength(resolvedScroll.maxHeight);
  const scrollable =
    stickyHeader || resolvedScroll.maxHeight != null || resolvedScroll.minWidth != null;
  const growsWithContent =
    resolvedScroll.minWidth === true || resolvedScroll.minWidth === 'max-content';
  const leafColumns = [
    ...table.getPinnedVisibleLeafColumns('start'),
    ...table.getPinnedVisibleLeafColumns('center'),
    ...table.getPinnedVisibleLeafColumns('end'),
  ];
  const flexTotal = leafColumns.reduce((sum, column) => {
    const flex = (column.columnDef.meta as PinColumnMeta | undefined)?.flex;
    return sum + (flex ?? 0);
  }, 0);

  return (
    <div
      className={cn(
        'tanstack-table-root overflow-hidden font-sans text-fg-default',
        card && 'rounded-[16px] border border-subtle bg-bg-surface shadow-sm',
        stickyHeader && 'flex h-full min-h-0 flex-1 flex-col',
        className,
      )}
    >
      <div
        className={cn(
          'relative min-h-0',
          scrollbarClass,
          stickyHeader || resolvedScroll.maxHeight != null
            ? 'overflow-auto'
            : 'overflow-x-auto overflow-y-hidden',
          stickyHeader && 'min-h-0 flex-1',
        )}
        style={maxHeight ? { maxHeight } : undefined}
        {...(scrollable && { 'aria-label': ariaLabel, role: 'region', tabIndex: 0 })}
      >
        <table
          aria-busy={loading || undefined}
          className={cn(
            'w-full border-separate border-spacing-0 text-left',
            growsWithContent && 'min-w-max',
            flexTotal > 0 && 'table-fixed',
          )}
          style={
            !growsWithContent && resolvedScroll.minWidth != null
              ? { minWidth: cssLength(resolvedScroll.minWidth) }
              : undefined
          }
        >
          {flexTotal > 0 ? (
            <colgroup>
              {leafColumns.map((column) => {
                const flex = (column.columnDef.meta as PinColumnMeta | undefined)?.flex;
                return (
                  <col
                    key={column.id}
                    style={flex ? { width: `${(flex / flexTotal) * 100}%` } : undefined}
                  />
                );
              })}
              {showExpandColumn ? <col style={{ width: 40 }} /> : null}
            </colgroup>
          ) : null}
          <TanStackTableHead
            showExpandColumn={showExpandColumn}
            showVerticalLines={showVerticalLines}
            sortIcon={(props) => sortIcon(props)}
            stickyHeader={stickyHeader}
            table={table}
          />
          <TanStackTableBody
            animateExpandedRows={animateExpandedRows}
            columnCount={Math.max(columnCount, 1)}
            emptyText={locale?.emptyText}
            expandRowByClick={expandRowByClick}
            expandedContentClassName={expandedContentClassName}
            expandedPanelChrome={expandedPanelChrome}
            expandedRowAccentVisible={expandedRowAccentVisible}
            loading={loading}
            onRow={onRow}
            panelExpandEnabled={panelExpandEnabled}
            renderExpandedRow={renderExpandedRow}
            rows={rows}
            showExpandColumn={showExpandColumn}
            showVerticalLines={showVerticalLines}
            stickyHeader={stickyHeader}
            treeExpandEnabled={treeExpandEnabled}
          />
        </table>
        {loading && rows.length > 0 ? (
          <div
            aria-live="polite"
            className="absolute inset-0 z-40 flex items-center justify-center bg-bg-surface/70"
            role="status"
          >
            <CircleNotchIcon
              aria-hidden
              className="size-6 animate-spin text-fg-secondary"
              weight="bold"
            />
            <span className="sr-only">Loading</span>
          </div>
        ) : null}
      </div>
      {enablePagination ? (
        <TanStackTablePagination
          itemLabel={paginationItemLabel}
          label={paginationLabel}
          onPageChange={(nextPage) => table.setPageIndex(nextPage - 1)}
          page={page}
          pageCount={Math.max(1, pageCount)}
          showingFrom={showingFrom}
          showingTo={showingTo}
          total={filteredRowCount}
        />
      ) : null}
    </div>
  );
}

export default TanStackTable;
