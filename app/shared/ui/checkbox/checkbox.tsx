import { type ChangeEvent, useEffect, useId, useRef, useState } from 'react';

import { InputHelper } from '../input/input-helper';
import { Label } from '../label';
import { CheckboxGlyph } from './checkbox-icons';
import {
  controlWrapClass,
  inputClass,
  labelCursorClass,
  labelDisabledCursorClass,
  textClass,
} from './constants';
import type { CheckboxChecked, CheckboxProps } from './types';
import { getCheckState, getControlClassName, getRootClassName, isInvalidValue } from './utils';

export function Checkbox({
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
  onChange,
  onCheckedChange,
  optional,
  placement = 'left',
  required,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  children,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const helperId = `${checkboxId}-helper`;
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const value: CheckboxChecked = isControlled ? checked : uncontrolledChecked;
  const check = getCheckState(value);
  const isInvalid = isInvalidValue(error, ariaInvalid);
  const describedBy =
    [helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const hasText = Boolean(children) || Boolean(helperText);
  const iconOnly = embedded && !hasText;

  useEffect(() => {
    const node = inputRef.current;
    if (!node) {
      return;
    }

    node.indeterminate = value === 'indeterminate';
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }

    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  }

  const ControlWrap = embedded ? 'span' : 'label';

  const control = (
    <ControlWrap className={controlWrapClass} data-slot="checkbox-control-wrap">
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        checked={value === true}
        className={inputClass}
        data-slot="checkbox"
        disabled={disabled}
        id={checkboxId}
        onChange={handleChange}
        ref={inputRef}
        required={required}
        type="checkbox"
      />
      <span
        aria-hidden
        className={getControlClassName(undefined, embedded)}
        data-check={check}
        data-slot="checkbox-control"
      >
        <CheckboxGlyph check={check} />
      </span>
    </ControlWrap>
  );

  const text = hasText ? (
    <span className={textClass} data-slot="checkbox-text">
      {children ? (
        <Label
          bold={bold}
          className={disabled ? labelDisabledCursorClass : labelCursorClass}
          description={description}
          disabled={disabled}
          error={isInvalid}
          hint={hint}
          htmlFor={checkboxId}
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

  return (
    <div
      className={getRootClassName(className, iconOnly)}
      data-disabled={disabled || undefined}
      data-placement={placement}
      data-slot="checkbox-field"
    >
      {placement === 'left' ? control : null}
      {text}
      {placement === 'right' ? control : null}
    </div>
  );
}
