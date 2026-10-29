import { Checkbox } from '@/shared/ui/checkbox';
import { DropdownItem } from '@/shared/ui/dropdown';
import { useDropdownContext } from '@/shared/ui/dropdown/dropdown-context';
import { isItemSelected, itemMatchesQuery } from '@/shared/ui/dropdown/utils';

import { useComboboxFilter } from './combobox-context';
import type { ComboboxItemProps } from './types';

export function ComboboxItem({ children, rightIcon, ...props }: ComboboxItemProps) {
  const filter = useComboboxFilter();
  const query = filter?.query ?? '';
  const context = useDropdownContext();
  const selected = isItemSelected(props.value, context);
  const checkbox = context?.selectedValues ? (
    <span
      aria-hidden
      className="pointer-events-none flex size-[20px] shrink-0 items-center justify-center overflow-hidden leading-none"
    >
      <Checkbox checked={selected} embedded tabIndex={-1} />
    </span>
  ) : undefined;

  if (!itemMatchesQuery(children, query)) {
    return null;
  }

  return (
    <DropdownItem {...props} rightIcon={rightIcon ?? checkbox}>
      {children}
    </DropdownItem>
  );
}
