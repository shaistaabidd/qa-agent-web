import { cn } from '@/shared/lib/utils';

import { rootDirectionClass, rootTypeClass, trackClass, trackLinearClass } from './constants';
import type { ProgressDirection, ProgressType } from './types';

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getProgressPercent(value: number, min: number, max: number) {
  if (max <= min) {
    return 0;
  }

  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

export function getRootClassName(
  type: ProgressType,
  direction: ProgressDirection,
  className?: string,
) {
  return cn(rootTypeClass[type], type === 'linear' && rootDirectionClass[direction], className);
}

export function getTrackClassName(direction: ProgressDirection) {
  return cn(trackClass, trackLinearClass[direction]);
}

export function hasProgressText(value: unknown) {
  return value != null && value !== '';
}
