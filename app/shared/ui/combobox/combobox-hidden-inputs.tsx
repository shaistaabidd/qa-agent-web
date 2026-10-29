import { hiddenInputClass } from '@/shared/ui/dropdown/constants';
import type { DropdownItemMeta } from '@/shared/ui/dropdown/types';

export function ComboboxHiddenInputs({
  multiple,
  name,
  selectedItems,
  selectedValue,
}: {
  multiple: boolean;
  name: string;
  selectedItems: DropdownItemMeta[];
  selectedValue: string | string[] | undefined;
}) {
  if (multiple) {
    return selectedItems.map((item) => (
      <input
        className={hiddenInputClass}
        key={item.value}
        name={name}
        readOnly
        value={item.value}
      />
    ));
  }

  return (
    <input
      className={hiddenInputClass}
      name={name}
      readOnly
      value={typeof selectedValue === 'string' ? selectedValue : ''}
    />
  );
}
