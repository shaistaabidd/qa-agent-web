import { cn } from '@/shared/lib/utils';

import {
  baseClass,
  glyphSizeClass,
  ICON_SIZES,
  iconSizeClass,
  linkSizeClass,
  sizeClass,
  variantClass,
} from './constants';
import type { ButtonIconSize, ButtonSizeValue, ButtonVariant } from './types';

export function isIconSize(size: ButtonSizeValue): size is ButtonIconSize {
  return ICON_SIZES.has(size);
}

export function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSizeValue,
  className?: string,
) {
  if (isIconSize(size)) {
    return cn(baseClass, variantClass[variant], iconSizeClass[size], className);
  }

  if (variant === 'link') {
    return cn(baseClass, variantClass.link, linkSizeClass[size], className);
  }

  return cn(baseClass, variantClass[variant], sizeClass[size], className);
}

export function getGlyphClassName(size: ButtonSizeValue) {
  return cn(glyphSizeClass[size], '[&_svg]:size-full');
}
