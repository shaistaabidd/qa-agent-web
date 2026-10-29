import type { DividerProps } from './types';
import { getLineClassName, getRootClassName } from './utils';

export function Divider({
  className,
  decorative = true,
  orientation = 'horizontal',
  tone = 'subtle',
  ...props
}: DividerProps) {
  return (
    <div
      aria-hidden={decorative ? true : undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={getRootClassName(orientation, className)}
      data-orientation={orientation}
      data-slot="divider"
      data-tone={tone}
      role={decorative ? undefined : 'separator'}
      {...props}
    >
      <span className={getLineClassName(orientation, tone)} />
    </div>
  );
}
