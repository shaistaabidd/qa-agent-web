import { cn } from '@/shared/lib/utils';

import {
  controlBaseClass,
  controlClass,
  controlEmbeddedClass,
  previewInteractionClass,
  rootClass,
  rootEmbeddedClass,
} from './constants';
import type { CheckboxCheck, CheckboxChecked, CheckboxInteraction, CheckboxProps } from './types';

export function getCheckState(checked: CheckboxChecked | undefined): CheckboxCheck {
  if (checked === 'indeterminate') {
    return 'indeterminate';
  }

  return checked ? 'checked' : 'off';
}

export function getRootClassName(className?: string, embedded = false) {
  return cn(embedded ? rootEmbeddedClass : rootClass, className);
}

export function getControlClassName(className?: string, embedded = false) {
  return cn(embedded ? controlEmbeddedClass : controlClass, className);
}

export function getPreviewControlClassName(
  check: CheckboxCheck,
  interaction: CheckboxInteraction = 'default',
  className?: string,
) {
  return cn(
    controlBaseClass,
    interaction !== 'default' && previewInteractionClass[interaction][check],
    className,
  );
}

export function isInvalidValue(error: boolean, ariaInvalid: CheckboxProps['aria-invalid']) {
  return error || ariaInvalid === true || ariaInvalid === 'true';
}
