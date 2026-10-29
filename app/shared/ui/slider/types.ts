import type { HTMLAttributes } from 'react';

export type SliderType = 'default' | 'range';

export type SliderInteraction = 'default' | 'hover' | 'pressed';

export type SliderRangeValue = readonly [number, number];

type SliderSharedProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & {
  disabled?: boolean;
  interaction?: SliderInteraction;
  max?: number;
  min?: number;
  name?: string;
  step?: number;
};

export interface SliderDefaultProps extends SliderSharedProps {
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  type?: 'default';
  value?: number;
}

export interface SliderRangeProps extends SliderSharedProps {
  defaultValue?: SliderRangeValue;
  onValueChange?: (value: SliderRangeValue) => void;
  type: 'range';
  value?: SliderRangeValue;
}

export type SliderProps = SliderDefaultProps | SliderRangeProps;
