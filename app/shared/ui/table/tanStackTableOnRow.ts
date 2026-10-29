import type { LegacyRow as Row } from '@tanstack/react-table/legacy';
import type { HTMLAttributes, KeyboardEvent, MouseEvent } from 'react';

import { cn } from '@/shared/lib/utils';

import {
  EXPAND_PARENT_ROW_BG_ACCENT_OFF,
  EXPAND_PARENT_ROW_BG_ACCENT_ON,
  EXPAND_PARENT_ROW_SEAM_HIDE_BOTTOM,
  expandAccentParentRowClasses,
} from './tanStackTableExpand';

type BuildRowPropsArgs<TData extends object> = {
  row: Row<TData>;
  index: number;
  isOpen: boolean;
  keyboardToggle: boolean;
  onRow?: (record: TData, index: number) => HTMLAttributes<HTMLTableRowElement>;
  panelExpandEnabled: boolean;
  treeExpandEnabled: boolean;
  expandRowByClick: boolean;
  expandedRowAccentVisible: boolean;
  accent: 'primary' | 'danger';
};

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(
      target.closest(
        'input,button,a,textarea,select,label,[role=button],[role=menuitem],[role=checkbox],[role=switch],[role=link],[role=option],[role=tab]',
      ),
    )
  );
}

export function buildTanStackRowProps<TData extends object>({
  row,
  index,
  isOpen,
  keyboardToggle,
  onRow,
  panelExpandEnabled,
  treeExpandEnabled,
  expandRowByClick,
  expandedRowAccentVisible,
  accent,
}: BuildRowPropsArgs<TData>): HTMLAttributes<HTMLTableRowElement> {
  const base = onRow?.(row.original, index) ?? {};
  const parentAccent =
    expandedRowAccentVisible && isOpen ? expandAccentParentRowClasses(accent) : '';
  const parentRowFill =
    panelExpandEnabled && isOpen
      ? expandedRowAccentVisible
        ? EXPAND_PARENT_ROW_BG_ACCENT_ON
        : EXPAND_PARENT_ROW_BG_ACCENT_OFF
      : '';
  const hideParentBottomSeam =
    panelExpandEnabled && !expandedRowAccentVisible && isOpen
      ? EXPAND_PARENT_ROW_SEAM_HIDE_BOTTOM
      : '';
  const treeDepthClass = treeExpandEnabled
    ? row.depth > 0
      ? 'pricing-tree-child-row'
      : 'pricing-tree-parent-row'
    : '';
  const canToggle =
    row.getCanExpand() && (treeExpandEnabled || (panelExpandEnabled && expandRowByClick));

  return {
    ...base,
    className: cn(
      base.className,
      parentAccent,
      parentRowFill,
      hideParentBottomSeam,
      treeDepthClass,
      canToggle && 'cursor-pointer',
    ),
    ...(canToggle && {
      onClick: (event: MouseEvent<HTMLTableRowElement>) => {
        base.onClick?.(event);
        if (!event.currentTarget.contains(event.target as Node)) return;
        if (event.defaultPrevented || isInteractiveTarget(event.target)) return;
        row.toggleExpanded();
      },
      ...(keyboardToggle && {
        tabIndex: base.tabIndex ?? 0,
        onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
          base.onKeyDown?.(event);
          if (event.defaultPrevented || event.target !== event.currentTarget) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            row.toggleExpanded();
          }
        },
      }),
    }),
  };
}
