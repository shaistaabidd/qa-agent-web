import { cn } from '@/shared/lib/utils';

import { bodyClass, frameClass, iconClass, rootClass, textClass } from './constants';
import type { EmptyStateSize, EmptyStateVariant } from './types';

export function getRootClassName(
  size: EmptyStateSize,
  variant: EmptyStateVariant,
  className?: string,
) {
  return cn(
    rootClass[size],
    variant === 'bordered' && 'rounded-[16px] border border-dashed border-default',
    className,
  );
}

export function getFrameClassName(size: EmptyStateSize) {
  return frameClass[size];
}

export function getIconClassName(size: EmptyStateSize) {
  return iconClass[size];
}

export function getTextClassName(size: EmptyStateSize) {
  return textClass[size];
}

export { bodyClass };
