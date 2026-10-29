import { XIcon } from '@phosphor-icons/react/X';
import { Children, type ReactNode } from 'react';

import { focusNeighbor } from '@/shared/lib/focus';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import { AlertIcon } from './alert-icons';
import { actionClass, contentClass, descriptionClass, textClass, titleClass } from './constants';
import type {
  AlertActionProps,
  AlertCloseProps,
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
} from './types';
import { getIconWrapClassName, getRootClassName, isElementOfType } from './utils';

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <Typography
      as="p"
      className={cn(titleClass, className)}
      data-slot="alert-title"
      fontWeight="medium"
      size="sm"
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <Typography
      as="p"
      className={cn(descriptionClass, className)}
      data-slot="alert-description"
      size="sm"
      {...props}
    />
  );
}

export function AlertAction({ className, ...props }: AlertActionProps) {
  return <div className={cn(actionClass, className)} data-slot="alert-action" {...props} />;
}

export function AlertClose({
  'aria-label': ariaLabel = 'Close',
  className,
  onClick,
  ...props
}: AlertCloseProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      data-slot="alert-close"
      onClick={(event) => {
        const alert = event.currentTarget.closest('[data-slot="alert"]');
        if (alert instanceof HTMLElement) {
          focusNeighbor(alert);
        }
        onClick?.(event);
      }}
      size="icon-sm"
      variant="ghost"
      {...props}
    >
      <XIcon aria-hidden weight="bold" />
    </Button>
  );
}

export function Alert({ children, className, icon, variant = 'info', ...props }: AlertProps) {
  const nodes = Children.toArray(children);
  const title = nodes.find((child) => isElementOfType(child, AlertTitle));
  const description = nodes.find((child) => isElementOfType(child, AlertDescription));
  const action = nodes.find((child) => isElementOfType(child, AlertAction));
  const rest = nodes.filter(
    (child) =>
      !isElementOfType(child, AlertTitle) &&
      !isElementOfType(child, AlertDescription) &&
      !isElementOfType(child, AlertAction),
  );
  const resolvedIcon = resolveIcon(icon, rest, variant);

  return (
    <div
      className={getRootClassName(variant, className)}
      data-slot="alert"
      data-variant={variant}
      role="status"
      {...props}
    >
      {resolvedIcon || title || description ? (
        <div className={contentClass} data-slot="alert-content">
          {resolvedIcon}
          {title || description ? (
            <div className={textClass} data-slot="alert-text">
              {title}
              {description}
            </div>
          ) : null}
        </div>
      ) : null}
      {action}
    </div>
  );
}

function resolveIcon(
  icon: ReactNode | null | undefined,
  rest: ReactNode[],
  variant: AlertProps['variant'],
) {
  const resolvedVariant = variant ?? 'info';

  if (icon === null) {
    return null;
  }

  if (icon !== undefined) {
    return (
      <span className={getIconWrapClassName(resolvedVariant)} data-slot="alert-icon">
        {icon}
      </span>
    );
  }

  if (rest.length > 0) {
    return (
      <span className={getIconWrapClassName(resolvedVariant)} data-slot="alert-icon">
        {rest}
      </span>
    );
  }

  return <AlertIcon variant={resolvedVariant} />;
}
