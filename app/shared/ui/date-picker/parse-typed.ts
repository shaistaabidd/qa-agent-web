import type { DateRangeValue } from './types';
import { isBeforeDay } from './utils';

// Typed dates are parsed here so calendar math and input text share one helper.
const SHORT_MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

function dateFromParts(year: number, month: number, day: number) {
  if (month < 0 || month > 11) {
    return undefined;
  }

  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return undefined;
  }

  return date;
}

export function parseTypedDate(text: string) {
  const value = text.trim();
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);

  if (iso) {
    return dateFromParts(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }

  const numeric = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);

  if (numeric) {
    return dateFromParts(Number(numeric[3]), Number(numeric[1]) - 1, Number(numeric[2]));
  }

  const named = /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/.exec(value);

  if (named) {
    const month = SHORT_MONTHS.indexOf(named[1].slice(0, 3).toLowerCase());
    return dateFromParts(Number(named[3]), month, Number(named[2]));
  }

  return undefined;
}

function splitTypedRange(value: string) {
  const byDash = value.split(/\s*[–—-]\s*/);

  if (byDash.length === 2 && byDash.every((part) => parseTypedDate(part))) {
    return byDash;
  }

  const bySlash = value.split(/\s*\/\s*/);

  if (bySlash.length === 2 && bySlash.every((part) => parseTypedDate(part))) {
    return bySlash;
  }

  return [value];
}

export function parseTypedValue(text: string, isRange: boolean): DateRangeValue | null {
  const value = text.trim();

  if (!value) {
    return {};
  }

  if (!isRange) {
    const date = parseTypedDate(value);
    return date ? { from: date } : null;
  }

  const parts = splitTypedRange(value);
  const from = parseTypedDate(parts[0] ?? '');

  if (!from) {
    return null;
  }

  if (parts.length === 1) {
    return { from };
  }

  const to = parseTypedDate(parts[1] ?? '');

  if (!to) {
    return null;
  }

  return isBeforeDay(to, from) ? { from: to, to: from } : { from, to };
}

const DATE_DIGITS = 8;

function maskDate(digits: string) {
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/');
}

// Digits-only typing becomes MM/DD/YYYY (or two of them for a range) as the user types.
export function maskTypedDigits(digits: string, isRange: boolean) {
  const limit = isRange ? DATE_DIGITS * 2 : DATE_DIGITS;
  const clipped = digits.slice(0, limit);
  const first = maskDate(clipped.slice(0, DATE_DIGITS));

  if (!isRange || clipped.length <= DATE_DIGITS) {
    return first;
  }

  return `${first} – ${maskDate(clipped.slice(DATE_DIGITS))}`;
}

export function isTypedDateComplete(digits: string, isRange: boolean) {
  return digits.length === (isRange ? DATE_DIGITS * 2 : DATE_DIGITS);
}
