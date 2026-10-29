import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type FocusEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import en from 'react-phone-number-input/locale/en.json';

import { cn } from '@/shared/lib/utils';

import { fieldClass } from '../input/constants';
import { InputHelper } from '../input/input-helper';
import { getContainerClassName, getControlClassName } from '../input/utils';
import { DEFAULT_ALLOWED_COUNTRIES, DEFAULT_PHONE_COUNTRY } from './constants';
import { CountrySelect } from './country-select';
import { caretAfterDigits } from './format';
import { PhoneFieldContext, usePhoneField } from './phone-field-context';
import type { PhoneInputProps } from './types';
import { usePhoneInput } from './use-phone-input';
import {
  deferPhoneFieldBlur,
  focusPhoneInputFromContainer,
  isInvalidValue,
  resolveDefaultCountry,
} from './utils';

export function PhoneInput({
  allowedCountries = DEFAULT_ALLOWED_COUNTRIES,
  autoComplete = 'tel',
  className,
  defaultCountry = DEFAULT_PHONE_COUNTRY,
  defaultValue,
  disabled,
  error = false,
  helperIcon,
  helperText,
  id,
  name,
  onBlur,
  onChange,
  onValidationChange,
  placeholder,
  required,
  size = 'lg',
  value,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<{ afterPlus: boolean; digits: number } | null>(null);
  const resolvedDefaultCountry = resolveDefaultCountry(defaultCountry, allowedCountries);
  const {
    country,
    display,
    handleBlur: validateOnBlur,
    handleCountryChange,
    handleInput,
    internalError,
  } = usePhoneInput({
    allowedCountries,
    defaultCountry: resolvedDefaultCountry,
    defaultValue,
    onChange,
    onValidationChange,
    value,
  });
  const countryOptions = useMemo(() => {
    const countries = allowedCountries.length > 0 ? allowedCountries : [resolvedDefaultCountry];

    return countries.map((code) => ({
      label: en[code] ?? code,
      value: code,
    }));
  }, [allowedCountries, resolvedDefaultCountry]);
  const cancelBlurRef = useRef<(() => void) | null>(null);
  useEffect(() => () => cancelBlurRef.current?.(), []);
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    cancelBlurRef.current?.();
    cancelBlurRef.current = deferPhoneFieldBlur(event, () => {
      validateOnBlur();
      onBlur?.(event as FocusEvent<HTMLInputElement>);
    });
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const caret = event.target.selectionStart ?? raw.length;
    const before = raw.slice(0, caret);
    caretRef.current = {
      afterPlus: before.includes('+'),
      digits: before.replace(/\D/g, '').length,
    };
    handleInput(raw);
  };
  const isInvalid = isInvalidValue(error, ariaInvalid) || Boolean(internalError);
  const helper = internalError || helperText;
  const describedBy =
    [helper ? helperId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  useLayoutEffect(() => {
    const input = inputRef.current;
    const caret = caretRef.current;
    if (!input || !caret || document.activeElement !== input) {
      return;
    }

    const next = caretAfterDigits(display, caret.digits, caret.afterPlus);
    input.setSelectionRange(next, next);
    caretRef.current = null;
  }, [display]);

  return (
    <PhoneFieldContext.Provider value={{ size }}>
      <div className={cn(fieldClass, className)} data-size={size} data-slot="phone-field">
        <div
          className={getContainerClassName(size)}
          data-invalid={isInvalid || undefined}
          data-slot="phone-container"
          onMouseDown={focusPhoneInputFromContainer}
          role="presentation"
        >
          <CountrySelect
            disabled={disabled}
            onBlur={handleBlur}
            onChange={(next) => {
              if (!next) {
                return;
              }

              handleCountryChange(next);
              // Focus after paint so the country state commits first.
              window.requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
            options={countryOptions}
            readOnly={allowedCountries.length <= 1}
            value={country}
          />
          <PhoneControl
            aria-describedby={describedBy}
            aria-invalid={isInvalid || undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            autoComplete={autoComplete}
            disabled={disabled}
            id={inputId}
            name={name}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder}
            ref={inputRef}
            required={required}
            value={display}
          />
        </div>

        {helper ? (
          <InputHelper id={helperId} icon={helperIcon} invalid={isInvalid}>
            {helper}
          </InputHelper>
        ) : null}
      </div>
    </PhoneFieldContext.Provider>
  );
}

function PhoneControl({ className, ...props }: ComponentPropsWithRef<'input'>) {
  const { size } = usePhoneField();

  return (
    <input
      {...props}
      className={cn(getControlClassName(size), className)}
      data-slot="phone-input"
      type="tel"
    />
  );
}
