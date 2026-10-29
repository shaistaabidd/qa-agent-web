import type { HTMLAttributes, ReactNode } from 'react';

export type TabItemInteraction = 'default' | 'hover' | 'active' | 'active-hover';

export type TabsSize = 'default' | 'sm';

export interface TabItemProps {
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  interaction?: TabItemInteraction;
  leftIcon?: ReactNode;
  value?: string;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  tabsId: string;
  value: string;
}

export interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  children: ReactNode;
  defaultValue?: string;
  fullWidth?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  size?: TabsSize;
  value?: string;
}
