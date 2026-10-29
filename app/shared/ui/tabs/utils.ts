import { cn } from '@/shared/lib/utils';

import {
  innerClass,
  itemClass,
  itemFillClass,
  itemLiveClass,
  itemPreviewClass,
  rootClass,
  rootFullWidthClass,
  sizeClass,
} from './constants';
import type { TabItemInteraction, TabsSize } from './types';

export function getTabId(tabsId: string, value: string) {
  return `${tabsId}-tab-${value}`;
}

export function getPanelId(tabsId: string, value: string) {
  return `${tabsId}-panel-${value}`;
}

export function getRootClassName(fullWidth: boolean, className?: string) {
  return cn(rootClass, fullWidth && rootFullWidthClass, className);
}

export function getItemClassName({
  className,
  fullWidth,
  interaction,
  live,
  size,
}: {
  className?: string;
  fullWidth: boolean;
  interaction?: TabItemInteraction;
  live: boolean;
  size: TabsSize;
}) {
  const isPreview = interaction !== undefined;

  return cn(
    itemClass,
    sizeClass[size],
    fullWidth && itemFillClass,
    live ? itemLiveClass : undefined,
    isPreview ? itemPreviewClass : undefined,
    className,
  );
}

export function getInnerClassName() {
  return innerClass;
}

export function isTabSelected(interaction: TabItemInteraction | undefined) {
  return interaction === 'active' || interaction === 'active-hover';
}
