import type { CrudTab } from '@/shared/ui/crud';

export const CO_ADMINS_PATH = '/co-admin';

/** The page lists and invites regular users; super admins can never be invited. */
export const MANAGED_USER_TYPE = 'user';

export const CO_ADMIN_TAB_ACTIVE = 'active';
export const CO_ADMIN_TAB_PENDING = 'pending';
export const CO_ADMIN_TAB_ARCHIVED = 'archived';

export const CO_ADMIN_TABS: CrudTab[] = [
  { label: 'Active', value: CO_ADMIN_TAB_ACTIVE },
  { label: 'Pending Invites', value: CO_ADMIN_TAB_PENDING },
  { label: 'Archived', value: CO_ADMIN_TAB_ARCHIVED },
];

export const MAX_INVITE_EMAILS = 20;
