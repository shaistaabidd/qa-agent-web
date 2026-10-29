import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useMemo } from 'react';

import { RESOURCE_CATEGORY_ALL, RESOURCE_CATEGORY_OPTIONS } from '../constants';

const CATEGORY_VALUES = [
  RESOURCE_CATEGORY_ALL,
  ...RESOURCE_CATEGORY_OPTIONS.map((option) => option.value),
] as const;

export function useResourceFilters() {
  const [category, setCategory] = useQueryState(
    'category',
    parseAsStringLiteral(CATEGORY_VALUES)
      .withDefault(RESOURCE_CATEGORY_ALL)
      .withOptions({ history: 'replace' }),
  );

  const filters = useMemo(() => ({ category }), [category]);

  return { category, filters, setCategory };
}
