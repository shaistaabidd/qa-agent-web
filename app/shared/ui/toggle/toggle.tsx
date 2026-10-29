import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

const toggleVariants = cva(
  [
    'group/toggle inline-flex cursor-pointer items-center justify-center gap-[4px] rounded-[8px] text-sm font-medium whitespace-nowrap outline-none',
    'transition-[color,background-color,border-color,box-shadow]',
    'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] hover:text-fg-default',
    'focus-visible:border-focus focus-visible:shadow-focus',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-danger',
    'aria-pressed:bg-bg-muted data-[state=on]:bg-bg-muted',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-subtle bg-transparent hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
      },
      size: {
        default:
          'h-8 min-w-8 px-[10px] has-data-[icon=inline-end]:pr-[8px] has-data-[icon=inline-start]:pl-[8px]',
        sm: "h-7 min-w-7 rounded-[8px] px-[10px] text-xs has-data-[icon=inline-end]:pr-[6px] has-data-[icon=inline-start]:pl-[6px] [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 min-w-9 px-[10px] has-data-[icon=inline-end]:pr-[8px] has-data-[icon=inline-start]:pl-[8px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ variant, size, className }))}
      data-size={size}
      data-slot="toggle"
      data-variant={variant}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
