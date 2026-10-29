import type { HTMLAttributes, JSX, ReactNode } from 'react';

export type TypographyVariant =
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'body3' | 'caption' | 'footer';

export type TypographySize =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl';

export type TypographyFontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TypographySizeScale = {
  base: TypographySize;
  sm?: TypographySize;
  md?: TypographySize;
  lg?: TypographySize;
  xl?: TypographySize;
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  fontWeight?: TypographyFontWeight;
  size?: TypographySize | TypographySizeScale;
  variant?: TypographyVariant;
}
