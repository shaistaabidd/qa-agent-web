import { cn } from '@/shared/lib/utils';

import { directionClass } from './constants';
import type { LabelDirection } from './types';

export function getLabelClassName(direction: LabelDirection, className?: string) {
  return cn(directionClass[direction], className);
}
