import { Typography } from '@/shared/ui/Typography';

import { titleVariant } from './constants';
import type { EmptyStateProps } from './types';
import {
  bodyClass,
  getFrameClassName,
  getIconClassName,
  getRootClassName,
  getTextClassName,
} from './utils';

export function EmptyState({
  children,
  className,
  icon,
  size = 'md',
  subheading,
  title,
  variant = 'default',
  ...props
}: EmptyStateProps) {
  return (
    <div
      {...props}
      className={getRootClassName(size, variant, className)}
      data-size={size}
      data-slot="empty-state"
      data-variant={variant !== 'default' ? variant : undefined}
    >
      <div className={getFrameClassName(size)}>
        <div className={getIconClassName(size)} data-slot="empty-state-icon">
          {icon}
        </div>
        <div className={bodyClass} data-slot="empty-state-body">
          <div className={getTextClassName(size)} data-slot="empty-state-text">
            <Typography
              className="text-fg-default"
              fontWeight="medium"
              variant={titleVariant[size]}
            >
              {title}
            </Typography>
            <Typography className="text-fg-secondary" variant="body3">
              {subheading}
            </Typography>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
