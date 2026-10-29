import { cloneElement, isValidElement, type ReactElement } from 'react';

import { cn } from '@/shared/lib/utils';

import { baseClass, toneClass } from './constants';
import type { LinkProps } from './types';

export function Link({
  asChild = false,
  children,
  className,
  disabled,
  tone = 'primary',
  ...props
}: LinkProps) {
  const classes = cn(baseClass, toneClass[tone], className);

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      'aria-disabled': disabled || undefined,
      className: cn(classes, child.props.className),
    } as typeof child.props);
  }

  return (
    <a {...props} aria-disabled={disabled || undefined} className={classes} data-slot="link">
      {children}
    </a>
  );
}
