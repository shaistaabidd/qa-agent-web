import { XIcon } from '@phosphor-icons/react/X';
import { type MouseEvent, type ReactNode, useCallback, useLayoutEffect, useRef } from 'react';

import { focusNeighbor, moveFocus } from '@/shared/lib/focus';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Typography } from '@/shared/ui/Typography';

import {
  labelClass,
  leftAdornmentClass,
  mainClass,
  removeClass,
  rightIconClass,
} from './constants';
import type { ChipProps, ChipSize } from './types';
import { getChipClassName, getCountBadgeVariant, isChipSelected } from './utils';

function chipButton(element: Element | null) {
  if (!(element instanceof HTMLElement) || element.dataset.slot !== 'chip') {
    return null;
  }

  if (element instanceof HTMLButtonElement) {
    return element;
  }

  const button =
    element.querySelector<HTMLButtonElement>('[data-slot="chip-remove"]') ??
    element.querySelector<HTMLButtonElement>('button');

  return button;
}

function ChipCount({
  count,
  selected,
  variant,
  interaction,
}: {
  count: ReactNode;
  selected: boolean;
  variant: ChipProps['variant'];
  interaction: ChipProps['interaction'];
}) {
  if (count == null) {
    return null;
  }

  if (typeof count === 'string' || typeof count === 'number') {
    return (
      <Badge
        className={selected ? 'bg-bg-raised' : undefined}
        variant={getCountBadgeVariant({
          interaction,
          selected,
          variant: variant ?? 'default',
        })}
      >
        {count}
      </Badge>
    );
  }

  return count;
}

function ChipLabel({ children, size }: { children: ReactNode; size: ChipSize }) {
  return (
    <Typography
      as="span"
      className="whitespace-nowrap"
      fontWeight="medium"
      variant={size === 'lg' ? 'body3' : 'caption'}
    >
      {children}
    </Typography>
  );
}

export function Chip({
  children,
  className,
  count,
  disabled,
  interaction,
  leftAdornment,
  onClick,
  onRemove,
  removeLabel,
  rightIcon,
  selected,
  size = 'sm',
  type = 'button',
  variant = 'default',
  ...props
}: ChipProps) {
  const restoreRef = useRef<HTMLElement | null>(null);
  const isPreview = interaction !== undefined;

  const setRestoreNode = useCallback((node: HTMLElement | null) => {
    restoreRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const node = restoreRef.current;

    return () => {
      // Focus is inside this chip, and the chip is leaving the page.
      if (!node?.contains(document.activeElement)) {
        return;
      }

      const nextChip =
        chipButton(node.nextElementSibling) ?? chipButton(node.previousElementSibling);

      if (nextChip) {
        moveFocus(nextChip);
        return;
      }

      focusNeighbor(node);
    };
  }, []);

  const isSelected = isChipSelected(selected, interaction);
  const classNames = getChipClassName({
    className,
    interaction,
    selected: isSelected,
    size,
    variant,
  });
  const resolvedRemoveLabel =
    removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove');
  const trailing = rightIcon ?? (onRemove ? <XIcon aria-hidden weight="light" /> : null);
  const showRemove = Boolean(onRemove) && !isPreview;
  const label = (
    <span className={labelClass} data-slot="chip-label">
      <ChipLabel size={size}>{children}</ChipLabel>
      <ChipCount count={count} interaction={interaction} selected={isSelected} variant={variant} />
    </span>
  );
  const leading = leftAdornment ? (
    <span className={leftAdornmentClass[size]} data-slot="chip-adornment">
      {leftAdornment}
    </span>
  ) : null;
  const trailingIcon = trailing ? (
    <span className={rightIconClass[size]} data-slot="chip-icon">
      {trailing}
    </span>
  ) : null;

  function handleRemove(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onRemove?.(event);
  }

  if (isPreview) {
    return (
      <div
        className={classNames}
        data-interaction={interaction}
        data-selected={isSelected || undefined}
        data-size={size}
        data-slot="chip"
        data-variant={variant}
        ref={setRestoreNode}
      >
        {leading}
        {label}
        {trailingIcon}
      </div>
    );
  }

  if (showRemove) {
    return (
      <div
        className={classNames}
        data-disabled={disabled || undefined}
        data-selected={isSelected || undefined}
        data-size={size}
        data-slot="chip"
        data-variant={variant}
        ref={setRestoreNode}
      >
        {onClick ? (
          <button
            {...props}
            aria-pressed={isSelected}
            className={mainClass}
            disabled={disabled}
            onClick={onClick}
            type={type}
          >
            {leading}
            {label}
          </button>
        ) : (
          <>
            {leading}
            {label}
          </>
        )}
        <button
          aria-label={resolvedRemoveLabel}
          className={cn(removeClass, rightIconClass[size])}
          data-slot="chip-remove"
          disabled={disabled}
          onClick={handleRemove}
          type="button"
        >
          {trailing}
        </button>
      </div>
    );
  }

  return (
    <button
      {...props}
      aria-pressed={isSelected}
      className={classNames}
      data-selected={isSelected || undefined}
      data-size={size}
      data-slot="chip"
      data-variant={variant}
      disabled={disabled}
      onClick={onClick}
      ref={setRestoreNode}
      type={type}
    >
      {leading}
      {label}
      {trailingIcon}
    </button>
  );
}
