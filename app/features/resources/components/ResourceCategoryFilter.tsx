import { Dropdown, DropdownItem } from '@/shared/ui/dropdown';

import { RESOURCE_CATEGORY_ALL, RESOURCE_CATEGORY_OPTIONS } from '../constants';

type ResourceCategoryFilterProps = {
  onChange: (category: string) => void;
  value: string;
};

export function ResourceCategoryFilter({ onChange, value }: ResourceCategoryFilterProps) {
  return (
    <div className="w-[200px]">
      <Dropdown aria-label="Filter by category" onValueChange={onChange} size="sm" value={value}>
        <DropdownItem value={RESOURCE_CATEGORY_ALL}>All categories</DropdownItem>
        {RESOURCE_CATEGORY_OPTIONS.map((option) => (
          <DropdownItem key={option.value} value={option.value}>
            {option.label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}
