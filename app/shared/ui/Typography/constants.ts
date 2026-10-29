import type { JSX } from 'react';

import type { TypographyFontWeight, TypographySize, TypographyVariant } from './types';

export const HEADING_VARIANTS = new Set<TypographyVariant>(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export const variantStyles: Record<TypographyVariant, string> = {
  h1: 'font-heading',
  h2: 'font-heading',
  h3: 'font-heading',
  h4: 'font-heading',
  h5: 'font-heading',
  h6: 'font-heading',
  body1: 'font-body',
  body2: 'font-body',
  body3: 'font-body',
  caption: 'font-body',
  footer: 'font-body',
};

export const variantSize: Record<TypographyVariant, TypographySize> = {
  h1: '6xl',
  h2: '5xl',
  h3: '4xl',
  h4: '3xl',
  h5: '2xl',
  h6: 'xl',
  body1: 'lg',
  body2: 'base',
  body3: 'sm',
  caption: 'xs',
  footer: 'xxs',
};

export const variantMapping: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  body3: 'p',
  caption: 'span',
  footer: 'p',
};

export const fontWeightClass: Record<TypographyFontWeight, string> = {
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const sizeClass: Record<TypographySize, string> = {
  xxs: 'text-xxs',
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
};

export const smSizeClass: Record<TypographySize, string> = {
  xxs: 'sm:text-xxs',
  xs: 'sm:text-xs',
  sm: 'sm:text-sm',
  base: 'sm:text-base',
  lg: 'sm:text-lg',
  xl: 'sm:text-xl',
  '2xl': 'sm:text-2xl',
  '3xl': 'sm:text-3xl',
  '4xl': 'sm:text-4xl',
  '5xl': 'sm:text-5xl',
  '6xl': 'sm:text-6xl',
  '7xl': 'sm:text-7xl',
  '8xl': 'sm:text-8xl',
  '9xl': 'sm:text-9xl',
};

export const mdSizeClass: Record<TypographySize, string> = {
  xxs: 'md:text-xxs',
  xs: 'md:text-xs',
  sm: 'md:text-sm',
  base: 'md:text-base',
  lg: 'md:text-lg',
  xl: 'md:text-xl',
  '2xl': 'md:text-2xl',
  '3xl': 'md:text-3xl',
  '4xl': 'md:text-4xl',
  '5xl': 'md:text-5xl',
  '6xl': 'md:text-6xl',
  '7xl': 'md:text-7xl',
  '8xl': 'md:text-8xl',
  '9xl': 'md:text-9xl',
};

export const lgSizeClass: Record<TypographySize, string> = {
  xxs: 'lg:text-xxs',
  xs: 'lg:text-xs',
  sm: 'lg:text-sm',
  base: 'lg:text-base',
  lg: 'lg:text-lg',
  xl: 'lg:text-xl',
  '2xl': 'lg:text-2xl',
  '3xl': 'lg:text-3xl',
  '4xl': 'lg:text-4xl',
  '5xl': 'lg:text-5xl',
  '6xl': 'lg:text-6xl',
  '7xl': 'lg:text-7xl',
  '8xl': 'lg:text-8xl',
  '9xl': 'lg:text-9xl',
};

export const xlSizeClass: Record<TypographySize, string> = {
  xxs: 'xl:text-xxs',
  xs: 'xl:text-xs',
  sm: 'xl:text-sm',
  base: 'xl:text-base',
  lg: 'xl:text-lg',
  xl: 'xl:text-xl',
  '2xl': 'xl:text-2xl',
  '3xl': 'xl:text-3xl',
  '4xl': 'xl:text-4xl',
  '5xl': 'xl:text-5xl',
  '6xl': 'xl:text-6xl',
  '7xl': 'xl:text-7xl',
  '8xl': 'xl:text-8xl',
  '9xl': 'xl:text-9xl',
};
