import { cn } from '@/shared/lib/utils';

import type { BadgeVariant } from '../badge/types';
import {
  baseClass,
  liveClass,
  previewClass,
  selectedClass,
  sizeClass,
  variantClass,
  variantHoverClass,
} from './constants';
import type { ChipInteraction, ChipSize, ChipVariant } from './types';

export function isChipSelected(
  selected: boolean | undefined,
  interaction: ChipInteraction | undefined,
) {
  if (interaction !== undefined) {
    return interaction === 'selected';
  }

  return Boolean(selected);
}

export function getCountBadgeVariant({
  interaction,
  selected,
  variant,
}: {
  interaction?: ChipInteraction;
  selected: boolean;
  variant: ChipVariant;
}): BadgeVariant {
  if (selected) {
    return 'primary';
  }

  if (variant === 'input' && interaction !== 'hover') {
    return 'primary';
  }

  return 'neutral';
}

export function getChipClassName({
  className,
  interaction,
  selected,
  size,
  variant,
}: {
  className?: string;
  interaction?: ChipInteraction;
  selected: boolean;
  size: ChipSize;
  variant: ChipVariant;
}) {
  const isPreview = interaction !== undefined;
  const previewHover = isPreview && interaction === 'hover' && !selected;

  return cn(
    baseClass,
    sizeClass[size],
    isPreview
      ? selected
        ? selectedClass
        : previewHover
          ? variantHoverClass[variant]
          : variantClass[variant]
      : cn(variantClass[variant], liveClass[variant]),
    isPreview ? previewClass : undefined,
    className,
  );
}
