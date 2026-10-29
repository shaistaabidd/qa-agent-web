import type { OtpSize } from './types';

export const DEFAULT_OTP_SLOTS = 6;

export const fieldClass = 'flex w-full min-w-0 flex-col gap-[8px]';

export const groupClass = 'flex w-full min-w-0 items-center gap-[12px]';

export const slotClass = [
  'group/otp relative box-border flex min-w-0 cursor-text items-center justify-center overflow-hidden border border-default bg-bg-raised outline-none transition-colors',
  'hover:border-strong',
  'focus-within:z-[1] focus-within:border-focus focus-within:shadow-focus',
  'focus-within:hover:border-focus',
  'has-[:disabled]:pointer-events-none has-[:disabled]:cursor-not-allowed has-[:disabled]:border-transparent has-[:disabled]:bg-bg-muted has-[:disabled]:shadow-none',
  'data-[invalid]:border-danger data-[invalid]:hover:border-danger',
  'data-[invalid]:focus-within:border-danger data-[invalid]:focus-within:hover:border-danger data-[invalid]:focus-within:shadow-focus-danger',
].join(' ');

export const slotSizeClass: Record<OtpSize, string> = {
  sm: 'aspect-square max-w-[32px] flex-[1_1_32px] rounded-[6px]',
  md: 'aspect-square max-w-[36px] flex-[1_1_36px] rounded-[8px]',
  lg: 'aspect-square max-w-[40px] flex-[1_1_40px] rounded-[12px]',
  xl: 'aspect-square max-w-[48px] flex-[1_1_48px] rounded-[12px]',
};

export const controlClass =
  'h-full w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-center font-body font-regular text-fg-default shadow-none outline-none disabled:cursor-not-allowed disabled:text-fg-muted';

export const controlSizeClass: Record<OtpSize, string> = {
  sm: 'text-sm leading-[20px]',
  md: 'text-sm leading-[20px]',
  lg: 'text-sm leading-[20px]',
  xl: 'text-base leading-[24px]',
};
