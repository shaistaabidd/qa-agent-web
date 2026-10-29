import { FilterDropdown } from '@/shared/lib/FilterDropdown';

import { CATEGORY_OPTIONS, SEVERITY_OPTIONS, SOURCE_OPTIONS } from '../constants';
import type { FindingFilters } from '../types';

type FindingsFiltersProps = {
  filters: FindingFilters;
  onChange: (name: keyof FindingFilters, value: string) => void;
};

export function FindingsFilters({ filters, onChange }: FindingsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-[8px]">
      <FilterDropdown
        label="Filter by source"
        onChange={(value) => onChange('source', value)}
        options={SOURCE_OPTIONS}
        value={filters.source}
      />
      <FilterDropdown
        label="Filter by severity"
        onChange={(value) => onChange('severity', value)}
        options={SEVERITY_OPTIONS}
        value={filters.severity}
      />
      <FilterDropdown
        label="Filter by category"
        onChange={(value) => onChange('category', value)}
        options={CATEGORY_OPTIONS}
        value={filters.category}
      />
    </div>
  );
}
