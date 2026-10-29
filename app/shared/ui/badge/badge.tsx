import type { BadgeProps } from './types';
import { getBadgeClassName, getBadgeContent, getDotClassName } from './utils';

export function Badge({
  children,
  className,
  dot = false,
  size = 'sm',
  style,
  variant,
  ...props
}: BadgeProps) {
  if (dot) {
    const resolved = variant ?? 'error';

    return (
      <span
        className={getDotClassName(resolved, className)}
        data-slot="badge"
        data-variant={resolved}
        style={style}
        {...props}
      />
    );
  }

  const resolved = variant ?? 'neutral';

  return (
    <span
      {...props}
      className={getBadgeClassName(resolved, size, className)}
      data-size={size}
      data-slot="badge"
      data-variant={resolved}
      style={style}
    >
      <span className="min-w-0 max-w-full break-all text-center">{getBadgeContent(children)}</span>
    </span>
  );
}
