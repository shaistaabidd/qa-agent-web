import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type LinkTone = 'primary' | 'inherit';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  children: ReactNode;
  disabled?: boolean;
  tone?: LinkTone;
}
