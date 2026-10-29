import { Typography } from '@/shared/ui/Typography';

import { labelClass } from './constants';
import type { TagProps } from './types';
import { getDotClassName, getTagClassName } from './utils';

function TagLabel({ children }: { children: TagProps['children'] }) {
  return (
    <Typography as="span" className="whitespace-nowrap" fontWeight="medium" variant="caption">
      {children}
    </Typography>
  );
}

export function Tag({
  children,
  className,
  showDot = true,
  size = 'sm',
  variant = 'default',
  ...props
}: TagProps) {
  return (
    <span
      className={getTagClassName({ className, size, variant })}
      data-size={size}
      data-slot="tag"
      data-variant={variant}
      {...props}
    >
      {showDot ? (
        <span aria-hidden className={getDotClassName(size, variant)} data-slot="tag-dot" />
      ) : null}
      <span className={labelClass} data-slot="tag-label">
        <TagLabel>{children}</TagLabel>
      </span>
    </span>
  );
}
