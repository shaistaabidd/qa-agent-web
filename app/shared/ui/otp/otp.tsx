import { type FocusEvent, type MouseEvent, useId } from 'react';

import { cn } from '@/shared/lib/utils';

import { InputHelper } from '../input/input-helper';
import { DEFAULT_OTP_SLOTS, fieldClass, groupClass } from './constants';
import type { OtpProps } from './types';
import { useOtp } from './use-otp';
import { getControlClassName, getSlotClassName, isInvalidValue } from './utils';

function selectInput(event: FocusEvent<HTMLInputElement> | MouseEvent<HTMLInputElement>) {
  event.currentTarget.select();
}

export function Otp({
  autoFocus = false,
  className,
  defaultValue,
  disabled,
  error = false,
  helperIcon,
  helperText,
  id,
  name,
  onBlur,
  onChange,
  required,
  size = 'xl',
  slots = DEFAULT_OTP_SLOTS,
  value,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel = 'One-time password',
  'aria-labelledby': ariaLabelledBy,
}: OtpProps) {
  const generatedId = useId();
  const otpId = id ?? generatedId;
  const helperId = `${otpId}-helper`;
  const isInvalid = isInvalidValue(error, ariaInvalid);
  const describedBy =
    [helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const { handleChange, handleKeyDown, handlePaste, inputRefs, inputValues } = useOtp({
    autoFocus,
    defaultValue,
    disabled,
    onChange,
    slots,
    value,
  });

  return (
    <div className={cn(fieldClass, className)} data-size={size} data-slot="otp-field">
      {name ? <input name={name} type="hidden" value={inputValues.join('')} /> : null}

      <div
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={groupClass}
        data-slot="otp-group"
        onBlur={(event) => {
          const next = event.relatedTarget;

          if (next instanceof Node && event.currentTarget.contains(next)) {
            return;
          }

          onBlur?.(event);
        }}
        role="group"
      >
        {inputValues.map((slotValue, index) => {
          const slotId = index === 0 ? otpId : `${otpId}-${index}`;

          return (
            <div
              className={getSlotClassName(size)}
              data-invalid={isInvalid || undefined}
              data-slot="otp-slot"
              key={slotId}
            >
              <input
                aria-describedby={describedBy}
                aria-invalid={isInvalid || undefined}
                aria-label={`Digit ${index + 1}`}
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                className={getControlClassName(size)}
                data-slot="otp-input"
                disabled={disabled}
                id={slotId}
                inputMode="numeric"
                maxLength={index === 0 ? slots : 1}
                onChange={(event) => handleChange(event, index)}
                onFocus={selectInput}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onMouseUp={selectInput}
                onPaste={(event) => handlePaste(event, index)}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                required={required}
                type="tel"
                value={slotValue}
              />
            </div>
          );
        })}
      </div>

      {helperText ? (
        <InputHelper id={helperId} icon={helperIcon} invalid={isInvalid}>
          {helperText}
        </InputHelper>
      ) : null}
    </div>
  );
}
