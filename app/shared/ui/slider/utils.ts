import { cn } from '@/shared/lib/utils';

import {
  handleDisabledClass,
  handleHitClass,
  handleLiveClass,
  handlePositionClass,
  handleShapeClass,
  previewInteractionClass,
  rootClass,
} from './constants';
import type { SliderInteraction, SliderRangeValue } from './types';

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getStepPrecision(step: number) {
  const text = String(step);
  const index = text.indexOf('.');
  return index === -1 ? 0 : text.length - index - 1;
}

export function snapToStep(value: number, min: number, max: number, step: number) {
  if (!Number.isFinite(value)) {
    return clamp(min, min, max);
  }

  if (step <= 0) {
    return clamp(value, min, max);
  }

  const snapped = min + Math.round((value - min) / step) * step;
  const rounded = Number(snapped.toFixed(getStepPrecision(step)));
  return clamp(rounded, min, max);
}

export function valueToPercent(value: number, min: number, max: number) {
  if (max === min) {
    return 0;
  }

  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

export function percentToValue(percent: number, min: number, max: number, step: number) {
  return snapToStep(min + (percent / 100) * (max - min), min, max, step);
}

export function normalizePair(
  isRange: boolean,
  value: number | SliderRangeValue,
  min: number,
  max: number,
  step: number,
): [number, number] {
  if (typeof value === 'number') {
    return [min, snapToStep(value, min, max, step)];
  }

  if (!isRange) {
    return [min, snapToStep(value[1], min, max, step)];
  }

  const start = snapToStep(value[0], min, max, step);
  const end = snapToStep(value[1], min, max, step);
  return start <= end ? [start, end] : [end, start];
}

export function getDefaultPair(
  isRange: boolean,
  min: number,
  max: number,
  step: number,
  defaultValue?: number | SliderRangeValue,
): [number, number] {
  const span = max - min;

  if (isRange) {
    if (Array.isArray(defaultValue)) {
      return normalizePair(true, defaultValue, min, max, step);
    }

    return [
      snapToStep(min + span * 0.25, min, max, step),
      snapToStep(min + span * 0.75, min, max, step),
    ];
  }

  if (typeof defaultValue === 'number') {
    return [min, snapToStep(defaultValue, min, max, step)];
  }

  return [min, snapToStep(min + span / 2, min, max, step)];
}

export function getRootClassName(className?: string) {
  return cn(rootClass, className);
}

export function getHandleHitClassName(className?: string) {
  return cn(handleHitClass, className);
}

export function getHandleClassName({
  className,
  disabled = false,
  interaction = 'default',
  live = true,
  positioned = true,
}: {
  className?: string;
  disabled?: boolean;
  interaction?: SliderInteraction;
  live?: boolean;
  positioned?: boolean;
} = {}) {
  return cn(
    handleShapeClass,
    positioned && handlePositionClass,
    disabled && handleDisabledClass,
    !disabled && live && handleLiveClass,
    !disabled && !live && interaction !== 'default' && previewInteractionClass[interaction],
    className,
  );
}
