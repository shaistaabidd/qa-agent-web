import { HOME_PATH } from '@/features/auth';
import { CO_ADMINS_PATH } from '@/features/co-admins';
import { EMAIL_LOGS_PATH } from '@/features/email-logs';
import { SMS_LOGS_PATH } from '@/features/sms-logs';
import { Role } from '@/shared/lib/constants';

import type { AppNavGroup } from './types';

export type AppRole = 'admin' | 'user';

export const SETTINGS_PATH = '/settings';
export const LOGIN_PATH = '/login';
export { HOME_PATH };

const APP_PROFILES = {
  admin: { name: 'Admin', role: 'Super Admin' },
  user: { name: 'User', role: 'User' },
} as const;

const USER_NAV_GROUPS: AppNavGroup[] = [
  {
    items: [{ icon: 'dashboard', id: 'projects', label: 'Projects', to: HOME_PATH }],
  },
];

const ADMIN_NAV_GROUPS: AppNavGroup[] = [
  {
    items: [
      ...USER_NAV_GROUPS.flatMap((group) => group.items),
      {
        icon: 'email',
        id: 'email-logs',
        label: 'Email Logs',
        roles: [Role.SUPER_ADMIN],
        to: EMAIL_LOGS_PATH,
      },
      {
        icon: 'sms',
        id: 'sms-logs',
        label: 'SMS Logs',
        roles: [Role.SUPER_ADMIN],
        to: SMS_LOGS_PATH,
      },
      {
        icon: 'patients',
        id: 'co-admins',
        label: 'Users',
        roles: [Role.SUPER_ADMIN],
        to: CO_ADMINS_PATH,
      },
    ],
  },
];

const APP_NAVS: Record<AppRole, AppNavGroup[]> = {
  admin: ADMIN_NAV_GROUPS,
  user: USER_NAV_GROUPS,
};

export function getAppNavGroups(role: AppRole) {
  return APP_NAVS[role];
}

export function getAppProfile(role: AppRole, name?: string) {
  const fallback = APP_PROFILES[role];

  return {
    name: name?.trim() || fallback.name,
    role: fallback.role,
  };
}
