import { Badge } from '@/shared/ui/badge';
import { Typography } from '@/shared/ui/Typography';

import { itemIconClass } from './constants';
import { useSegmentedContext } from './segmented-context';
import type { SegmentedItemProps } from './types';
import { getItemClassName } from './utils';

function ItemBadge({ badge }: { badge: SegmentedItemProps['badge'] }) {
  if (badge == null) {
    return null;
  }

  if (typeof badge === 'string' || typeof badge === 'number') {
    return <Badge variant="neutral">{badge}</Badge>;
  }

  return badge;
}

export function SegmentedItem({
  badge,
  children,
  className,
  interaction,
  leftIcon,
  value,
}: SegmentedItemProps) {
  const context = useSegmentedContext();
  const live = context !== null && interaction === undefined;
  const selected =
    live && context ? Boolean(value && context.value === value) : interaction === 'active';
  const size = context?.size ?? 'default';
  const classNames = getItemClassName({ className, interaction, live, size });

  const content = (
    <>
      {leftIcon ? (
        <span className={itemIconClass} data-slot="segmented-item-icon">
          {leftIcon}
        </span>
      ) : null}
      {children != null && children !== false ? (
        <Typography as="span" className="whitespace-nowrap" fontWeight="medium" variant="body3">
          {children}
        </Typography>
      ) : null}
      <ItemBadge badge={badge} />
    </>
  );

  if (live && context) {
    return (
      <button
        aria-checked={selected}
        className={classNames}
        data-selected={selected || undefined}
        data-slot="segmented-item"
        data-value={value}
        onClick={() => {
          if (value) {
            context.onValueChange(value);
          }
        }}
        role="radio"
        tabIndex={selected ? 0 : -1}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={classNames}
      data-interaction={interaction}
      data-selected={selected || undefined}
      data-slot="segmented-item"
    >
      {content}
    </div>
  );
}
