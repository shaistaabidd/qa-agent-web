import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { useState } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

type TimeOption = { label: string; value: string };

type TimeSelectProps = {
  value: string;
  options: TimeOption[];
  labelOptions?: TimeOption[];
  onValueChange: (value: string) => void;
  'aria-describedby'?: string;
  'aria-label': string;
  invalid?: boolean;
};

function TimeSelect({
  value,
  options,
  labelOptions,
  onValueChange,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  invalid = false,
}: TimeSelectProps) {
  const [open, setOpen] = useState(false);
  const label = (labelOptions ?? options).find((opt) => opt.value === value)?.label ?? value;

  return (
    <DropdownMenu modal={false} onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          className={cn('min-w-[112px] justify-between font-normal', invalid && 'border-danger')}
          data-slot="time-range-select-trigger"
          size="sm"
          type="button"
          variant="outline"
        >
          <span className="truncate">{label}</span>
          <CaretDownIcon
            aria-hidden
            className="size-[16px] shrink-0 text-fg-secondary"
            weight="regular"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          'max-h-[240px] min-w-(--radix-dropdown-menu-trigger-width) overflow-y-auto overscroll-contain',
          scrollbarClass,
        )}
        data-slot="time-range-select-content"
      >
        {options.map((opt) => (
          <DropdownMenuItem
            aria-selected={opt.value === value}
            className={cn(
              'cursor-pointer',
              opt.value === value && 'bg-bg-primary text-fg-on-primary',
            )}
            data-slot="time-range-select-item"
            key={opt.value}
            onSelect={() => {
              onValueChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { TimeSelect };
export type { TimeOption };
