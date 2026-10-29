import { flexRender } from '@tanstack/react-table';
import type { LegacyCell as Cell, LegacyRow as Row } from '@tanstack/react-table/legacy';
import { memo } from 'react';

import { cn } from '@/shared/lib/utils';

import { stickyCellStyle } from './tanStackTableColumnStyle';
import { TanStackExpandIcon } from './tanStackTableExpandIcon';
import { buildTanStackRowProps } from './tanStackTableOnRow';
import {
  alignClass,
  bodyBorderClass,
  bodyCellClass,
  pinnedBodyCellClass,
  pinnedStartEdgeClass,
} from './tanStackTableTableClasses';
import type { PinColumnMeta } from './tanStackTableTypes';

export type TanStackTableRowProps<TData extends object> = {
  accent: 'primary' | 'danger';
  cells: Cell<TData, unknown>[];
  expandRowByClick: boolean;
  expandedRowAccentVisible: boolean;
  index: number;
  isOpen: boolean;
  onRow?: (record: TData, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  panelExpandEnabled: boolean;
  row: Row<TData>;
  showExpandColumn: boolean;
  showVerticalLines: boolean;
  stickyHeader: boolean;
  treeExpandEnabled: boolean;
};

function spanFor<TData extends object>(cell: Cell<TData, unknown>, row: Row<TData>) {
  const meta = cell.column.columnDef.meta as PinColumnMeta | undefined;
  return meta?.getColSpan?.({
    depth: row.depth,
    isParent: row.depth === 0 && row.subRows.length > 0,
  });
}

function TanStackTableRowImpl<TData extends object>({
  accent,
  cells,
  expandRowByClick,
  expandedRowAccentVisible,
  index,
  isOpen,
  onRow,
  panelExpandEnabled,
  row,
  showExpandColumn,
  showVerticalLines,
  stickyHeader,
  treeExpandEnabled,
}: TanStackTableRowProps<TData>) {
  const firstIndex = cells.findIndex((cell) => spanFor(cell, row) !== 0);

  return (
    <tr
      {...buildTanStackRowProps({
        accent,
        expandRowByClick,
        expandedRowAccentVisible,
        index,
        isOpen,
        keyboardToggle: !showExpandColumn,
        onRow,
        panelExpandEnabled,
        row,
        treeExpandEnabled,
      })}
    >
      {cells.map((cell, cellIndex) => {
        const meta = cell.column.columnDef.meta as PinColumnMeta | undefined;
        const pinned = cell.column.getIsPinned();
        const colSpan = spanFor(cell, row);
        if (colSpan === 0) return null;
        const isFirst = cellIndex === firstIndex;

        return (
          <td
            key={cell.id}
            className={cn(
              bodyCellClass,
              alignClass(meta?.align),
              bodyBorderClass(showVerticalLines, isFirst),
              pinned && pinnedBodyCellClass,
              pinned === 'start' && pinnedStartEdgeClass,
            )}
            colSpan={colSpan != null && colSpan > 1 ? colSpan : undefined}
            style={stickyCellStyle(cell.column, {
              isHeader: false,
              stickyHeader,
            })}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
      {showExpandColumn ? (
        <td className={cn(bodyCellClass, 'text-center', bodyBorderClass(showVerticalLines, false))}>
          {row.getCanExpand() ? (
            <TanStackExpandIcon expanded={isOpen} onToggle={() => row.toggleExpanded()} />
          ) : null}
        </td>
      ) : null}
    </tr>
  );
}

export const TanStackTableRow = memo(TanStackTableRowImpl) as typeof TanStackTableRowImpl;
