import { CheckIcon } from '@phosphor-icons/react/Check';
import { MinusIcon } from '@phosphor-icons/react/Minus';

import { cn } from '@/shared/lib/utils';

import type { CheckboxCheck } from './types';

const iconClass = 'block size-[16px] shrink-0';

export function CheckboxGlyph({ check }: { check: CheckboxCheck }) {
  if (check === 'indeterminate') {
    return <MinusIcon aria-hidden className={iconClass} weight="bold" />;
  }

  return (
    <CheckIcon
      aria-hidden
      className={cn(iconClass, check !== 'checked' && 'invisible')}
      weight="bold"
    />
  );
}
