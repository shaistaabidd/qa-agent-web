import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import type { LegacyRow as Row } from '@tanstack/react-table/legacy';
import { Fragment, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { TableExpandPanel } from './TableExpandPanel';
import {
  EXPAND_DETAIL_ROW_SEAM_HIDE_TOP,
  EXPAND_ROW_TD_BG_ACCENT_OFF,
  EXPAND_ROW_TD_BG_ACCENT_ON,
  expandAccentTdClasses,
} from './tanStackTableExpand';
import { TanStackTableRow } from './TanStackTableRow';

type ExpandedPanelChrome = {
  leftBorder: boolean;
  className?: string;
  accent: 'primary' | 'danger';
};

type TanStackTableBodyProps<TData extends object> = {
  animateExpandedRows: boolean;
  columnCount: number;
  emptyText?: ReactNode;
  expandRowByClick: boolean;
  expandedContentClassName?: string;
  expandedPanelChrome: ExpandedPanelChrome;
  expandedRowAccentVisible: boolean;
  loading: boolean;
  onRow?: (record: TData, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  panelExpandEnabled: boolean;
  renderExpandedRow?: (ctx: { row: Row<TData> }) => ReactNode;
  rows: Row<TData>[];
  showExpandColumn: boolean;
  showVerticalLines: boolean;
  stickyHeader: boolean;
  treeExpandEnabled: boolean;
};

export function TanStackTableBody<TData extends object>({
  animateExpandedRows,
  columnCount,
  emptyText,
  expandRowByClick,
  expandedContentClassName,
  expandedPanelChrome,
  expandedRowAccentVisible,
  loading,
  onRow,
  panelExpandEnabled,
  renderExpandedRow,
  rows,
  showExpandColumn,
  showVerticalLines,
  stickyHeader,
  treeExpandEnabled,
}: TanStackTableBodyProps<TData>) {
  if (loading && rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td className="px-2 py-10 text-center" colSpan={columnCount}>
            <span aria-live="polite" role="status">
              <CircleNotchIcon
                aria-hidden
                className="mx-auto size-6 animate-spin text-icon-medium"
                weight="bold"
              />
              <span className="sr-only">Loading</span>
            </span>
          </td>
        </tr>
      </tbody>
    );
  }

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td className="px-2 py-8 text-center text-sm text-medium" colSpan={columnCount}>
            {emptyText ?? 'No data'}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {rows.map((row, index) => {
        const isOpen = row.getIsExpanded();
        const mountDetail =
          panelExpandEnabled && row.getCanExpand() && (animateExpandedRows || isOpen);

        return (
          <Fragment key={row.id}>
            <TanStackTableRow
              accent={expandedPanelChrome.accent}
              cells={row.getVisibleCells()}
              expandRowByClick={expandRowByClick}
              expandedRowAccentVisible={expandedRowAccentVisible}
              index={index}
              isOpen={isOpen}
              onRow={onRow}
              panelExpandEnabled={panelExpandEnabled}
              row={row}
              showExpandColumn={showExpandColumn}
              showVerticalLines={showVerticalLines}
              stickyHeader={stickyHeader}
              treeExpandEnabled={treeExpandEnabled}
            />
            {mountDetail && renderExpandedRow ? (
              <ExpandedDetailRow
                accent={expandedPanelChrome.accent}
                animate={animateExpandedRows}
                className={expandedPanelChrome.className}
                columnCount={columnCount}
                contentClassName={expandedContentClassName}
                expandedRowAccentVisible={expandedRowAccentVisible}
                open={isOpen}
              >
                {renderExpandedRow({ row })}
              </ExpandedDetailRow>
            ) : null}
          </Fragment>
        );
      })}
    </tbody>
  );
}

function ExpandedDetailRow({
  accent,
  animate,
  children,
  className,
  columnCount,
  contentClassName,
  expandedRowAccentVisible,
  open,
}: {
  accent: 'primary' | 'danger';
  animate: boolean;
  children: ReactNode;
  className?: string;
  columnCount: number;
  contentClassName?: string;
  expandedRowAccentVisible: boolean;
  open: boolean;
}) {
  const accentClass = expandedRowAccentVisible && open ? expandAccentTdClasses(accent) : '';
  const background =
    expandedRowAccentVisible && open ? EXPAND_ROW_TD_BG_ACCENT_ON : EXPAND_ROW_TD_BG_ACCENT_OFF;
  const hideTopSeam = expandedRowAccentVisible || !open ? '' : EXPAND_DETAIL_ROW_SEAM_HIDE_TOP;
  const materialBg = expandedRowAccentVisible && open ? 'bg-slate-50' : 'bg-surface-white';
  const inner = <div className={cn(materialBg, className, contentClassName)}>{children}</div>;

  return (
    <tr className={cn(accentClass, background, hideTopSeam)}>
      <td
        className="border-b border-l-0 border-r-0 border-t-0 border-solid border-low p-0"
        colSpan={columnCount}
      >
        {animate ? <TableExpandPanel open={open}>{inner}</TableExpandPanel> : inner}
      </td>
    </tr>
  );
}
