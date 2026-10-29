import { cn } from '@/shared/lib/utils';

import {
  badgeClass,
  badgeInteractionClass,
  badgeStateClass,
  connectorWrapClass,
  itemDirectionClass,
  itemLayoutClass,
  rootAlignClass,
  rootDirectionClass,
} from './constants';
import type {
  StepperDirection,
  StepperInteraction,
  StepperItemDirection,
  StepperState,
} from './types';

export function getBadgeClassName(
  state: StepperState,
  interaction: StepperInteraction,
  className?: string,
) {
  const stateClass =
    state === 'default' ? badgeInteractionClass[interaction] : badgeStateClass[state];

  return cn(badgeClass, stateClass, className);
}

export function getItemClassName(
  stepperDirection: StepperDirection,
  itemDirection: StepperItemDirection,
  className?: string,
  distributed = false,
) {
  return cn(
    itemDirectionClass[itemDirection],
    distributed ? itemLayoutClass[`${stepperDirection}-${itemDirection}`] : 'shrink-0',
    className,
  );
}

export function getRootClassName(
  direction: StepperDirection,
  itemDirection: StepperItemDirection,
  className?: string,
) {
  return cn(
    rootDirectionClass[direction],
    rootAlignClass[`${direction}-${itemDirection}`],
    className,
  );
}

export function getConnectorWrapClassName(
  direction: StepperDirection,
  itemDirection: StepperItemDirection,
) {
  return connectorWrapClass[`${direction}-${itemDirection}`];
}

export function usesOverlayConnectors(
  stepperDirection: StepperDirection,
  itemDirection: StepperItemDirection,
) {
  return stepperDirection === 'horizontal' && itemDirection === 'vertical';
}

export function hasStepperText(value: unknown) {
  return value != null && value !== '';
}
