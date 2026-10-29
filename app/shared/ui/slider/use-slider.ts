import { type KeyboardEvent, type PointerEvent, useEffect, useId, useRef, useState } from 'react';

import { useLatestRef } from '@/shared/lib/use-latest-ref';

import { DEFAULT_MAX, DEFAULT_MIN, DEFAULT_STEP } from './constants';
import type { SliderProps, SliderRangeValue } from './types';
import { getDefaultPair, normalizePair, percentToValue, snapToStep, valueToPercent } from './utils';

type Thumb = 'start' | 'end';

function isRangeProps(props: SliderProps): boolean {
  return props.type === 'range';
}

export function useSlider(props: SliderProps) {
  const {
    disabled,
    id,
    interaction,
    max = DEFAULT_MAX,
    min = DEFAULT_MIN,
    name,
    step = DEFAULT_STEP,
  } = props;
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const isRange = isRangeProps(props);
  const isPreview = interaction !== undefined;
  const isInteractive = !disabled && !isPreview;
  const isControlled = props.value !== undefined;
  const [uncontrolledPair, setUncontrolledPair] = useState<[number, number]>(() =>
    getDefaultPair(isRange, min, max, step, props.defaultValue),
  );
  const [dragging, setDragging] = useState<Thumb | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dragThumbRef = useRef<Thumb | null>(null);
  const focusFrameRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(focusFrameRef.current), []);

  const pair: [number, number] = isControlled
    ? normalizePair(isRange, props.value as number | SliderRangeValue, min, max, step)
    : uncontrolledPair;

  const pairRef = useLatestRef(pair);

  const percents = {
    start: valueToPercent(pair[0], min, max),
    end: valueToPercent(pair[1], min, max),
  };

  function emit(next: [number, number]) {
    const current = pairRef.current;

    if (next[0] === current[0] && next[1] === current[1]) {
      return;
    }

    if (!isControlled) {
      setUncontrolledPair(next);
    }

    if (isRange) {
      (props.onValueChange as ((value: SliderRangeValue) => void) | undefined)?.(next);
      return;
    }

    (props.onValueChange as ((value: number) => void) | undefined)?.(next[1]);
  }

  function commit(thumb: Thumb, nextValue: number) {
    const current = pairRef.current;

    if (!isRange) {
      emit([min, nextValue]);
      return;
    }

    if (thumb === 'start') {
      emit([Math.min(nextValue, current[1]), current[1]]);
      return;
    }

    emit([current[0], Math.max(nextValue, current[0])]);
  }

  function valueFromClientX(clientX: number) {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) {
      return pairRef.current[1];
    }

    const percent = ((clientX - rect.left) / rect.width) * 100;
    return percentToValue(percent, min, max, step);
  }

  function pickThumb(nextValue: number): Thumb {
    if (!isRange) {
      return 'end';
    }

    const [start, end] = pairRef.current;
    if (start === end) {
      return nextValue < start ? 'start' : 'end';
    }

    return Math.abs(nextValue - start) <= Math.abs(nextValue - end) ? 'start' : 'end';
  }

  function thumbForPointerMove(active: Thumb, nextValue: number): Thumb {
    const [start, end] = pairRef.current;
    if (start !== end) {
      return active;
    }

    return nextValue < start ? 'start' : 'end';
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!isInteractive || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    event.preventDefault();
    const nextValue = valueFromClientX(event.clientX);
    const thumb = pickThumb(nextValue);
    dragThumbRef.current = thumb;
    setDragging(thumb);
    event.currentTarget.setPointerCapture(event.pointerId);
    commit(thumb, nextValue);
    const thumbId = thumb === 'start' || !isRange ? sliderId : `${sliderId}-end`;
    cancelAnimationFrame(focusFrameRef.current);
    focusFrameRef.current = requestAnimationFrame(() => {
      document.getElementById(thumbId)?.focus();
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const active = dragThumbRef.current;
    if (!active) {
      return;
    }

    const nextValue = valueFromClientX(event.clientX);
    const thumb = thumbForPointerMove(active, nextValue);
    if (thumb !== active) {
      dragThumbRef.current = thumb;
      setDragging(thumb);
    }

    commit(thumb, nextValue);
  }

  function handlePointerUp() {
    dragThumbRef.current = null;
    setDragging(null);
  }

  function handleThumbKeyDown(thumb: Thumb) {
    return (event: KeyboardEvent<HTMLButtonElement>) => {
      if (!isInteractive) {
        return;
      }

      const current = pairRef.current;
      const value = thumb === 'start' ? current[0] : current[1];
      let next = value;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          next = snapToStep(value + step, min, max, step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          next = snapToStep(value - step, min, max, step);
          break;
        case 'PageUp':
          next = snapToStep(value + step * 10, min, max, step);
          break;
        case 'PageDown':
          next = snapToStep(value - step * 10, min, max, step);
          break;
        case 'Home':
          next = min;
          break;
        case 'End':
          next = max;
          break;
        default:
          return;
      }

      event.preventDefault();
      commit(thumb, next);
    };
  }

  return {
    barRef,
    disabled,
    dragging,
    isInteractive,
    isPreview,
    isRange,
    max,
    min,
    name,
    pair,
    percents,
    sliderId,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleThumbKeyDown,
  };
}
