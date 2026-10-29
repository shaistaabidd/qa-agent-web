import type { MouseEvent } from 'react';

import { cn } from '@/shared/lib/utils';

import {
  adornmentAlignClass,
  adornmentClass,
  adornmentSizeClass,
  containerClass,
  containerSizeClass,
  controlClass,
  controlSizeClass,
} from './constants';
import type { InputAdornmentAlign, InputProps, InputSize } from './types';

export function getContainerClassName(size: InputSize, className?: string) {
  return cn(containerClass, containerSizeClass[size], className);
}

export function getControlClassName(size: InputSize, className?: string) {
  return cn(controlClass, controlSizeClass[size], className);
}

export function getAdornmentClassName(size: InputSize, align: InputAdornmentAlign) {
  return cn(adornmentClass, adornmentSizeClass[size], adornmentAlignClass[align][size]);
}

export function isInvalidValue(error: boolean, ariaInvalid: InputProps['aria-invalid']) {
  return error || ariaInvalid === true || ariaInvalid === 'true';
}

export function focusInputFromContainer(event: MouseEvent<HTMLDivElement>) {
  if ((event.target as HTMLElement).closest('input, button')) {
    return;
  }

  event.preventDefault();
  event.currentTarget.querySelector('input')?.focus();
}
