import type { SidebarIconName } from '@/shared/ui/sidebar';

export type AppNavItem = {
  count?: number;
  icon: SidebarIconName;
  id: string;
  label: string;
  /** Raw user roles that see this link. Leave out to show it to every role in the nav group. */
  roles?: string[];
  to?: string;
};

export type AppNavGroup = {
  items: AppNavItem[];
  label?: string;
};

export type AppPageHeaderProps = {
  description: string;
  title: string;
};
