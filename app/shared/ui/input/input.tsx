import { useId } from 'react';

import { cn } from '@/shared/lib/utils';

import { fieldClass } from './constants';
import { InputHelper } from './input-helper';
import type { InputProps } from './types';
import {
  focusInputFromContainer,
  getAdornmentClassName,
  getContainerClassName,
  getControlClassName,
  isInvalidValue,
} from './utils';

export function Input({
  className,
  disabled,
  error = false,
  helperIcon,
  helperText,
  id,
  leftIcon,
  required,
  rightIcon,
  size = 'lg',
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const isInvalid = isInvalidValue(error, ariaInvalid);
  const describedBy =
    [helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn(fieldClass, className)} data-slot="input-field" data-size={size}>
      <div
        className={getContainerClassName(size)}
        data-invalid={isInvalid || undefined}
        data-slot="input-container"
        onMouseDown={focusInputFromContainer}
        role="presentation"
      >
        {leftIcon ? (
          <span className={getAdornmentClassName(size, 'start')} data-slot="input-addon">
            {leftIcon}
          </span>
        ) : null}

        <input
          {...props}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          className={getControlClassName(size)}
          data-slot="input"
          disabled={disabled}
          id={inputId}
          required={required}
        />

        {rightIcon ? (
          <span className={getAdornmentClassName(size, 'end')} data-slot="input-addon">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {helperText ? (
        <InputHelper id={helperId} icon={helperIcon} invalid={isInvalid}>
          {helperText}
        </InputHelper>
      ) : null}
    </div>
  );
}
