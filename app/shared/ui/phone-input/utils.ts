import type { FocusEvent, MouseEvent } from 'react';
import { type Country, getCountryCallingCode } from 'react-phone-number-input';

import { cn } from '@/shared/lib/utils';

import { callingCodeClass, flagSizeClass, prefixClass, prefixSizeClass } from './constants';
import type { PhoneInputProps, PhoneInputSize } from './types';

export function getPrefixClassName(size: PhoneInputSize, className?: string) {
  return cn(prefixClass, prefixSizeClass[size], className);
}

export function getFlagClassName(size: PhoneInputSize, className?: string) {
  return cn(
    'relative block shrink-0 overflow-hidden rounded-full bg-bg-muted',
    flagSizeClass[size],
    className,
  );
}

export function getCallingCodeClassName(className?: string) {
  return cn(callingCodeClass, className);
}

export function isInvalidValue(error: boolean, ariaInvalid: PhoneInputProps['aria-invalid']) {
  return error || ariaInvalid === true || ariaInvalid === 'true';
}

export function focusPhoneInputFromContainer(event: MouseEvent<HTMLDivElement>) {
  if ((event.target as HTMLElement).closest('input, button')) {
    return;
  }

  event.preventDefault();
  event.currentTarget.querySelector('input')?.focus();
}

/** The formatter can remount the input mid-edit, which fires a false blur. */
export function deferPhoneFieldBlur(event: FocusEvent<HTMLElement>, onBlur: () => void) {
  const root = event.currentTarget.closest('[data-slot="phone-field"]');

  const timer = window.setTimeout(() => {
    if (root?.contains(document.activeElement)) {
      return;
    }

    onBlur();
  }, 0);

  return () => window.clearTimeout(timer);
}

export function getCallingCodeLabel(country?: string) {
  if (!country) {
    return '';
  }

  try {
    return `+${getCountryCallingCode(country as never)}`;
  } catch {
    return '';
  }
}

export function getFlagSrc(country?: string) {
  if (!country) {
    return undefined;
  }

  return `/images/country-flags/${country.toLowerCase()}.svg`;
}

export function resolveDefaultCountry(
  defaultCountry: Country,
  allowedCountries?: Country[],
): Country {
  if (!allowedCountries || allowedCountries.length === 0) {
    return defaultCountry;
  }

  if (allowedCountries.includes(defaultCountry)) {
    return defaultCountry;
  }

  return allowedCountries[0] ?? defaultCountry;
}

export const TOO_LONG_MESSAGE = 'Phone number is too long';

export function getValidationMessage(allowedCountries?: string[]) {
  if (allowedCountries && allowedCountries.length === 1 && allowedCountries[0] === 'US') {
    return 'Please enter a valid US phone number';
  }

  return 'Please enter a valid phone number';
}
