import { Dropdown, DropdownItem } from '@/shared/ui/dropdown';

type Option = {
  label: string;
  value: string;
};

type FilterDropdownProps = {
  label: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  value: string;
};

/** A compact select for list filters, built from the design-system Dropdown. */
export function FilterDropdown({ label, onChange, options, value }: FilterDropdownProps) {
  return (
    <Dropdown aria-label={label} onValueChange={onChange} size="md" value={value}>
      {options.map((option) => (
        <DropdownItem key={option.value} value={option.value}>
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
