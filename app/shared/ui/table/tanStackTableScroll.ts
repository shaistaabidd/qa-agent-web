import type { TableScroll } from './tanStackTableTypes';

type ResolveScrollArgs = {
  scroll?: TableScroll;
  stickyHeader: boolean;
  stickyHeaderScrollY: string | number;
  hasPinnedColumn: boolean;
  hasMinWidthColumn: boolean;
};

export type ResolvedTableScroll = {
  maxHeight?: string | number;
  minWidth?: string | number | true;
};

export function resolveTableScroll({
  scroll,
  stickyHeader,
  stickyHeaderScrollY,
  hasPinnedColumn,
  hasMinWidthColumn,
}: ResolveScrollArgs): ResolvedTableScroll {
  const maxHeight = stickyHeader ? (scroll?.y ?? stickyHeaderScrollY) : scroll?.y;
  const minWidth = scroll?.x ?? (hasPinnedColumn || hasMinWidthColumn ? 'max-content' : undefined);

  return {
    ...(maxHeight != null ? { maxHeight } : {}),
    ...(minWidth != null ? { minWidth } : {}),
  };
}

export function cssLength(value: string | number | true | undefined): string | undefined {
  if (value == null || value === true || value === 'max-content') return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}
