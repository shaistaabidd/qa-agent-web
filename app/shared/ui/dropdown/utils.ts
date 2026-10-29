import { Children, type CSSProperties, Fragment, isValidElement, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import {
  itemCheckClass,
  itemClass,
  itemDisabledClass,
  itemLeftAdornmentClass,
  itemLiveClass,
  itemPreviewHoverClass,
  itemRightAdornmentClass,
  itemTextClass,
  LOAD_MORE_THRESHOLD,
  MENU_MAX_HEIGHT,
  MENU_OFFSET,
  MENU_VIEWPORT_PADDING,
  menuClass,
  menuListClass,
  rootClass,
  triggerClass,
  triggerIconClass,
  triggerIconSizeClass,
  triggerPlaceholderClass,
  triggerSizeClass,
  triggerValueClass,
  triggerValueSizeClass,
} from './constants';
import type {
  DropdownItemInteraction,
  DropdownItemMeta,
  DropdownItemProps,
  DropdownSize,
} from './types';

export function getNodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }

  if (isValidElement(node)) {
    return getNodeText((node.props as { children?: ReactNode }).children);
  }

  return '';
}

export function itemMatchesQuery(label: ReactNode, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  return getNodeText(label).toLowerCase().includes(needle);
}

export function findItemByTypedLetter(
  items: DropdownItemMeta[],
  letter: string,
  currentValue: string | null,
): string | null {
  if (items.length === 0) {
    return null;
  }

  const prefix = letter.toLowerCase();
  const currentIndex = items.findIndex((item) => item.value === currentValue);
  const start = currentIndex + 1;

  for (let i = 0; i < items.length; i++) {
    const item = items[(start + i) % items.length];
    if (getNodeText(item.label).toLowerCase().startsWith(prefix)) {
      return item.value;
    }
  }

  return null;
}

export function getDropdownItems(children: ReactNode, query = ''): DropdownItemMeta[] {
  const items: DropdownItemMeta[] = [];

  function walk(nodes: ReactNode) {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) {
        return;
      }

      const props = child.props as DropdownItemProps & {
        children?: ReactNode;
      };

      if (child.type === Fragment) {
        walk(props.children);
        return;
      }

      if (typeof props.value === 'string') {
        if (!itemMatchesQuery(props.children, query)) {
          return;
        }

        items.push({
          disabled: props.disabled,
          label: props.children,
          value: props.value,
        });
        return;
      }

      walk(props.children);
    });
  }

  walk(children);
  return items;
}

export function getOptionId(listId: string, value: string) {
  return `${listId}-${value.replace(/\s+/g, '-')}`;
}

export function isItemSelected(
  value: string | undefined,
  context: {
    selectedValue?: string;
    selectedValues?: string[];
  } | null,
) {
  if (!context || !value) {
    return false;
  }

  if (context.selectedValues) {
    return context.selectedValues.includes(value);
  }

  return context.selectedValue === value;
}

export function toValueList(value: string | string[] | undefined): string[] {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function toggleListValue(values: string[], next: string) {
  return values.includes(next) ? values.filter((value) => value !== next) : [...values, next];
}

export function getRootClassName(className?: string) {
  return cn(rootClass, className);
}

export function getTriggerClassName(size: DropdownSize, className?: string) {
  return cn(triggerClass, triggerSizeClass[size], className);
}

export function getTriggerValueClassName(size: DropdownSize, isPlaceholder: boolean) {
  return cn(
    triggerValueClass,
    triggerValueSizeClass[size],
    isPlaceholder && triggerPlaceholderClass,
  );
}

export function getTriggerIconClassName(size: DropdownSize) {
  return cn(triggerIconClass, triggerIconSizeClass[size]);
}

export function getMenuClassName(className?: string) {
  return cn(menuClass, className);
}

export function getMenuListClassName(className?: string) {
  return cn(menuListClass, className);
}

export function getMenuPositionStyle(
  anchor: HTMLElement | null,
  options?: { fitContent?: boolean; minWidth?: number; width?: number },
): CSSProperties | undefined {
  if (!anchor) {
    return undefined;
  }

  const rect = anchor.getBoundingClientRect();
  const maxWidth = window.innerWidth - MENU_VIEWPORT_PADDING * 2;
  const minWidth = Math.min(Math.max(options?.minWidth ?? 0, rect.width), maxWidth);
  const preferredWidth = options?.fitContent
    ? minWidth
    : Math.min(Math.max(options?.width ?? rect.width, options?.minWidth ?? 0), maxWidth);
  let left = rect.left;

  if (left + preferredWidth > window.innerWidth - MENU_VIEWPORT_PADDING) {
    left = window.innerWidth - preferredWidth - MENU_VIEWPORT_PADDING;
  }

  if (left < MENU_VIEWPORT_PADDING) {
    left = MENU_VIEWPORT_PADDING;
  }

  const spaceBelow = window.innerHeight - rect.bottom - MENU_VIEWPORT_PADDING;
  const spaceAbove = rect.top - MENU_VIEWPORT_PADDING;
  const openUpward = spaceBelow < MENU_MAX_HEIGHT && spaceAbove > spaceBelow;

  const widthStyle: CSSProperties = options?.fitContent
    ? {
        maxWidth: `${maxWidth}px`,
        minWidth: `${minWidth}px`,
        width: 'max-content',
      }
    : { width: `${preferredWidth}px` };

  if (openUpward) {
    const maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(0, spaceAbove - MENU_OFFSET));

    return {
      bottom: `${window.innerHeight - rect.top + MENU_OFFSET}px`,
      left: `${left}px`,
      maxHeight: `${maxHeight}px`,
      top: 'auto',
      ...widthStyle,
    };
  }

  const top = rect.bottom + MENU_OFFSET;

  return {
    left: `${left}px`,
    maxHeight: `${Math.min(MENU_MAX_HEIGHT, Math.max(0, spaceBelow - MENU_OFFSET))}px`,
    top: `${top}px`,
    ...widthStyle,
  };
}

export function shouldLoadMore(element: HTMLElement) {
  return element.scrollHeight - element.scrollTop - element.clientHeight < LOAD_MORE_THRESHOLD;
}

export function getItemClassName({
  className,
  disabled = false,
  interaction = 'default',
  live = true,
}: {
  className?: string;
  disabled?: boolean;
  interaction?: DropdownItemInteraction;
  live?: boolean;
} = {}) {
  return cn(
    itemClass,
    live && itemLiveClass,
    !live && interaction === 'hover' && itemPreviewHoverClass,
    disabled && itemDisabledClass,
    className,
  );
}

export function getItemTextClassName(className?: string) {
  return cn(itemTextClass, className);
}

export function getItemLeftAdornmentClassName(className?: string) {
  return cn(itemLeftAdornmentClass, className);
}

export function getItemRightAdornmentClassName(className?: string) {
  return cn(itemRightAdornmentClass, className);
}

export function getItemCheckClassName(className?: string) {
  return cn(itemCheckClass, className);
}
