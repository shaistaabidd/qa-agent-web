import { isValidElement, type ReactElement, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { iconClass, iconWrapClass, rootClass, variantClass } from './constants';
import type { AlertVariant } from './types';

export function getRootClassName(variant: AlertVariant, className?: string) {
  return cn(rootClass, variantClass[variant], className);
}

export function getIconWrapClassName(variant: AlertVariant, className?: string) {
  return cn(iconWrapClass, iconClass[variant], className);
}

export function isElementOfType<P>(
  child: ReactNode,
  component: (props: P) => ReactNode,
): child is ReactElement<P> {
  return isValidElement(child) && child.type === component;
}
