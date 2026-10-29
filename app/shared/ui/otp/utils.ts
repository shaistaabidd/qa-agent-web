import { cn } from '@/shared/lib/utils';

import { controlClass, controlSizeClass, slotClass, slotSizeClass } from './constants';
import type { OtpProps, OtpSize } from './types';

export function getSlotClassName(size: OtpSize, className?: string) {
  return cn(slotClass, slotSizeClass[size], className);
}

export function getControlClassName(size: OtpSize, className?: string) {
  return cn(controlClass, controlSizeClass[size], className);
}

export function isInvalidValue(error: boolean, ariaInvalid: OtpProps['aria-invalid']) {
  return error || ariaInvalid === true || ariaInvalid === 'true';
}

export function toSlotValues(value: string, slots: number) {
  return Array.from({ length: slots }, (_, index) => value[index] ?? '');
}

const DIGIT_ZEROS = [0x30, 0x660, 0x6f0, 0x966, 0xff10];

export function toAsciiDigit(char: string) {
  const code = char.codePointAt(0) ?? 0;

  for (const zero of DIGIT_ZEROS) {
    if (code >= zero && code <= zero + 9) {
      return String(code - zero);
    }
  }

  return '';
}

export function toAsciiDigits(text: string) {
  return Array.from(text, toAsciiDigit).join('');
}
