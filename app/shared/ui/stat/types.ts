import type { HTMLAttributes, ReactNode } from 'react';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  foot?: ReactNode;
  label: ReactNode;
  value: ReactNode;
}
