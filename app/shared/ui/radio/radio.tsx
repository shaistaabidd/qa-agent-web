import { type ChangeEvent, useId } from 'react';

import { InputHelper } from '../input/input-helper';
import { Label } from '../label';
import {
  controlWrapClass,
  inputClass,
  labelCursorClass,
  labelDisabledCursorClass,
  textClass,
} from './constants';
import { useRadioGroup } from './radio-group';
import type { RadioProps } from './types';
import { getControlClassName, getRootClassName, isInvalidValue } from './utils';

export function Radio({
  bold = true,
  checked,
  className,
  defaultChecked = false,
  description,
  disabled,
  embedded = false,
  error = false,
  helperIcon,
  helperText,
  hint,
  id,
  name,
  onChange,
  onCheckedChange,
  optional,
  placement = 'left',
  required,
  value,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  children,
  ...props
}: RadioProps) {
  const generatedId = useId();
  const radioId = id ?? generatedId;
  const helperId = `${radioId}-helper`;
  const group = useRadioGroup();
  const isGrouped = group !== null;
  const isStandaloneControlled = !isGrouped && checked !== undefined;
  const selected = isGrouped && value != null ? String(value) === group.value : Boolean(checked);
  const isDisabled = disabled || group?.disabled;
  const isInvalid = isInvalidValue(error, ariaInvalid);
  const describedBy =
    [helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const hasText = Boolean(children) || Boolean(helperText);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);

    if (event.target.checked) {
      if (isGrouped) {
        group.onValueChange(event.target.value);
      }

      onCheckedChange?.(true);
    }
  }

  const control = (
    <span className={controlWrapClass} data-slot="radio-control-wrap">
      <input
        {...props}
        aria-describedby={describedBy}
        data-invalid={isInvalid || undefined}
        className={inputClass}
        data-slot="radio"
        disabled={isDisabled}
        id={radioId}
        name={name ?? group?.name}
        onChange={handleChange}
        required={required}
        type="radio"
        value={value}
        {...(isGrouped || isStandaloneControlled ? { checked: selected } : { defaultChecked })}
      />
      <span
        aria-hidden
        className={getControlClassName(undefined, embedded)}
        data-check={isGrouped || isStandaloneControlled ? (selected ? 'on' : 'off') : undefined}
        data-slot="radio-control"
      />
    </span>
  );

  const text = hasText ? (
    <span className={textClass} data-slot="radio-text">
      {children ? (
        <Label
          as="span"
          bold={bold}
          className={isDisabled ? labelDisabledCursorClass : labelCursorClass}
          description={description}
          disabled={isDisabled}
          error={isInvalid}
          hint={hint}
          optional={optional}
          required={required}
        >
          {children}
        </Label>
      ) : null}
      {helperText ? (
        <InputHelper id={helperId} icon={helperIcon} invalid={isInvalid}>
          {helperText}
        </InputHelper>
      ) : null}
    </span>
  ) : null;

  const Root = embedded ? 'div' : 'label';

  return (
    <Root
      className={getRootClassName(className)}
      data-disabled={isDisabled || undefined}
      data-placement={placement}
      data-slot="radio-field"
      {...(embedded ? {} : { htmlFor: radioId })}
    >
      {placement === 'left' ? control : null}
      {text}
      {placement === 'right' ? control : null}
    </Root>
  );
}
