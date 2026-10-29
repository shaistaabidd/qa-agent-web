import { Combobox } from '@/shared/ui/combobox';

import type { MultiSelectProps } from './types';

export function MultiSelect({ showSelected = true, ...props }: MultiSelectProps) {
  return <Combobox {...props} multiple showSelected={showSelected} />;
}
