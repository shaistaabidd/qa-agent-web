import { cn } from '@/shared/lib/utils';

import { baseClass, dotClass, dotVariantClass, sizeClass, variantClass } from './constants';
import type { TagSize, TagVariant } from './types';

export function getTagClassName({
  className,
  size,
  variant,
}: {
  className?: string;
  size: TagSize;
  variant: TagVariant;
}) {
  return cn(baseClass, sizeClass[size], variantClass[variant], className);
}

export function getDotClassName(size: TagSize, variant: TagVariant) {
  return cn(dotClass[size], dotVariantClass[variant]);
}
