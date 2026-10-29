import { DASHBOARD_PATH } from '@/features/auth';
import { CO_ADMINS_PATH } from '@/features/co-admins';
import { EMAIL_LOGS_PATH } from '@/features/email-logs';
import { SMS_LOGS_PATH } from '@/features/sms-logs';
import { Role } from '@/shared/lib/constants';

import type { AppNavGroup } from './types';

export type AppRole = 'admin' | 'patient' | 'pharmacy' | 'provider' | 'user';

export const APP_ROLE = 'admin' as AppRole;

export const SETTINGS_PATH = '/settings';
export const LOGIN_PATH = '/login';
export { DASHBOARD_PATH };

const ADMIN_PROFILE = {
  name: 'Yaakov',
  role: 'Super Admin',
} as const;

const USER_PROFILE = {
  name: 'User',
  role: 'User',
} as const;

const PATIENT_PROFILE = {
  name: 'John Doe',
  role: 'Patient',
} as const;

const PHARMACY_PROFILE = {
  name: 'bmiMD',
  role: 'Pharmacy',
} as const;

const PROVIDER_PROFILE = {
  name: 'Sara Kruger',
  role: 'Provider',
} as const;

const ADMIN_NAV_GROUPS: AppNavGroup[] = [
  {
    items: [
      {
        icon: 'dashboard',
        id: 'dashboard',
        label: 'Dashboard',
        to: DASHBOARD_PATH,
      },
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
      // Resources and CRUD return when their APIs exist.
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

const USER_NAV_GROUPS: AppNavGroup[] = [
  {
    items: [
      {
        icon: 'dashboard',
        id: 'dashboard',
        label: 'Dashboard',
        to: DASHBOARD_PATH,
      },
    ],
  },
];

const PATIENT_NAV_GROUPS: AppNavGroup[] = [
  {
    items: [
      {
        icon: 'dashboard',
        id: 'dashboard',
        label: 'Dashboard',
        to: DASHBOARD_PATH,
      },
    ],
  },
  // {
  //   items: [
  //     {
  //       icon: 'prescription',
  //       id: 'treatment-plans',
  //       label: 'Treatment Plans',
  //     },
  //     { count: 24, icon: 'orders', id: 'orders', label: 'Orders' },
  //     { icon: 'refill', id: 'refills', label: 'Refills' },
  //   ],
  //   label: 'Operations',
  // },
];

const PHARMACY_NAV_GROUPS: AppNavGroup[] = [
  {
    items: [
      {
        icon: 'dashboard',
        id: 'dashboard',
        label: 'Dashboard',
        to: DASHBOARD_PATH,
      },
    ],
  },
  // {
  //   items: [
  //     { count: 24, icon: 'orders', id: 'orders', label: 'Orders' },
  //     { icon: 'products', id: 'products', label: 'Products' },
  //     { icon: 'sig', id: 'sig-templates', label: 'SIG Templates' },
  //   ],
  //   label: 'Operation',
  // },
];

const PROVIDER_NAV_GROUPS: AppNavGroup[] = [
  {
    items: [
      {
        icon: 'dashboard',
        id: 'dashboard',
        label: 'Dashboard',
        to: DASHBOARD_PATH,
      },
    ],
  },
  // {
  //   items: [
  //     {
  //       icon: 'prescription',
  //       id: 'treatment-plans',
  //       label: 'Treatment Plans',
  //     },
  //     { count: 24, icon: 'orders', id: 'orders', label: 'Orders' },
  //     { count: 24, icon: 'products', id: 'products', label: 'Products' },
  //     { icon: 'refill', id: 'refills', label: 'Refills' },
  //     { icon: 'sig', id: 'sig-templates', label: 'SIG Templates' },
  //   ],
  //   label: 'Operations',
  // },
  // {
  //   items: [{ icon: 'patients', id: 'patients', label: 'Patients' }],
  //   label: 'Users',
  // },
];

const APP_PROFILES = {
  admin: ADMIN_PROFILE,
  patient: PATIENT_PROFILE,
  pharmacy: PHARMACY_PROFILE,
  provider: PROVIDER_PROFILE,
  user: USER_PROFILE,
} as const;

const APP_NAVS: Record<AppRole, AppNavGroup[]> = {
  admin: ADMIN_NAV_GROUPS,
  patient: PATIENT_NAV_GROUPS,
  pharmacy: PHARMACY_NAV_GROUPS,
  provider: PROVIDER_NAV_GROUPS,
  user: USER_NAV_GROUPS,
};

export const APP_PROFILE = APP_PROFILES[APP_ROLE];
export const APP_NAV_GROUPS = APP_NAVS[APP_ROLE];

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

export function getAppCredits(role: AppRole) {
  return role === 'patient' ? { amount: '$89.03', label: 'Credits Available' } : null;
}

export const APP_CREDITS = getAppCredits(APP_ROLE);
