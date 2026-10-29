import { useId } from 'react';

import { getDropdownItems } from '@/shared/ui/dropdown/utils';
import { Typography } from '@/shared/ui/Typography';

import { useComboboxFilter } from './combobox-context';
import { groupLabelClass } from './constants';
import type { ComboboxGroupProps } from './types';

export function ComboboxGroup({ children, label }: ComboboxGroupProps) {
  const filter = useComboboxFilter();
  const query = filter?.query ?? '';
  const labelId = useId();
  const matches = getDropdownItems(children, query);

  if (matches.length === 0) {
    return null;
  }

  return (
    <div aria-labelledby={labelId} data-slot="combobox-group" role="group">
      <div className={groupLabelClass} data-slot="combobox-group-label" id={labelId}>
        <Typography
          as="span"
          className="w-full text-overline tracking-[0.06em] text-fg-secondary uppercase"
        >
          {label}
        </Typography>
      </div>
      {children}
    </div>
  );
}
