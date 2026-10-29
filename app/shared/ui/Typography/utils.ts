import { cn } from '@/shared/lib/utils';

import {
  fontWeightClass,
  HEADING_VARIANTS,
  lgSizeClass,
  mdSizeClass,
  sizeClass,
  smSizeClass,
  variantSize,
  variantStyles,
  xlSizeClass,
} from './constants';
import type {
  TypographyFontWeight,
  TypographySize,
  TypographySizeScale,
  TypographyVariant,
} from './types';

export function getFontFamilyClass(variant?: TypographyVariant) {
  if (variant && HEADING_VARIANTS.has(variant)) {
    return 'font-heading';
  }

  return 'font-body';
}

export function getFontWeightClass(variant?: TypographyVariant, fontWeight?: TypographyFontWeight) {
  if (fontWeight) {
    return fontWeightClass[fontWeight];
  }

  if (variant && HEADING_VARIANTS.has(variant)) {
    return 'font-bold';
  }

  return 'font-regular';
}

export function getResolvedSize(
  variant?: TypographyVariant,
  size?: TypographySize | TypographySizeScale,
) {
  return size ?? (variant ? variantSize[variant] : 'base');
}

export function getSizeClassName(size: TypographySize | TypographySizeScale) {
  if (typeof size === 'string') {
    return sizeClass[size];
  }

  return cn(
    sizeClass[size.base],
    size.sm && smSizeClass[size.sm],
    size.md && mdSizeClass[size.md],
    size.lg && lgSizeClass[size.lg],
    size.xl && xlSizeClass[size.xl],
  );
}

export function getTypographyClassName(
  variant?: TypographyVariant,
  size?: TypographySize | TypographySizeScale,
  fontWeight?: TypographyFontWeight,
  className?: string,
) {
  const fontClass = variant ? variantStyles[variant] : getFontFamilyClass(variant);
  const resolvedSize = getResolvedSize(variant, size);

  return cn(
    fontClass,
    getSizeClassName(resolvedSize),
    getFontWeightClass(variant, fontWeight),
    className,
  );
}
