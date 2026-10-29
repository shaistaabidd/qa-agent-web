import type { PaginationOptions } from '@/shared/ui/pagination';

export function resolvePaginationOptions(
  paginationConfig: boolean | PaginationOptions | undefined,
  initialPageSize: number,
): { enabled: boolean; itemLabel: string; label?: string; pageSize: number } {
  if (paginationConfig === false) {
    return { enabled: false, itemLabel: 'items', pageSize: initialPageSize };
  }

  if (typeof paginationConfig === 'object' && paginationConfig !== null) {
    const options = paginationConfig as PaginationOptions;
    return {
      enabled: true,
      itemLabel: options.itemLabel ?? 'items',
      label: options.label,
      pageSize: options.pageSize ?? initialPageSize,
    };
  }

  return { enabled: true, itemLabel: 'items', pageSize: initialPageSize };
}
