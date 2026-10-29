import { flexRender } from '@tanstack/react-table';
import type { LegacyTable } from '@tanstack/react-table/legacy';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { sortOrderFromColumn } from './tanStackTableColumns';
import { stickyCellStyle } from './tanStackTableColumnStyle';
import {
  alignClass,
  headerBorderClass,
  headerCellClass,
  pinnedStartEdgeClass,
} from './tanStackTableTableClasses';
import type { PinColumnMeta, SortIconProps } from './tanStackTableTypes';

type TanStackTableHeadProps<TData extends Record<string, any>> = {
  showExpandColumn: boolean;
  showVerticalLines: boolean;
  sortIcon: (props: SortIconProps) => ReactNode;
  stickyHeader: boolean;
  table: LegacyTable<TData>;
};

export function TanStackTableHead<TData extends Record<string, any>>({
  showExpandColumn,
  showVerticalLines,
  sortIcon,
  stickyHeader,
  table,
}: TanStackTableHeadProps<TData>) {
  const headerGroups = table.getHeaderGroups();

  return (
    <thead>
      {headerGroups.map((headerGroup, groupIndex) => {
        let renderedFirst = true;
        return (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              if (header.rowSpan === 0) return null;
              const isFirstOfFirstRow = groupIndex === 0 && renderedFirst;
              renderedFirst = false;
              const meta = header.column.columnDef.meta as PinColumnMeta | undefined;
              const pinned = header.column.getIsPinned();
              const canSort = header.column.getCanSort();
              const sortOrder = sortOrderFromColumn(header.column.getIsSorted());
              const icon = meta?.sortIcon ?? sortIcon;
              const content = flexRender(header.column.columnDef.header, header.getContext());

              return (
                <th
                  key={header.id}
                  aria-sort={
                    canSort
                      ? sortOrder === 'ascend'
                        ? 'ascending'
                        : sortOrder === 'descend'
                          ? 'descending'
                          : 'none'
                      : undefined
                  }
                  className={cn(
                    headerCellClass,
                    alignClass(meta?.align),
                    headerBorderClass(showVerticalLines, isFirstOfFirstRow),
                    pinned === 'start' && pinnedStartEdgeClass,
                    meta?.headerClassName,
                  )}
                  colSpan={header.colSpan}
                  rowSpan={header.rowSpan > 1 ? header.rowSpan : undefined}
                  scope={header.colSpan > 1 ? 'colgroup' : 'col'}
                  style={stickyCellStyle(header.column, {
                    isHeader: true,
                    stickyHeader,
                  })}
                >
                  {canSort ? (
                    <button
                      className={cn(
                        '-mx-[8px] inline-flex max-w-full cursor-pointer items-center gap-[4px] rounded-[8px] bg-transparent px-[8px] py-[4px] text-inherit outline-none select-none',
                        'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] hover:text-fg-default',
                        'active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
                        'focus-visible:shadow-[inset_0_0_0_1px_var(--border-color-focus),0_0_0_4px_var(--color-state-focus)]',
                        sortOrder != null && 'text-fg-default',
                        meta?.align === 'right' && 'w-full flex-row-reverse justify-end',
                        meta?.align === 'center' && 'w-full justify-center',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      type="button"
                    >
                      <span className="leading-4">{content}</span>
                      {icon({ sortOrder })}
                    </button>
                  ) : (
                    content
                  )}
                </th>
              );
            })}
            {showExpandColumn && groupIndex === 0 ? (
              <th
                className={cn(headerCellClass, headerBorderClass(showVerticalLines, false))}
                rowSpan={headerGroups.length > 1 ? headerGroups.length : undefined}
                style={{
                  width: 40,
                  minWidth: 40,
                  ...(stickyHeader ? { position: 'sticky', top: 0, zIndex: 10 } : {}),
                }}
              />
            ) : null}
          </tr>
        );
      })}
    </thead>
  );
}
