import {
  cloneElement,
  isValidElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '@/shared/lib/utils';

import type { ButtonProps } from './types';
import { getButtonClassName, getGlyphClassName, isIconSize } from './utils';

export function Button({
  asChild = false,
  children,
  className,
  disabled,
  leftIcon,
  rightIcon,
  size = 'xl',
  type = 'button',
  variant = 'default',
  ...props
}: ButtonProps) {
  const classes = getButtonClassName(variant, size, className);
  const glyphClass = getGlyphClassName(size);
  const iconOnly = isIconSize(size);

  const content = iconOnly ? (
    <span className={glyphClass}>{children}</span>
  ) : (
    <>
      {leftIcon ? <span className={glyphClass}>{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className={glyphClass}>{rightIcon}</span> : null}
    </>
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      children?: ReactNode;
      className?: string;
      onClick?: (event: MouseEvent<HTMLElement>) => void;
      onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    }>;
    const childContent = iconOnly ? (
      <span className={glyphClass}>{child.props.children}</span>
    ) : (
      <>
        {leftIcon ? <span className={glyphClass}>{leftIcon}</span> : null}
        {child.props.children}
        {rightIcon ? <span className={glyphClass}>{rightIcon}</span> : null}
      </>
    );
    const { onClick, onKeyDown, ...rest } = props as {
      onClick?: (event: MouseEvent<HTMLElement>) => void;
      onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    };

    return cloneElement(child, {
      ...rest,
      'aria-disabled': disabled || undefined,
      children: childContent,
      className: cn(classes, disabled && 'pointer-events-none', child.props.className),
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
        child.props.onClick?.(event);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (disabled && event.key === 'Enter') {
          event.preventDefault();
          return;
        }
        onKeyDown?.(event);
        child.props.onKeyDown?.(event);
      },
      tabIndex: disabled ? -1 : undefined,
      'data-size': size,
      'data-slot': 'button',
      'data-variant': variant,
    } as typeof child.props);
  }

  return (
    <button
      className={classes}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      disabled={disabled}
      type={type}
      {...props}
    >
      {content}
    </button>
  );
}
