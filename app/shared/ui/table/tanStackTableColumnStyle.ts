import type { LegacyColumn } from '@tanstack/react-table/legacy';
import type React from 'react';

import { cssMinWidth, rawColumnMinWidth } from './tanStackTableColumnWidth';
import type { PinColumnMeta } from './tanStackTableTypes';

type StickyCellOptions = {
  isHeader: boolean;
  stickyHeader: boolean;
};

export function stickyCellStyle<TData extends Record<string, any>>(
  column: LegacyColumn<TData, unknown>,
  { isHeader, stickyHeader }: StickyCellOptions,
): React.CSSProperties {
  const meta = column.columnDef.meta as PinColumnMeta | undefined;
  const pinned = column.getIsPinned();
  const minWidth = cssMinWidth(rawColumnMinWidth(meta, column.columnDef));
  const style: React.CSSProperties = {
    ...(meta?.width != null && !pinned ? { width: meta.width } : {}),
    ...(minWidth != null ? { minWidth } : {}),
    ...(meta?.maxWidth != null ? { maxWidth: meta.maxWidth } : {}),
    ...(isHeader ? meta?.headerStyle : {}),
  };

  if (pinned) {
    style.position = 'sticky';
    style.zIndex = isHeader ? 30 : 2;
    // Keep the column's own width. Forcing getSize() applies TanStack's default
    // and shrinks a start-pinned column that has no explicit meta.width.
    if (meta?.width != null) style.width = meta.width;
    if (pinned === 'start') style.insetInlineStart = column.getStart('start');
    if (pinned === 'end') style.insetInlineEnd = column.getAfter('end');
  }

  if (stickyHeader && isHeader) {
    style.position = 'sticky';
    style.top = 0;
    if (!pinned) style.zIndex = 10;
  }

  return style;
}
