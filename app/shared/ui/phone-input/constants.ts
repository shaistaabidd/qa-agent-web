import type { Country } from 'react-phone-number-input';

import type { PhoneInputSize } from './types';

export const DEFAULT_PHONE_COUNTRY: Country = 'US';
export const DEFAULT_ALLOWED_COUNTRIES: Country[] = [DEFAULT_PHONE_COUNTRY];
export const COUNTRY_MENU_MIN_WIDTH = 280;

export const prefixClass = [
  'flex shrink-0 items-center gap-[4px] self-stretch font-body font-regular text-fg-default outline-none',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-fg-muted',
].join(' ');

export const prefixSizeClass: Record<PhoneInputSize, string> = {
  sm: 'py-[6px] pl-[12px] text-sm',
  md: 'py-[8px] pl-[12px] text-sm',
  lg: 'py-[10px] pl-[12px] text-sm',
  xl: 'py-[12px] pl-[12px] text-base',
};

export const flagSizeClass: Record<PhoneInputSize, string> = {
  sm: 'size-[16px]',
  md: 'size-[20px]',
  lg: 'size-[24px]',
  xl: 'size-[24px]',
};

export const callingCodeClass = 'whitespace-nowrap';

export const countryRootClass = 'flex self-stretch';
