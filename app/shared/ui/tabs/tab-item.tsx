import { Badge } from '@/shared/ui/badge';
import { Typography } from '@/shared/ui/Typography';

import { itemIconClass } from './constants';
import { useTabsContext } from './tabs-context';
import type { TabItemProps } from './types';
import { getInnerClassName, getItemClassName, getPanelId, getTabId, isTabSelected } from './utils';

function ItemBadge({ badge, selected }: { badge: TabItemProps['badge']; selected: boolean }) {
  if (badge == null) {
    return null;
  }

  if (typeof badge === 'string' || typeof badge === 'number') {
    return <Badge variant={selected ? 'primary' : 'neutral'}>{badge}</Badge>;
  }

  return badge;
}

export function TabItem({
  badge,
  children,
  className,
  interaction,
  leftIcon,
  value,
}: TabItemProps) {
  const context = useTabsContext();
  const live = context !== null && interaction === undefined;
  const selected =
    live && context ? Boolean(value && context.value === value) : isTabSelected(interaction);
  const fullWidth = context?.fullWidth ?? false;
  const size = context?.size ?? 'default';
  const classNames = getItemClassName({
    className,
    fullWidth,
    interaction,
    live,
    size,
  });
  const innerClassName = getInnerClassName();

  const content = (
    <span className={innerClassName} data-slot="tab-item-inner">
      {leftIcon ? (
        <span className={itemIconClass} data-slot="tab-item-icon">
          {leftIcon}
        </span>
      ) : null}
      <Typography as="span" className="whitespace-nowrap" fontWeight="medium" variant="body3">
        {children}
      </Typography>
      <ItemBadge badge={badge} selected={selected} />
    </span>
  );

  if (live && context) {
    return (
      <button
        aria-controls={context.id && value ? getPanelId(context.id, value) : undefined}
        aria-selected={selected}
        className={classNames}
        data-selected={selected || undefined}
        data-slot="tab-item"
        data-value={value}
        id={context.id && value ? getTabId(context.id, value) : undefined}
        onClick={() => {
          if (value) {
            context.onValueChange(value);
          }
        }}
        role="tab"
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
      data-slot="tab-item"
    >
      {content}
    </div>
  );
}
