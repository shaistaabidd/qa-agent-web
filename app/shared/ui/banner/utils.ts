import { cn } from '@/shared/lib/utils';

import { iconClass, iconWrapClass, rootClass, variantClass } from './constants';
import type { BannerVariant } from './types';

export function getRootClassName(variant: BannerVariant, className?: string) {
  return cn(rootClass, variantClass[variant], className);
}

export function getIconWrapClassName(variant: BannerVariant, className?: string) {
  return cn(iconWrapClass, iconClass[variant], className);
}

export function isTextAction(action: unknown) {
  return typeof action === 'string' || typeof action === 'number';
}
