import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { useLatestRef, useStableCallback } from '@/shared/lib/use-latest-ref';

import type { DropdownProps } from './types';
import { useDropdownKeyboard } from './use-dropdown-keyboard';
import { getDropdownItems, getOptionId, toggleListValue, toValueList } from './utils';

export type UseDropdownOptions = Omit<DropdownProps, 'defaultValue' | 'onValueChange' | 'value'> & {
  defaultValue?: string | string[];
  multiple?: boolean;
  onValueChange?: ((value: string) => void) | ((value: string[]) => void);
  value?: string | string[];
};

export function useDropdown({
  children,
  defaultOpen = false,
  defaultValue,
  disabled,
  id,
  loading = false,
  multiple = false,
  onOpenChange,
  onValueChange,
  open: openProp,
  query = '',
  value: valueProp,
}: UseDropdownOptions) {
  const generatedId = useId();
  const onOpenChangeRef = useLatestRef(onOpenChange);
  const dropdownId = id ?? generatedId;
  const listId = `${dropdownId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const setTriggerNode = useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node;
  }, []);
  const menuRef = useRef<HTMLDivElement>(null);
  const isValueControlled = valueProp !== undefined;
  const isOpenControlled = openProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | string[] | undefined>(() =>
    multiple ? toValueList(defaultValue) : defaultValue,
  );
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const value = isValueControlled ? valueProp : uncontrolledValue;
  const open = isOpenControlled ? openProp : uncontrolledOpen;
  const [highlightedState, setHighlightedValue] = useState<string | null>(
    defaultOpen ? (toValueList(defaultValue)[0] ?? null) : null,
  );
  const allItems = useMemo(() => getDropdownItems(children), [children]);
  const items = useMemo(() => getDropdownItems(children, query), [children, query]);
  const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items]);
  const highlightedValue =
    open && !(highlightedState && enabledItems.some((item) => item.value === highlightedState))
      ? (enabledItems[0]?.value ?? null)
      : highlightedState;
  const selectedValues = multiple ? toValueList(value) : undefined;
  const selectedItem = allItems.find((item) => !Array.isArray(value) && item.value === value);
  const selectedItems = useMemo(() => {
    const itemsByValue = new Map(allItems.map((item) => [item.value, item] as const));

    return toValueList(value).map(
      (itemValue) =>
        itemsByValue.get(itemValue) ?? {
          label: itemValue,
          value: itemValue,
        },
    );
  }, [allItems, value]);
  const highlightedId =
    open && highlightedValue ? getOptionId(listId, highlightedValue) : undefined;

  function setOpen(next: boolean) {
    if (disabled || (next && loading)) {
      return;
    }

    if (!isOpenControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);
    setHighlightedValue(next ? (toValueList(value)[0] ?? enabledItems[0]?.value ?? null) : null);
  }

  const select = useStableCallback((next: string) => {
    if (disabled || loading) {
      return;
    }

    if (multiple) {
      const nextValue = toggleListValue(toValueList(value), next);

      if (!isValueControlled) {
        setUncontrolledValue(nextValue);
      }

      (onValueChange as ((value: string[]) => void) | undefined)?.(nextValue);
      return;
    }

    if (!isValueControlled) {
      setUncontrolledValue(next);
    }

    (onValueChange as ((value: string) => void) | undefined)?.(next);
    setOpen(false);
    triggerRef.current?.focus();
  });

  function clearAll() {
    if (disabled || loading || !multiple) {
      return;
    }

    if (!isValueControlled) {
      setUncontrolledValue([]);
    }

    (onValueChange as ((value: string[]) => void) | undefined)?.([]);
    triggerRef.current?.focus();
  }

  function moveHighlight(delta: number) {
    if (enabledItems.length === 0) {
      return;
    }

    const currentIndex = enabledItems.findIndex((item) => item.value === highlightedValue);
    const fallback = delta > 0 ? 0 : enabledItems.length - 1;
    const nextIndex =
      currentIndex < 0
        ? fallback
        : (currentIndex + delta + enabledItems.length) % enabledItems.length;

    setHighlightedValue(enabledItems[nextIndex].value);
  }

  useEffect(() => {
    if (!highlightedId) {
      return;
    }

    document.getElementById(highlightedId)?.scrollIntoView({ block: 'nearest' });
  }, [highlightedId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (containsEventTarget(event.target as Node)) {
        return;
      }

      if (!isOpenControlled) {
        setUncontrolledOpen(false);
      }

      onOpenChange?.(false);
      setHighlightedValue(null);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpenControlled, onOpenChange, open]);

  const closeFromEscape = useStableCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    // Capture phase so Escape closes the menu before a dialog behind it sees the key.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      closeFromEscape();
    }

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [closeFromEscape, open]);

  if (loading && uncontrolledOpen && !isOpenControlled) {
    setUncontrolledOpen(false);
  }

  useEffect(() => {
    if (loading && open) {
      onOpenChangeRef.current?.(false);
    }
  }, [loading, onOpenChangeRef, open]);

  function containsEventTarget(target: Node | null) {
    if (!target) {
      return false;
    }

    return Boolean(rootRef.current?.contains(target) || menuRef.current?.contains(target));
  }

  const handleTriggerKeyDown = useDropdownKeyboard({
    disabled,
    enabledItems,
    highlightedValue,
    loading,
    moveHighlight,
    open,
    select,
    setHighlightedValue,
    setOpen,
  });

  function handleRootBlur() {
    requestAnimationFrame(() => {
      if (containsEventTarget(document.activeElement)) {
        return;
      }

      if (open) {
        setOpen(false);
      }
    });
  }

  return {
    disabled,
    dropdownId,
    handleRootBlur,
    handleTriggerKeyDown,
    highlightedId,
    highlightedValue,
    items,
    listId,
    menuRef,
    moveHighlight,
    open,
    query,
    rootRef,
    clearAll,
    select,
    selectedItem,
    selectedItems,
    selectedValues,
    setHighlightedValue,
    setOpen,
    setTriggerNode,
    triggerRef,
    value,
  };
}
