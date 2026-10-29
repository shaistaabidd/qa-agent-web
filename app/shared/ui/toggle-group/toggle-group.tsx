import { type VariantProps } from 'class-variance-authority';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import type { ComponentProps, CSSProperties } from 'react';
import { createContext, useContext, useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { toggleVariants } from '@/shared/ui/toggle';

const ToggleGroupContext = createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: 'horizontal' | 'vertical';
  }
>({
  size: 'default',
  variant: 'default',
  spacing: 2,
  orientation: 'horizontal',
});

const connectedItemClass = [
  '[&_[data-slot=toggle-group-item]]:rounded-none',
  '[&_[data-slot=toggle-group-item]]:px-[8px]',
  '[&_[data-slot=toggle-group-item]:has-data-[icon=inline-end]]:pr-[6px]',
  '[&_[data-slot=toggle-group-item]:has-data-[icon=inline-start]]:pl-[6px]',
  'data-[orientation=horizontal]:[&_[data-slot=toggle-group-item]:first-child]:rounded-l-[8px]',
  'data-[orientation=vertical]:[&_[data-slot=toggle-group-item]:first-child]:rounded-t-[8px]',
  'data-[orientation=horizontal]:[&_[data-slot=toggle-group-item]:last-child]:rounded-r-[8px]',
  'data-[orientation=vertical]:[&_[data-slot=toggle-group-item]:last-child]:rounded-b-[8px]',
  'data-[orientation=horizontal]:data-[variant=outline]:[&_[data-slot=toggle-group-item]]:border-l-0',
  'data-[orientation=vertical]:data-[variant=outline]:[&_[data-slot=toggle-group-item]]:border-t-0',
  'data-[orientation=horizontal]:data-[variant=outline]:[&_[data-slot=toggle-group-item]:first-child]:border-l',
  'data-[orientation=vertical]:data-[variant=outline]:[&_[data-slot=toggle-group-item]:first-child]:border-t',
].join(' ');

type ToggleGroupExtraProps = VariantProps<typeof toggleVariants> & {
  spacing?: number;
  orientation?: 'horizontal' | 'vertical';
};

type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root> & ToggleGroupExtraProps;

type SingleToggleGroupProps = Extract<
  ComponentProps<typeof ToggleGroupPrimitive.Root>,
  { type: 'single' }
> &
  ToggleGroupExtraProps;

function ToggleGroup(props: ToggleGroupProps) {
  if (props.type === 'single') {
    return <SingleToggleGroup {...props} />;
  }

  return <ToggleGroupRoot {...props} />;
}

function SingleToggleGroup({
  defaultValue,
  onValueChange,
  value,
  ...props
}: SingleToggleGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selected = value !== undefined ? value : (uncontrolledValue ?? '');

  return (
    <ToggleGroupRoot
      {...props}
      onValueChange={(next) => {
        // Single groups are radiogroups: clicking the selected item must not clear it.
        if (!next) return;

        if (value === undefined) {
          setUncontrolledValue(next);
        }

        onValueChange?.(next);
      }}
      type="single"
      value={selected}
    />
  );
}

function ToggleGroupRoot({
  className,
  variant,
  size,
  spacing = 2,
  orientation = 'horizontal',
  children,
  'aria-label': ariaLabel = 'Toggle group',
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      aria-label={ariaLabel}
      className={cn(
        'group/toggle-group flex w-fit flex-row items-center gap-[calc(var(--gap)*4px)] rounded-[8px] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
        spacing === 0 && connectedItemClass,
        className,
      )}
      data-orientation={orientation}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      style={{ '--gap': spacing } as CSSProperties}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        'shrink-0 focus:z-10 focus-visible:z-10',
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
