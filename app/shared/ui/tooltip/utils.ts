import type { Ref } from 'react';

import { cn } from '@/shared/lib/utils';

import {
  arrowClass,
  bodyClass,
  contentClass,
  contentOrientationClass,
  VIEWPORT_PADDING,
} from './constants';
import type { TooltipSide } from './types';

const OPPOSITE_SIDE: Record<TooltipSide, TooltipSide> = {
  bottom: 'top',
  left: 'right',
  right: 'left',
  top: 'bottom',
};

export function composeEventHandlers<E>(
  original?: (event: E) => void,
  handler?: (event: E) => void,
) {
  return (event: E) => {
    original?.(event);
    handler?.(event);
  };
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }
  };
}

export function getContentClassName(side: TooltipSide, className?: string) {
  return cn(contentClass, contentOrientationClass[side], className);
}

export function getBodyClassName(className?: string) {
  return cn(bodyClass, className);
}

export function getArrowClassName(side: TooltipSide) {
  return arrowClass[side];
}

export function getTooltipCoords(
  trigger: DOMRect,
  size: { height: number; width: number },
  side: TooltipSide,
  sideOffset: number,
) {
  let resolvedSide = side;
  let coords = placeTooltip(trigger, size, resolvedSide, sideOffset);

  if (overflowsViewport(coords, size, resolvedSide)) {
    const flipped = OPPOSITE_SIDE[resolvedSide];
    const next = placeTooltip(trigger, size, flipped, sideOffset);

    if (!overflowsViewport(next, size, flipped)) {
      resolvedSide = flipped;
      coords = next;
    }
  }

  return {
    left: clamp(coords.left, VIEWPORT_PADDING, window.innerWidth - size.width - VIEWPORT_PADDING),
    side: resolvedSide,
    top: clamp(coords.top, VIEWPORT_PADDING, window.innerHeight - size.height - VIEWPORT_PADDING),
  };
}

function placeTooltip(
  trigger: DOMRect,
  size: { height: number; width: number },
  side: TooltipSide,
  sideOffset: number,
) {
  if (side === 'top') {
    return {
      left: trigger.left + trigger.width / 2 - size.width / 2,
      top: trigger.top - size.height - sideOffset,
    };
  }

  if (side === 'bottom') {
    return {
      left: trigger.left + trigger.width / 2 - size.width / 2,
      top: trigger.bottom + sideOffset,
    };
  }

  if (side === 'left') {
    return {
      left: trigger.left - size.width - sideOffset,
      top: trigger.top + trigger.height / 2 - size.height / 2,
    };
  }

  return {
    left: trigger.right + sideOffset,
    top: trigger.top + trigger.height / 2 - size.height / 2,
  };
}

function overflowsViewport(
  coords: { left: number; top: number },
  size: { height: number; width: number },
  side: TooltipSide,
) {
  if (side === 'top') {
    return coords.top < VIEWPORT_PADDING;
  }

  if (side === 'bottom') {
    return coords.top + size.height > window.innerHeight - VIEWPORT_PADDING;
  }

  if (side === 'left') {
    return coords.left < VIEWPORT_PADDING;
  }

  return coords.left + size.width > window.innerWidth - VIEWPORT_PADDING;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
