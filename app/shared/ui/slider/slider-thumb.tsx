import type { KeyboardEvent } from 'react';

import type { SliderInteraction } from './types';
import { getHandleClassName, getHandleHitClassName } from './utils';

type SliderThumbProps = {
  ariaLabel?: string;
  disabled?: boolean;
  dragging?: boolean;
  id?: string;
  interaction?: SliderInteraction;
  labelledBy?: string;
  live?: boolean;
  max: number;
  min: number;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  percent: number;
  value: number;
  valueText?: string;
  zIndex: number;
};

export function SliderThumb({
  ariaLabel,
  disabled,
  dragging = false,
  id,
  interaction,
  labelledBy,
  live = true,
  max,
  min,
  onKeyDown,
  percent,
  value,
  valueText,
  zIndex,
}: SliderThumbProps) {
  const visualClassName = getHandleClassName({
    disabled,
    interaction,
    live,
    positioned: !live,
  });

  if (!live) {
    return (
      <span
        className={visualClassName}
        data-slot="slider-handle"
        style={{ left: `${percent}%`, zIndex }}
      />
    );
  }

  return (
    <button
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-labelledby={labelledBy}
      aria-orientation="horizontal"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      aria-valuetext={valueText}
      className={getHandleHitClassName()}
      data-pressed={dragging || undefined}
      data-slot="slider-thumb"
      disabled={disabled}
      id={id}
      onKeyDown={onKeyDown}
      role="slider"
      style={{ left: `${percent}%`, zIndex }}
      type="button"
    >
      <span aria-hidden className={visualClassName} data-slot="slider-handle" />
    </button>
  );
}
