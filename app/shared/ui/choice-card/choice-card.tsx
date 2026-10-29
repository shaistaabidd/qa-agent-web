import { useId } from 'react';

import { Checkbox } from '../checkbox';
import { Radio } from '../radio';
import { Switch } from '../switch';
import { fieldClass } from './constants';
import type { ChoiceCardProps } from './types';
import { getCardClassName } from './utils';

export function ChoiceCard({
  checked,
  children,
  className,
  defaultChecked,
  disabled,
  helperIcon,
  helperText,
  id,
  interaction,
  name,
  onChange,
  onCheckedChange,
  size = 'large',
  type = 'checkbox',
  value,
  ...props
}: ChoiceCardProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const isPreview = interaction !== undefined;
  const Root = disabled && !isPreview ? 'div' : 'label';
  const fieldProps = {
    ...props,
    checked,
    className: fieldClass,
    defaultChecked,
    disabled,
    embedded: true,
    helperIcon,
    helperText,
    id: controlId,
    name,
    onChange,
    onCheckedChange,
    placement: 'right' as const,
    // Previews keep the card label, and stay out of the tab order.
    tabIndex: isPreview ? -1 : props.tabIndex,
    value,
  };

  const field =
    type === 'switch' ? (
      <Switch {...fieldProps}>{children}</Switch>
    ) : type === 'radio' ? (
      <Radio {...fieldProps}>{children}</Radio>
    ) : (
      <Checkbox {...fieldProps}>{children}</Checkbox>
    );

  return (
    <Root
      className={getCardClassName({
        checked: Boolean(checked ?? defaultChecked),
        className,
        interaction,
        size,
      })}
      data-disabled={disabled || undefined}
      data-interaction={interaction}
      data-size={size}
      data-slot="choice-card"
      data-type={type}
    >
      {field}
    </Root>
  );
}
