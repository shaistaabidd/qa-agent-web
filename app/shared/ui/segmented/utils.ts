import { cn } from '@/shared/lib/utils';

import {
  itemClass,
  itemLiveClass,
  itemPreviewClass,
  itemPreviewHoverClass,
  itemSizeClass,
  rootClass,
} from './constants';
import type { SegmentedItemInteraction, SegmentedSize } from './types';

export function getRootClassName(className?: string) {
  return cn(rootClass, className);
}

export function getItemClassName({
  className,
  interaction,
  live,
  size,
}: {
  className?: string;
  interaction?: SegmentedItemInteraction;
  live: boolean;
  size: SegmentedSize;
}) {
  const isPreview = interaction !== undefined;

  return cn(
    itemClass,
    itemSizeClass[size],
    live ? itemLiveClass : undefined,
    isPreview && interaction === 'hover' ? itemPreviewHoverClass : undefined,
    isPreview ? itemPreviewClass : undefined,
    className,
  );
}
