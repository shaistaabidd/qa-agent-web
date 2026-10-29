import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { isValidElement, useMemo } from 'react';

import { cn } from '@/shared/lib/utils';

import { cloneTrigger, type TriggerElement } from './clone-trigger';
import { hiddenInputClass, triggerSpinnerClass } from './constants';
import { DropdownContext } from './dropdown-context';
import { DropdownMenu } from './dropdown-menu';
import type { DropdownProps } from './types';
import { useDropdown } from './use-dropdown';
import {
  getRootClassName,
  getTriggerClassName,
  getTriggerIconClassName,
  getTriggerValueClassName,
} from './utils';

export function Dropdown({
  children,
  className,
  defaultOpen,
  defaultValue,
  disabled,
  error = false,
  id,
  indicator = 'check',
  itemSize = 'sm',
  loading = false,
  loadingMore = false,
  name,
  onLoadMore,
  onOpenChange,
  onValueChange,
  open,
  placeholder = 'Select',
  size = 'lg',
  trigger,
  value,
  contentWidth,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: DropdownProps) {
  const isInvalid = error || ariaInvalid === true || ariaInvalid === 'true';
  const {
    dropdownId,
    handleRootBlur,
    handleTriggerKeyDown,
    highlightedId,
    highlightedValue,
    listId,
    open: isOpen,
    rootRef,
    select,
    selectedItem,
    setHighlightedValue,
    setOpen,
    setTriggerNode,
    triggerRef,
    menuRef,
    value: selectedValue,
  } = useDropdown({
    children,
    defaultOpen,
    defaultValue,
    disabled,
    id,
    loading,
    onOpenChange,
    onValueChange,
    open,
    value,
  });
  const displayValue = selectedItem?.label ?? placeholder;
  const isPlaceholder = selectedItem == null;
  const showSpinner = loading || loadingMore;
  const hasCustomTrigger = isValidElement(trigger);

  const customTrigger = hasCustomTrigger ? (trigger as TriggerElement) : null;
  const triggerNode = customTrigger ? (
    cloneTrigger(customTrigger, {
      ariaLabel,
      disabled,
      id: dropdownId,
      isOpen,
      listId,
      loading,
      onKeyDown: handleTriggerKeyDown,
      onToggle: () => setOpen(!isOpen),
      setNode: (node) => setTriggerNode(node),
    })
  ) : (
    <button
      {...props}
      aria-activedescendant={highlightedId}
      aria-busy={showSpinner || undefined}
      aria-controls={listId}
      aria-describedby={ariaDescribedBy}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-invalid={isInvalid || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={getTriggerClassName(size)}
      data-invalid={isInvalid || undefined}
      data-loading={showSpinner || undefined}
      data-open={isOpen || undefined}
      data-size={size}
      data-slot="dropdown-trigger"
      disabled={disabled}
      id={dropdownId}
      onClick={() => setOpen(!isOpen)}
      onKeyDown={handleTriggerKeyDown}
      ref={setTriggerNode}
      role="combobox"
      type="button"
    >
      <span className={getTriggerValueClassName(size, isPlaceholder)} data-slot="dropdown-value">
        {displayValue}
      </span>
      <span
        className={getTriggerIconClassName(size)}
        data-slot={showSpinner ? 'dropdown-spinner' : 'dropdown-caret'}
      >
        {showSpinner ? (
          <>
            <CircleNotchIcon aria-hidden className={triggerSpinnerClass} weight="regular" />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          <CaretDownIcon aria-hidden weight="light" />
        )}
      </span>
    </button>
  );

  const contextValue = useMemo(
    () => ({
      highlightedValue,
      indicator,
      itemAs: 'li' as const,
      itemSize,
      listId,
      onHighlight: setHighlightedValue,
      onSelect: select,
      selectedValue: typeof selectedValue === 'string' ? selectedValue : undefined,
    }),
    [highlightedValue, indicator, itemSize, listId, select, selectedValue, setHighlightedValue],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        className={
          hasCustomTrigger
            ? cn('relative inline-flex min-w-0 flex-col', className)
            : getRootClassName(className)
        }
        data-disabled={disabled || undefined}
        data-indicator={indicator}
        data-loading={showSpinner || undefined}
        data-slot="dropdown"
        onBlur={handleRootBlur}
        ref={rootRef}
        role="presentation"
      >
        {triggerNode}
        {isOpen ? (
          <DropdownMenu
            anchorRef={triggerRef}
            contentWidth={contentWidth}
            fitContent={hasCustomTrigger}
            id={listId}
            loadingMore={loadingMore}
            menuRef={menuRef}
            onBlur={handleRootBlur}
            onLoadMore={onLoadMore}
          >
            {children}
          </DropdownMenu>
        ) : null}
        {name ? (
          <input
            className={hiddenInputClass}
            name={name}
            readOnly
            value={typeof selectedValue === 'string' ? selectedValue : ''}
          />
        ) : null}
      </div>
    </DropdownContext.Provider>
  );
}
