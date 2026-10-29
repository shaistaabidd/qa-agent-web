import { cn } from '@/shared/lib/utils';

import {
  controlBaseClass,
  controlClass,
  controlEmbeddedClass,
  previewCheckedClass,
  previewInteractionClass,
  rootClass,
} from './constants';
import type { RadioCheck, RadioInteraction, RadioProps } from './types';

export function getRootClassName(className?: string) {
  return cn(rootClass, className);
}

export function getControlClassName(className?: string, embedded = false) {
  return cn(embedded ? controlEmbeddedClass : controlClass, className);
}

export function getPreviewControlClassName(
  check: RadioCheck,
  interaction: RadioInteraction = 'default',
  className?: string,
) {
  return cn(
    controlBaseClass,
    interaction === 'default' ? previewCheckedClass : previewInteractionClass[interaction][check],
    className,
  );
}

export function isInvalidValue(error: boolean, ariaInvalid: RadioProps['aria-invalid']) {
  return error || ariaInvalid === true || ariaInvalid === 'true';
}
