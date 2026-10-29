import { cn } from '@/shared/lib/utils';

import {
  controlBaseClass,
  controlClass,
  controlEmbeddedClass,
  previewDisabledClass,
  previewDisabledInteractionClass,
  previewInteractionClass,
  rootClass,
  thumbClass,
} from './constants';
import type { SwitchCheck, SwitchInteraction, SwitchProps } from './types';

export function getRootClassName(className?: string) {
  return cn(rootClass, className);
}

export function getControlClassName(className?: string, embedded = false) {
  return cn(embedded ? controlEmbeddedClass : controlClass, className);
}

export function getThumbClassName(disabled?: boolean, className?: string) {
  return cn(thumbClass, disabled && 'bg-fg-muted', className);
}

export function getPreviewControlClassName(
  check: SwitchCheck,
  interaction: SwitchInteraction = 'default',
  disabled = false,
  className?: string,
) {
  if (disabled) {
    return cn(
      controlBaseClass,
      interaction === 'hover' ? previewDisabledInteractionClass.hover : previewDisabledClass,
      className,
    );
  }

  return cn(
    controlBaseClass,
    interaction === 'default' ? undefined : previewInteractionClass[interaction][check],
    className,
  );
}

export function isInvalidValue(ariaInvalid: SwitchProps['aria-invalid']) {
  return ariaInvalid === true || ariaInvalid === 'true';
}
