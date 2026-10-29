import type { HTMLAttributes, ReactNode } from 'react';

export interface PageProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  actions?: ReactNode;
  children?: ReactNode;
}

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface SettingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  children?: ReactNode;
  control?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
}
