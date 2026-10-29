import type { PinColumnMeta } from './tanStackTableTypes';

/**
 * Left accent via `td::before` (no layout shift). `isolate` + high `z-index` so the bar paints
 * above the cell’s own borders and body cell border utilities.
 */
export function expandAccentTdClasses(accent: 'primary' | 'danger'): string {
  const bg = accent === 'danger' ? '[&>td]:before:bg-bg-danger' : '[&>td]:before:bg-bg-primary';
  return `[&>td]:relative [&>td]:isolate [&>td]:overflow-visible [&>td]:before:pointer-events-none [&>td]:before:absolute [&>td]:before:left-0 [&>td]:before:-top-3 [&>td]:before:bottom-0 [&>td]:before:z-[100] [&>td]:before:w-[2px] [&>td]:before:content-[''] [&>td]:before:will-change-transform ${bg}`;
}

export function expandAccentParentRowClasses(accent: 'primary' | 'danger'): string {
  const bg =
    accent === 'danger'
      ? '[&>td:first-child]:before:bg-bg-danger'
      : '[&>td:first-child]:before:bg-bg-primary';
  return `[&>td:first-child]:relative [&>td:first-child]:isolate [&>td:first-child]:overflow-visible [&>td:first-child]:before:pointer-events-none [&>td:first-child]:before:absolute [&>td:first-child]:before:left-0 [&>td:first-child]:before:top-0 [&>td:first-child]:before:-bottom-1 [&>td:first-child]:before:z-[100] [&>td:first-child]:before:w-[2px] [&>td:first-child]:before:content-[''] [&>td:first-child]:before:will-change-transform ${bg}`;
}

/** Parent data row while expanded: hide the cell bottom border (seam to the detail row). */
export const EXPAND_PARENT_ROW_SEAM_HIDE_BOTTOM = '[&_td]:border-b-0!';

/** Expanded detail `tr`: hide cell top border for the same seam (only when accent strip is off). */
export const EXPAND_DETAIL_ROW_SEAM_HIDE_TOP = '[&_td]:border-t-0!';

/** Parent row `td` fill while the row is expanded. */
export const EXPAND_PARENT_ROW_BG_ACCENT_ON = '[&_td]:bg-bg-muted!';
export const EXPAND_PARENT_ROW_BG_ACCENT_OFF = '[&_td]:bg-bg-surface!';

/** Expanded detail row `td` fill — same rule as parent. */
export const EXPAND_ROW_TD_BG_ACCENT_ON = '[&_td]:bg-bg-muted!';
export const EXPAND_ROW_TD_BG_ACCENT_OFF = '[&_td]:bg-bg-surface!';

export function expandedPanelChromeFromColumns(columns: ReadonlyArray<{ meta?: PinColumnMeta }>): {
  leftBorder: boolean;
  className?: string;
  accent: 'primary' | 'danger';
} {
  for (const col of columns) {
    const m = col.meta;
    if (!m) continue;
    if (
      m.expandedPanelLeftBorder != null ||
      m.expandedPanelClassName != null ||
      m.expandedPanelAccent != null
    ) {
      const left = m.expandedPanelLeftBorder === true;
      return {
        leftBorder: left,
        className: m.expandedPanelClassName,
        accent: m.expandedPanelAccent ?? 'primary',
      };
    }
  }
  return {
    leftBorder: false,
    className: undefined,
    accent: 'primary',
  };
}
