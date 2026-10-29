import type { HTMLAttributes, ReactNode } from 'react';

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface TopBarStartProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface TopBarEndProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface TopBarMenuButtonProps {
  'aria-label'?: string;
  onClick?: () => void;
}
