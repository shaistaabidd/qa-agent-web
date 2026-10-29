import { CheckIcon } from '@phosphor-icons/react/Check';
import type { MouseEvent } from 'react';

import { Radio } from '@/shared/ui/radio';
import { Typography } from '@/shared/ui/Typography';

import { itemPrimaryVariant, itemSupportingVariant } from './constants';
import { useDropdownContext } from './dropdown-context';
import type { DropdownItemProps } from './types';
import {
  getItemCheckClassName,
  getItemClassName,
  getItemLeftAdornmentClassName,
  getItemRightAdornmentClassName,
  getItemTextClassName,
  getNodeText,
  getOptionId,
  isItemSelected,
} from './utils';

export function DropdownItem({
  children,
  className,
  disabled,
  interaction = 'default',
  leftIcon,
  rightIcon,
  size,
  supportingText,
  value,
}: DropdownItemProps) {
  const context = useDropdownContext();
  const live = context !== null;
  const itemSize = size ?? context?.itemSize ?? 'lg';
  const indicator = context?.indicator ?? 'check';
  const selected = live && isItemSelected(value, context);
  const highlighted = Boolean(live && value && context?.highlightedValue === value);
  const optionId = context && value ? getOptionId(context.listId, value) : undefined;
  const radio =
    indicator === 'radio' ? (
      <span
        aria-hidden
        className="pointer-events-none flex size-[20px] shrink-0 items-center justify-center overflow-hidden leading-none"
      >
        <Radio checked={selected} embedded tabIndex={-1} />
      </span>
    ) : null;
  const resolvedLeft = leftIcon ?? radio;
  const showCheck = selected && !rightIcon && indicator === 'check';
  const resolvedRight = showCheck ? (
    <CheckIcon aria-hidden className={getItemCheckClassName()} weight="bold" />
  ) : (
    rightIcon
  );
  const Comp = live ? (context?.itemAs ?? 'li') : 'div';
  const optionLabel = [getNodeText(children), getNodeText(supportingText)]
    .filter(Boolean)
    .join(' ');

  function handleMouseDown(event: MouseEvent<HTMLElement>) {
    if (!context || disabled || !value) {
      return;
    }

    event.preventDefault();
  }

  function handleClick() {
    if (!context || disabled || !value) {
      return;
    }

    context.onSelect(value);
  }

  function handleMouseMove() {
    if (!context || disabled || !value) {
      return;
    }

    context.onHighlight(value);
  }

  return (
    <Comp
      aria-disabled={live && disabled ? true : undefined}
      aria-label={live && optionLabel ? optionLabel : undefined}
      aria-selected={live ? selected : undefined}
      className={getItemClassName({
        className,
        disabled,
        interaction,
        live,
      })}
      data-highlighted={highlighted || undefined}
      data-selected={selected || undefined}
      data-size={itemSize}
      data-slot="dropdown-item"
      id={optionId}
      onClick={live ? handleClick : undefined}
      onMouseDown={live ? handleMouseDown : undefined}
      onMouseMove={live ? handleMouseMove : undefined}
      role={live ? 'option' : undefined}
    >
      {resolvedLeft ? (
        <span
          aria-hidden
          className={getItemLeftAdornmentClassName()}
          data-slot="dropdown-item-left"
        >
          {resolvedLeft}
        </span>
      ) : null}
      <span className={getItemTextClassName()} data-slot="dropdown-item-text">
        <Typography
          as="span"
          className="w-full text-fg-default"
          fontWeight="medium"
          variant={itemPrimaryVariant[itemSize]}
        >
          {children}
        </Typography>
        {supportingText ? (
          <Typography
            as="span"
            className="w-full text-fg-secondary"
            fontWeight="regular"
            variant={itemSupportingVariant[itemSize]}
          >
            {supportingText}
          </Typography>
        ) : null}
      </span>
      {resolvedRight ? (
        <span className={getItemRightAdornmentClassName()} data-slot="dropdown-item-right">
          {resolvedRight}
        </span>
      ) : null}
    </Comp>
  );
}
