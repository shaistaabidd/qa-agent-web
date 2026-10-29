import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { numericPx, rawColumnMinWidth } from './tanStackTableColumnWidth';
import type { PinColumnMeta } from './tanStackTableTypes';

type ColumnWithLayout<TData extends Record<string, any>> = ColumnDef<TData, unknown> & {
  columns?: ColumnWithLayout<TData>[];
  minWidth?: number | string;
};

export type ColumnPinningState = {
  start: string[];
  end: string[];
};

function resolveColumnId<TData extends Record<string, any>>(
  def: ColumnDef<TData, unknown>,
): string | undefined {
  if (def.id) return def.id;
  if ('accessorKey' in def && def.accessorKey != null) {
    return String(def.accessorKey);
  }
  if (typeof def.header === 'string') return def.header;
  return undefined;
}

function walkColumnDefs<TData extends Record<string, any>>(
  defs: ColumnDef<TData, unknown>[],
  visit: (def: ColumnDef<TData, unknown>) => void,
): void {
  for (const def of defs) {
    visit(def);
    if ('columns' in def && def.columns?.length) {
      walkColumnDefs(def.columns as ColumnDef<TData, unknown>[], visit);
    }
  }
}

export function columnDefsHavePin<TData extends Record<string, any>>(
  columns: ColumnDef<TData, unknown>[],
): boolean {
  let found = false;
  walkColumnDefs(columns, (col) => {
    const meta = col.meta as PinColumnMeta | undefined;
    if (meta?.pin === 'left' || meta?.pin === 'right') found = true;
  });
  return found;
}

export function columnDefsHaveMinWidth<TData extends Record<string, any>>(
  columns: ColumnDef<TData, unknown>[],
): boolean {
  let found = false;
  walkColumnDefs(columns, (col) => {
    const meta = col.meta as PinColumnMeta | undefined;
    if (rawColumnMinWidth(meta, col) != null) found = true;
  });
  return found;
}

export function columnPinningFromDefs<TData extends Record<string, any>>(
  columns: ColumnDef<TData, unknown>[],
  enabled: boolean,
): ColumnPinningState {
  if (!enabled) return { start: [], end: [] };
  const start: string[] = [];
  const end: string[] = [];
  walkColumnDefs(columns, (col) => {
    if ('columns' in col && col.columns?.length) return;
    const id = resolveColumnId(col);
    const pin = (col.meta as PinColumnMeta | undefined)?.pin;
    if (!id || !pin) return;
    if (pin === 'left') start.push(id);
    if (pin === 'right') end.push(id);
  });
  return { start, end };
}

function layoutSize<TData extends Record<string, any>>(
  def: ColumnWithLayout<TData>,
): number | undefined {
  const meta = def.meta as PinColumnMeta | undefined;
  return (
    numericPx(meta?.width) ??
    numericPx(meta?.minWidth) ??
    numericPx(def.minWidth) ??
    (def.minSize != null && def.minSize > 0 ? def.minSize : undefined)
  );
}

export function prepareColumns<TData extends Record<string, any>>(
  columns: ColumnDef<TData, unknown>[],
): ColumnDef<TData, unknown>[] {
  return columns.map((column) => {
    const def = column as ColumnWithLayout<TData>;
    const meta = def.meta as PinColumnMeta | undefined;
    const nested = def.columns?.length ? prepareColumns(def.columns) : undefined;
    const size = layoutSize(def);

    return {
      ...def,
      ...(nested ? { columns: nested } : {}),
      ...(size != null ? { size } : {}),
      ...(meta?.maxWidth != null ? { maxSize: meta.maxWidth } : {}),
    };
  });
}

export function sortOrderFromColumn(sorted: false | 'asc' | 'desc') {
  if (sorted === 'asc') return 'ascend' as const;
  if (sorted === 'desc') return 'descend' as const;
  return null;
}
