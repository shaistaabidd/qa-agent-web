import type { MouseEvent, Ref } from 'react';

import { cn } from '@/shared/lib/utils';

import {
  containerClass,
  containerMinHeightClass,
  containerSizeClass,
  controlClass,
  controlSizeClass,
  radiusClass,
  resizableControlClass,
  resizableHostClass,
} from './constants';
import type { TextareaProps, TextareaSize } from './types';

type TextareaLayoutOptions = {
  autoHeight?: boolean;
  resize?: boolean;
};

export function getContainerClassName(size: TextareaSize, options: TextareaLayoutOptions = {}) {
  if (options.resize) {
    return resizableHostClass;
  }

  return cn(
    containerClass,
    containerSizeClass[size],
    options.autoHeight && containerMinHeightClass[size],
  );
}

export function getControlClassName(size: TextareaSize, options: TextareaLayoutOptions = {}) {
  if (options.resize) {
    return cn(
      resizableControlClass,
      radiusClass[size],
      containerMinHeightClass[size],
      controlSizeClass[size],
      options.autoHeight && 'field-sizing-content',
    );
  }

  return cn(
    controlClass,
    controlSizeClass[size],
    options.autoHeight ? 'overflow-hidden' : 'overflow-y-auto',
  );
}

export function isInvalidValue(error: boolean, ariaInvalid: TextareaProps['aria-invalid']) {
  return error || ariaInvalid === true || ariaInvalid === 'true';
}

export function focusTextareaFromContainer(event: MouseEvent<HTMLDivElement>) {
  const target = event.target as HTMLElement;

  if (target.closest('textarea, button, a')) {
    return;
  }

  event.preventDefault();
  event.currentTarget.querySelector('textarea')?.focus();
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }
  };
}
