import { type ChangeEvent, useId, useState } from 'react';

import { InputHelper } from '../input/input-helper';
import { Label } from '../label';
import {
  controlWrapClass,
  embeddedInputClass,
  inputClass,
  labelCursorClass,
  labelDisabledCursorClass,
  textClass,
} from './constants';
import type { SwitchProps } from './types';
import { getControlClassName, getRootClassName, getThumbClassName, isInvalidValue } from './utils';

export function Switch({
  bold = true,
  checked,
  className,
  defaultChecked = false,
  description,
  disabled,
  embedded = false,
  helperIcon,
  helperText,
  hint,
  id,
  onChange,
  onCheckedChange,
  optional,
  placement = 'left',
  required,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  children,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const helperId = `${switchId}-helper`;
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const selected = isControlled ? checked : uncontrolledChecked;
  const check = selected ? 'on' : 'off';
  const isInvalid = isInvalidValue(ariaInvalid);
  const describedBy =
    [helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const hasText = Boolean(children) || Boolean(helperText);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }

    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  }

  const ControlWrap = embedded ? 'span' : 'label';

  const control = (
    <ControlWrap className={controlWrapClass} data-slot="switch-control-wrap">
      <input
        {...props}
        aria-checked={selected}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        checked={selected}
        className={embedded ? embeddedInputClass : inputClass}
        data-slot="switch"
        disabled={disabled}
        id={switchId}
        onChange={handleChange}
        required={required}
        role="switch"
        type="checkbox"
      />
      <span
        aria-hidden
        className={getControlClassName(undefined, embedded)}
        data-check={check}
        data-slot="switch-control"
      >
        <span
          className={getThumbClassName(disabled)}
          data-check={check}
          data-disabled={disabled || undefined}
          data-slot="switch-thumb"
        />
      </span>
    </ControlWrap>
  );

  const text = hasText ? (
    <span className={textClass} data-slot="switch-text">
      {children ? (
        <Label
          as={embedded ? 'span' : 'label'}
          bold={bold}
          className={disabled ? labelDisabledCursorClass : labelCursorClass}
          description={description}
          disabled={disabled}
          hint={hint}
          htmlFor={embedded ? undefined : switchId}
          optional={optional}
          required={required}
        >
          {children}
        </Label>
      ) : null}
      {helperText ? (
        <InputHelper id={helperId} icon={helperIcon}>
          {helperText}
        </InputHelper>
      ) : null}
    </span>
  ) : null;

  return (
    <div
      className={getRootClassName(className)}
      data-disabled={disabled || undefined}
      data-placement={placement}
      data-slot="switch-field"
    >
      {placement === 'left' ? control : null}
      {text}
      {placement === 'right' ? control : null}
    </div>
  );
}
