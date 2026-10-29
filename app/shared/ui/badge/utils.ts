import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { baseClass, dotClass, dotVariantClass, sizeClass, variantClass } from './constants';
import type { BadgeSize, BadgeVariant } from './types';

export function getBadgeClassName(variant: BadgeVariant, size: BadgeSize, className?: string) {
  return cn(baseClass, sizeClass[size], variantClass[variant], className);
}

export function getDotClassName(variant: BadgeVariant, className?: string) {
  const hasCustomBg = className?.split(/\s+/).some((token) => token.startsWith('bg-'));

  return cn(dotClass, !hasCustomBg && dotVariantClass[variant], className);
}

export function getBadgeContent(children: ReactNode) {
  if (typeof children === 'string') {
    return children.trim();
  }

  return children;
}
