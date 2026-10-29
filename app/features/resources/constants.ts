import type { CrudTab } from '@/shared/ui/crud';

export const RESOURCES_PATH = '/resources';

export const RESOURCE_TAB_CLIENT = 'client';
export const RESOURCE_TAB_CLINIC = 'clinic';
export const RESOURCE_TAB_ARCHIVED = 'archived';

export const RESOURCE_TABS: CrudTab[] = [
  { label: 'Client Resources', value: RESOURCE_TAB_CLIENT },
  { label: 'Clinic Resources', value: RESOURCE_TAB_CLINIC },
  { label: 'Archived', value: RESOURCE_TAB_ARCHIVED },
];

export const RESOURCE_TYPE_OPTIONS = [
  { label: 'Client Resource', value: 'CLIENT' },
  { label: 'Clinic Resource', value: 'CLINIC' },
];

export const RESOURCE_CATEGORY_OPTIONS = [
  'FAQS',
  'TUTORIALS',
  'NEWS',
  'EDUCATION',
  'MARKETING',
].map((value) => ({ label: value, value }));

export const RESOURCE_CATEGORY_ALL = 'all';

export const RESOURCE_TITLE_MAX_LENGTH = 100;
export const RESOURCE_FILE_ACCEPT = '.pdf,.doc,.docx';
export const RESOURCE_FILE_MAX_BYTES = 100 * 1024 * 1024;
