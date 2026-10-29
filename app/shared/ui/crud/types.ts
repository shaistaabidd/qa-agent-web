import type * as React from 'react';

export type CrudSortOrder = 'asc' | 'desc';

export type CrudSortState = {
  field: string;
  order: CrudSortOrder;
} | null;

export type CrudColumn<T> = {
  key: string;
  header: string;
  render?: (row: T, list: CrudListMutators<T>) => React.ReactNode;
  sortable?: boolean;
  mobileLabel?: string;
  hideOnMobile?: boolean;
  pairWith?: string;
  className?: string;
};

export type CrudActionConfirm = {
  title: string;
  description: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
};

/**
 * Handles for the visible list. `insertItem`, `replaceItem` and `removeItem` patch the rows on
 * screen without a request, so use them only when the change cannot move a row across a tab,
 * filter, search or sort boundary (for example flipping a switch on a row). Anything else must
 * call `refetch()`, because only the server knows which rows belong on the page.
 */
export type CrudListMutators<T> = {
  insertItem: (item: T) => void;
  replaceItem: (id: string, item: T) => void;
  removeItem: (id: string) => void;
  /** Reloads the current page from the server. */
  refetch: () => void;
  /** Jumps to page 1. Use with `refetch()` after a create, since new rows are listed first. */
  goToFirstPage: () => void;
};

export type CrudAction<T> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (row: T, list: CrudListMutators<T>) => void | Promise<void>;
  confirm?: CrudActionConfirm;
  isVisible?: (row: T) => boolean;
};

export type CrudFilters = Record<string, unknown>;

export type CrudPageParams = {
  page: number;
  pageSize: number;
  search: string;
  sort: CrudSortState;
  tab: string | null;
  filters: CrudFilters;
};

export type CrudPageResult<T> = {
  items: T[];
  totalCount: number;
};

export type CrudTab = {
  label: string;
  value: string;
  count?: number;
};

export type CrudFieldDef = {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
};

export type CrudEmptyConfig = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export type CrudSearchConfig = {
  placeholder?: string;
  param?: string;
  debounceMs?: number;
};

export type CrudFormRenderApi<TItem = unknown> = {
  close: () => void;
  /** Reload the list after a change. Patch it in place only when the row cannot change page. */
  list: CrudListMutators<TItem>;
  tab: string | null;
  /** Switches the list to another tab and starts from its first page. */
  setTab: (tab: string) => void;
  visible: boolean;
};

type CrudFormBase = {
  title: string;
  description?: string;
  submitLabel?: string;
  addLabel?: string;
  successMessage?: string;
};

export type CrudFormFieldsConfig<TValues extends Record<string, string> = Record<string, string>> =
  CrudFormBase & {
    fields: CrudFieldDef[];
    initialValues?: Partial<TValues>;
    onSubmit: (values: TValues) => Promise<unknown> | unknown;
  };

export type CrudFormCustomConfig<TItem = unknown> = CrudFormBase & {
  render: (api: CrudFormRenderApi<TItem>) => React.ReactNode;
};

export type CrudCreateConfig<
  TItem,
  TValues extends Record<string, string> = Record<string, string>,
> =
  | (CrudFormFieldsConfig<TValues> & {
      onSubmit: (values: TValues) => Promise<TItem | void> | TItem | void;
    })
  | CrudFormCustomConfig<TItem>;

export type CrudEditConfig<TItem, TValues extends Record<string, string> = Record<string, string>> =
  | (CrudFormBase & {
      fields: CrudFieldDef[];
      getValues?: (row: TItem) => TValues;
      onSubmit: (values: TValues, row: TItem) => Promise<TItem> | TItem;
      isVisible?: (row: TItem) => boolean;
    })
  | (CrudFormBase & {
      render: (api: CrudFormRenderApi<TItem> & { row: TItem }) => React.ReactNode;
      isVisible?: (row: TItem) => boolean;
    });

export type CrudDeleteConfig<TItem> = {
  getTitle?: (row: TItem) => string;
  getDescription?: (row: TItem) => string;
  confirmLabel?: string;
  cancelLabel?: string;
  onDelete: (row: TItem) => Promise<void> | void;
};

export function isCrudFormFieldsConfig<TItem>(
  config: CrudFormFieldsConfig | CrudFormCustomConfig<TItem>,
): config is CrudFormFieldsConfig {
  return 'fields' in config;
}

export function isCrudEditFieldsConfig<TItem>(
  config: CrudEditConfig<TItem>,
): config is Extract<CrudEditConfig<TItem>, { fields: CrudFieldDef[] }> {
  return 'fields' in config;
}
