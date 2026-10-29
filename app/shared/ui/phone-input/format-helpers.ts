import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from 'libphonenumber-js/min';

import type { Country } from './types';

export const E164_DIGIT_LIMIT = 15;

const countriesByCallingCode = new Map<string, Country[]>();

for (const country of getCountries()) {
  const code = getCountryCallingCode(country);
  const list = countriesByCallingCode.get(code) ?? [];
  list.push(country);
  countriesByCallingCode.set(code, list);
}

export function emptyDraft(country: Country) {
  return {
    country,
    error: false,
    nationalDigits: '',
  };
}

export function callingCodeValue(country: Country) {
  return `+${getCountryCallingCode(country)}`;
}

export function toE164(country: Country, nationalDigits: string) {
  if (!nationalDigits) {
    return undefined;
  }

  const formatter = new AsYouType(country);
  formatter.input(nationalDigits);
  return formatter.getNumberValue();
}

export function limitNationalDigits(country: Country, digits: string) {
  let next = '';

  for (const digit of digits) {
    const candidate = next + digit;
    if (validatePhoneNumberLength(candidate, country) === 'TOO_LONG') {
      break;
    }
    next = candidate;
  }

  return next;
}

export function isValidNational(country: Country, digits: string) {
  const value = toE164(country, digits);
  return Boolean(value && isValidPhoneNumber(value, country));
}

export function matchCallingCode(digits: string) {
  for (let length = Math.min(3, digits.length); length >= 1; length -= 1) {
    const code = digits.slice(0, length);
    const countries = countriesByCallingCode.get(code);
    if (countries) {
      return { code, countries, rest: digits.slice(length) };
    }
  }

  return undefined;
}

export function couldMatchAllowedCallingCode(partial: string, allowed: Country[]) {
  return allowed.some((country) => getCountryCallingCode(country).startsWith(partial));
}

export function pickCountry(
  candidates: Country[],
  selected: Country,
  e164: string,
  allowedCountries: Country[],
) {
  const parsed = parsePhoneNumberFromString(e164);
  if (parsed?.country && candidates.includes(parsed.country)) {
    return parsed.country;
  }

  if (candidates.includes(selected)) {
    return selected;
  }

  return (
    allowedCountries.find((country) => candidates.includes(country)) ?? candidates[0] ?? selected
  );
}

export function formatInternational(value: string) {
  if (value === '+') {
    return '+';
  }

  return new AsYouType().input(value);
}

export function hasGrouping(value: string) {
  return /[\s()-]/.test(value);
}

export function sameCallingCode(a: Country, b: Country) {
  return getCountryCallingCode(a) === getCountryCallingCode(b);
}

export { getCountryCallingCode };
