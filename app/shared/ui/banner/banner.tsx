import { XIcon } from '@phosphor-icons/react/X';
import type { ReactNode } from 'react';

import { focusNeighbor } from '@/shared/lib/focus';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import { BannerIcon } from './banner-icons';
import { actionClass, contentClass, descriptionClass, textClass, titleClass } from './constants';
import type { BannerProps } from './types';
import { getIconWrapClassName, getRootClassName, isTextAction } from './utils';

export function Banner({
  action,
  className,
  description,
  icon,
  onAction,
  onClose,
  title,
  variant = 'info',
  ...props
}: BannerProps) {
  const resolvedIcon = resolveIcon(icon, variant);
  const showActions = action != null || onClose != null;

  return (
    <div
      className={getRootClassName(variant, className)}
      data-slot="banner"
      data-variant={variant}
      role="status"
      {...props}
    >
      <div className={contentClass} data-slot="banner-content">
        {resolvedIcon}
        <div className={textClass} data-slot="banner-text">
          <Typography
            as="p"
            className={titleClass}
            data-slot="banner-title"
            fontWeight="medium"
            size="sm"
          >
            {title}
          </Typography>
          {description != null && description !== '' ? (
            <Typography
              as="p"
              className={descriptionClass}
              data-slot="banner-description"
              size="sm"
            >
              {description}
            </Typography>
          ) : null}
        </div>
      </div>
      {showActions ? (
        <div className={actionClass} data-slot="banner-action">
          {renderAction(action, onAction)}
          {onClose ? (
            <Button
              aria-label="Close"
              data-slot="banner-close"
              onClick={(event) => {
                const banner = event.currentTarget.closest('[data-slot="banner"]');
                if (banner instanceof HTMLElement) {
                  focusNeighbor(banner);
                }
                onClose();
              }}
              size="icon-sm"
              variant="ghost"
            >
              <XIcon aria-hidden weight="bold" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function renderAction(action: ReactNode, onAction?: () => void) {
  if (action == null) {
    return null;
  }

  if (isTextAction(action)) {
    return (
      <Button onClick={onAction} size="sm" variant="link">
        {action}
      </Button>
    );
  }

  return action;
}

function resolveIcon(icon: ReactNode | null | undefined, variant: BannerProps['variant']) {
  const resolvedVariant = variant ?? 'info';

  if (icon === null) {
    return null;
  }

  if (icon !== undefined) {
    return (
      <span className={getIconWrapClassName(resolvedVariant)} data-slot="banner-icon">
        {icon}
      </span>
    );
  }

  return <BannerIcon variant={resolvedVariant} />;
}
