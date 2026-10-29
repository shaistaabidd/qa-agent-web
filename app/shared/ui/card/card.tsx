import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

import {
  actionClass,
  cardClass,
  contentClass,
  footerActionsClass,
  footerClass,
  headerClass,
  headerTextClass,
  mediaClass,
} from './constants';
import type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterActionsProps,
  CardFooterProps,
  CardHeaderProps,
  CardHeaderTextProps,
  CardMediaProps,
  CardProps,
  CardTitleProps,
} from './types';

export function Card({
  className,
  interactive = false,
  size = 'default',
  tone = 'default',
  variant = 'default',
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(cardClass, className)}
      data-interactive={interactive || undefined}
      data-size={size}
      data-slot="card"
      data-tone={tone !== 'default' ? tone : undefined}
      data-variant={variant !== 'default' ? variant : undefined}
      role={interactive ? (props.role ?? 'button') : props.role}
      tabIndex={interactive ? 0 : props.tabIndex}
    />
  );
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div {...props} className={cn(headerClass, className)} data-slot="card-header" />;
}

export function CardHeaderText({ className, ...props }: CardHeaderTextProps) {
  return <div {...props} className={cn(headerTextClass, className)} data-slot="card-header-text" />;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <Typography
      {...props}
      as="h3"
      className={cn('text-fg-default', className)}
      data-slot="card-title"
      fontWeight="medium"
      variant="body1"
      size="base"
    />
  );
}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <Typography
      {...props}
      as="p"
      className={cn('text-fg-secondary', className)}
      data-slot="card-description"
      variant="caption"
    />
  );
}

export function CardAction({ className, ...props }: CardActionProps) {
  return <div {...props} className={cn(actionClass, className)} data-slot="card-action" />;
}

export function CardMedia({ className, variant = 'icon', ...props }: CardMediaProps) {
  return (
    <div
      {...props}
      className={cn(mediaClass[variant], className)}
      data-slot="card-media"
      data-variant={variant}
    />
  );
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div {...props} className={cn(contentClass, className)} data-slot="card-content" />;
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div {...props} className={cn(footerClass, className)} data-slot="card-footer" />;
}

export function CardFooterActions({ className, ...props }: CardFooterActionsProps) {
  return (
    <div {...props} className={cn(footerActionsClass, className)} data-slot="card-footer-actions" />
  );
}
