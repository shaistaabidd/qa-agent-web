import type { ButtonIconSize, ButtonSize, ButtonVariant } from './types';

export const ICON_SIZES = new Set<string>(['icon-sm', 'icon-md', 'icon-lg', 'icon-xl']);

export const baseClass =
  'group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-full border font-body font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:shadow-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0';

export const variantClass: Record<ButtonVariant, string> = {
  default:
    'border-transparent bg-bg-primary text-fg-on-primary shadow-sm hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))] focus-visible:border-focus disabled:border-transparent disabled:bg-bg-muted disabled:text-fg-muted',
  outline:
    'border-default bg-bg-raised text-fg-default shadow-sm hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))] focus-visible:border-focus disabled:border-transparent disabled:bg-bg-muted disabled:text-fg-muted',
  ghost:
    'border-transparent bg-transparent text-fg-default hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))] focus-visible:border-focus disabled:bg-transparent disabled:text-fg-muted',
  link: 'border-0 bg-transparent p-0 text-fg-primary underline hover:text-fg-default active:text-fg-default disabled:text-fg-muted',
  danger:
    'border-transparent bg-bg-danger text-fg-on-primary shadow-sm hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))] focus-visible:border-focus disabled:border-transparent disabled:bg-bg-muted disabled:text-fg-muted',
};

export const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-[32px] px-[12px] text-label-sm font-medium',
  md: 'h-[40px] px-[16px] text-label-base font-medium',
  lg: 'h-[48px] px-[24px] text-label-lg font-medium',
  xl: 'h-[56px] px-[32px] text-label-lg font-medium',
};

export const linkSizeClass: Record<ButtonSize, string> = {
  sm: 'text-label-sm',
  md: 'text-label-base',
  lg: 'text-label-lg',
  xl: 'text-label-lg',
};

export const iconSizeClass: Record<ButtonIconSize, string> = {
  'icon-sm': 'size-[32px]',
  'icon-md': 'size-[40px]',
  'icon-lg': 'size-[48px]',
  'icon-xl': 'size-[56px]',
};

export const glyphSizeClass: Record<ButtonSize | ButtonIconSize, string> = {
  sm: 'size-[16px]',
  md: 'size-[20px]',
  lg: 'size-[20px]',
  xl: 'size-[20px]',
  'icon-sm': 'size-[16px]',
  'icon-md': 'size-[20px]',
  'icon-lg': 'size-[24px]',
  'icon-xl': 'size-[24px]',
};
