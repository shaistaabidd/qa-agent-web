import type { LegacyColumnDef } from '@tanstack/react-table/legacy';
import type React from 'react';

import type { PinColumnMeta } from './tanStackTableTypes';

/** TanStack column defs may include root `minWidth` (not the same as `minSize`). */
type ColumnDefWithMinWidth<TData extends Record<string, any>> = LegacyColumnDef<TData, unknown> & {
  minWidth?: number | string;
};

export function rawColumnMinWidth<TData extends Record<string, any>>(
  meta: PinColumnMeta | undefined,
  def: LegacyColumnDef<TData, unknown>,
): number | string | undefined {
  return (
    meta?.minWidth ??
    (def as ColumnDefWithMinWidth<TData>).minWidth ??
    (def.minSize != null && def.minSize > 0 ? def.minSize : undefined)
  );
}

/** Numeric px length. Percentages and other CSS units stay on cell style only. */
export function numericPx(raw: number | string | undefined): number | undefined {
  if (raw === undefined) return undefined;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const s = raw.trim().toLowerCase();
    const pxMatch = /^(\d+(?:\.\d+)?)px$/.exec(s);
    if (pxMatch) return parseFloat(pxMatch[1]);
    if (/^\d+(?:\.\d+)?$/.test(s)) return parseFloat(s);
    return undefined;
  }
  return undefined;
}

export function cssMinWidth(raw: number | string | undefined): React.CSSProperties['minWidth'] {
  if (raw === undefined) return undefined;
  return typeof raw === 'number' ? raw : raw;
}
