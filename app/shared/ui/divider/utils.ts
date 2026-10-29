import { cn } from '@/shared/lib/utils';

import { lineOrientationClass, orientationClass, rootClass, toneClass } from './constants';
import type { DividerOrientation, DividerTone } from './types';

export function getRootClassName(orientation: DividerOrientation, className?: string) {
  return cn(rootClass, orientationClass[orientation], className);
}

export function getLineClassName(orientation: DividerOrientation, tone: DividerTone) {
  return cn(toneClass[tone], lineOrientationClass[orientation]);
}
