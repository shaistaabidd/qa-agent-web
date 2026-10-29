import { useId } from 'react';

import type { LabelDirection } from '@/shared/ui/label';

import { barClass, DEFAULT_MAX, DEFAULT_MIN } from './constants';
import { ProgressCircle } from './progress-circle';
import { ProgressText } from './progress-text';
import type { ProgressProps } from './types';
import {
  clamp,
  getProgressPercent,
  getRootClassName,
  getTrackClassName,
  hasProgressText,
} from './utils';

function resolveLabelDirection(fallback: LabelDirection, override?: LabelDirection) {
  return override ?? fallback;
}

export function Progress({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  direction = 'horizontal',
  id,
  label,
  labelDescription,
  labelDirection,
  max = DEFAULT_MAX,
  min = DEFAULT_MIN,
  type = 'linear',
  value = 0,
  valueLabel,
  valueLabelDescription,
  valueLabelDirection,
  valueLabelMuted = false,
  ...props
}: ProgressProps) {
  const generatedId = useId();
  const labelId = `${id ?? generatedId}-label`;
  const current = clamp(value, min, max);
  const percent = getProgressPercent(current, min, max);
  const showLabel = hasProgressText(label);
  const showValueLabel = hasProgressText(valueLabel) || hasProgressText(valueLabelDescription);
  const resolvedLabelDirection = resolveLabelDirection(
    type === 'linear' && direction === 'vertical' ? 'horizontal' : 'vertical',
    labelDirection,
  );
  const resolvedValueLabelDirection = resolveLabelDirection(
    type === 'circular' ? 'vertical' : 'horizontal',
    valueLabelDirection,
  );
  const hasNamedLabel = showLabel && isPlainLabel(label);
  const valueLabelId = `${id ?? generatedId}-value`;
  const nameFromValueLabel = !ariaLabel && !ariaLabelledBy && !hasNamedLabel && showValueLabel;
  const labelledBy =
    ariaLabelledBy ??
    (hasNamedLabel ? labelId : undefined) ??
    (nameFromValueLabel ? valueLabelId : undefined);
  const stackedLabelClass = type === 'linear' && direction === 'vertical' ? 'w-full' : undefined;
  const valueLabelClassName =
    type === 'circular' && showLabel
      ? 'ml-auto min-w-0'
      : type === 'circular' && !showLabel && resolvedValueLabelDirection === 'horizontal'
        ? 'min-w-0 flex-1'
        : stackedLabelClass;

  return (
    <div
      className={getRootClassName(type, direction, className)}
      data-direction={type === 'linear' ? direction : undefined}
      data-slot="progress"
      data-type={type}
      id={id}
      {...props}
    >
      {showLabel ? (
        <ProgressText
          className={stackedLabelClass}
          description={labelDescription}
          direction={resolvedLabelDirection}
          id={labelledBy === labelId ? labelId : undefined}
        >
          {label}
        </ProgressText>
      ) : null}

      {type === 'circular' ? (
        <div
          aria-label={labelledBy ? undefined : ariaLabel}
          aria-labelledby={labelledBy}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={current}
          className="shrink-0"
          data-slot="progress-bar"
          role="progressbar"
        >
          <ProgressCircle percent={percent} />
        </div>
      ) : (
        <div
          aria-label={labelledBy ? undefined : ariaLabel}
          aria-labelledby={labelledBy}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={current}
          className={getTrackClassName(direction)}
          data-slot="progress-bar"
          role="progressbar"
        >
          <div className={barClass} style={{ width: `${percent}%` }} />
        </div>
      )}

      {showValueLabel ? (
        <ProgressText
          className={valueLabelClassName}
          description={valueLabelDescription}
          direction={resolvedValueLabelDirection}
          id={nameFromValueLabel ? valueLabelId : undefined}
          muted={valueLabelMuted}
        >
          {valueLabel}
        </ProgressText>
      ) : null}
    </div>
  );
}

function isPlainLabel(value: ProgressProps['label']): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}
