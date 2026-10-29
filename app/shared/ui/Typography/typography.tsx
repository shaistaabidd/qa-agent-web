import { createElement } from 'react';

import { variantMapping } from './constants';
import type { TypographyProps } from './types';
import { getTypographyClassName } from './utils';

export function Typography({
  as,
  children,
  className,
  fontWeight,
  size,
  variant,
  ...props
}: TypographyProps) {
  const Component = as ?? (variant ? variantMapping[variant] : 'p');

  return createElement(
    Component,
    {
      className: getTypographyClassName(variant, size, fontWeight, className),
      ...props,
    },
    children,
  );
}
