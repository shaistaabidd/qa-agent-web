import type { HTMLAttributes, ReactNode } from 'react';

export const STEPPER_DIRECTIONS = ['horizontal', 'vertical'] as const;

export type StepperDirection = (typeof STEPPER_DIRECTIONS)[number];

export const STEPPER_ITEM_DIRECTIONS = ['horizontal', 'vertical'] as const;

export type StepperItemDirection = (typeof STEPPER_ITEM_DIRECTIONS)[number];

export const STEPPER_STATES = ['default', 'current', 'success', 'error'] as const;

export type StepperState = (typeof STEPPER_STATES)[number];

export const STEPPER_INTERACTIONS = ['default', 'hover'] as const;

export type StepperInteraction = (typeof STEPPER_INTERACTIONS)[number];

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StepperDirection;
  itemDirection?: StepperItemDirection;
}

export interface StepperItemProps extends HTMLAttributes<HTMLDivElement> {
  description?: ReactNode;
  direction?: StepperItemDirection;
  interaction?: StepperInteraction;
  isLast?: boolean;
  label?: ReactNode;
  state?: StepperState;
  step?: ReactNode;
}

export interface StepperBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  interaction?: StepperInteraction;
  state?: StepperState;
  step?: ReactNode;
}
