export const SIDEBAR_ICON_NAMES = [
  'dashboard',
  'email',
  'sms',
  'orders',
  'pricing',
  'pharmacy',
  'doctors',
  'patients',
  'settings',
  'notifications',
  'logout',
  'products',
  'prescription',
  'refill',
  'contact',
  'sig',
] as const;

export type SidebarIconName = (typeof SIDEBAR_ICON_NAMES)[number];

export interface SidebarIconProps {
  active?: boolean;
  className?: string;
  name: SidebarIconName;
}
