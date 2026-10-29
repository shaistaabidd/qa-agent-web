import type { ExpandedState, SortingState } from '@tanstack/react-table';
import type {
  LegacyColumnDef as ColumnDef,
  LegacyRow as Row,
  LegacyTableOptions as TableOptions,
} from '@tanstack/react-table/legacy';
import type React from 'react';

import type { PaginationOptions } from '@/shared/ui/pagination';

/** Use with column meta or table sortIcon prop to customize sort icons. sortOrder is 'ascend' | 'descend' | null */
export type SortIconProps = { sortOrder: 'ascend' | 'descend' | null };

export type TableScroll = {
  x?: number | string | true;
  y?: number | string;
};

export type TableExpandable = {
  /** Trailing chevron column. Row click still toggles unless `expandRowByClick` is false. */
  showExpandColumn?: boolean;
  /** Panel rows toggle on row click. Defaults to true. */
  expandRowByClick?: boolean;
};

export type TanStackTableProps<TData extends object> = {
  /** TanStack column defs. Set enableSorting: false to disable sort. Use sortFn for custom sort logic. */
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  /** Skip client-side sorting (the server sorts). Defaults to true when `onSortingChange` is set. */
  manualSorting?: boolean;
  /** Accessible name for the scroll region when the table can scroll. */
  ariaLabel?: string;
  /**
   * Client-side pagination. Defaults to `true`.
   * Pass `false` to disable, or `{ itemLabel, pageSize }` for the shared table footer.
   */
  pagination?: boolean | PaginationOptions;
  pageSize?: number;
  stickyHeader?: boolean;
  stickyHeaderScrollY?: string | number;
  /** Custom sort icon for all sortable columns. Receives { sortOrder } and returns a React node. */
  sortIcon?: (props: SortIconProps) => React.ReactNode;
  /**
   * Detail panel below a row when expanded. Wired to TanStack `expanded` state.
   * Rows toggle open/closed on row click. Set `expandable.showExpandColumn` to true for a trailing chevron column.
   * Use `expanded` / `onExpandedChange` for controlled mode, or let the table manage expansion internally.
   */
  renderExpandedRow?: (ctx: { row: Row<TData> }) => React.ReactNode;
  /**
   * Hierarchical sub-rows (tree). When set, expanded children render as real table rows via
   * TanStack `getExpandedRowModel`.
   */
  getSubRows?: TableOptions<TData>['getSubRows'];
  /**
   * Classes merged onto the wrapper `div` around `renderExpandedRow` (after optional column `meta.expandedPanelClassName`).
   * The expanded cell uses `p-0`; add spacing here (e.g. `px-4 py-3`) when you want it.
   */
  expandedContentClassName?: string;
  /**
   * Animate panel open/close with the Accordion `grid-rows` transition.
   * Keeps expandable detail rows mounted so collapse can animate closed.
   */
  animateExpandedRows?: boolean;
  expanded?: ExpandedState;
  onExpandedChange?: (expanded: ExpandedState) => void;
  /** When expansion is enabled, defaults to all rows expandable unless you pass this. */
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /** Stable row ids (recommended for expansion + pagination). Maps your row object to a unique string. */
  getRowId?: TableOptions<TData>['getRowId'];
  /**
   * Defaults to **`true`**: show column dividers and the header cell grid.
   * Set to `false` to hide vertical lines; body rows keep horizontal separators.
   */
  showVerticalLines?: boolean;
  /**
   * Defaults to **`true`**: when a column sets `meta.expandedPanelLeftBorder`, show the left accent bar on the parent row and expanded row (`primary` / `danger` from `meta.expandedPanelAccent`).
   * Set to **`false`** to expand without the accent line.
   */
  showExpandedRowAccent?: boolean;
  /**
   * Defaults to **`true`**: wraps the table in its own card chrome (border, radius,
   * background, shadow). Set to **`false`** when an ancestor (e.g. `CrudScreen`)
   * already supplies that chrome around the table and its toolbar together.
   */
  card?: boolean;
  className?: string;
  scroll?: TableScroll;
  loading?: boolean;
  locale?: {
    emptyText?: React.ReactNode;
  };
  expandable?: TableExpandable;
  onRow?: (record: TData, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
};

export type PinColumnMeta = {
  /** Sticky column. `left` stays at the start while the table scrolls sideways. */
  pin?: 'left' | 'right';
  headerClassName?: string;
  headerStyle?: React.CSSProperties;
  /** Relative width (flex proportion). E.g. flex: 2 makes this column twice as wide as flex: 1. All columns with flex share space by ratio. */
  flex?: number;
  /** Column width (px number or CSS string e.g. "20%"). Ignored when flex is set. */
  width?: number | string;
  /** Minimum column width (px number or CSS string). If unset, uses TanStack `minSize` on the column def when provided. */
  minWidth?: number | string;
  /** Maximum column width (px). */
  maxWidth?: number;
  /** Custom sort icon for this column only (overrides table sortIcon). */
  sortIcon?: (props: SortIconProps) => React.ReactNode;
  /** Header and body cell alignment. Defaults to left. */
  align?: 'left' | 'right' | 'center';
  /**
   * Continuous left accent on the **parent row + expanded row** when open (absolute `::before` bar — no layout shift).
   * Set on any one column’s `meta`; first column in definition order that sets any expanded-panel field wins.
   */
  expandedPanelLeftBorder?: boolean;
  /** `danger` = red accent; `primary` = brand color. */
  expandedPanelAccent?: 'primary' | 'danger';
  /** Extra classes on the optional inner `div` around `renderExpandedRow` output. */
  expandedPanelClassName?: string;
  /** colSpan for tree parent summary cells. Return 0 to skip the cell. */
  getColSpan?: (ctx: { depth: number; isParent: boolean }) => number | undefined;
};
