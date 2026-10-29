import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { type KeyboardEvent, useMemo, useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { triggerSpinnerClass } from '@/shared/ui/dropdown/constants';
import { DropdownContext } from '@/shared/ui/dropdown/dropdown-context';
import { DropdownMenu } from '@/shared/ui/dropdown/dropdown-menu';
import { useDropdown } from '@/shared/ui/dropdown/use-dropdown';
import {
  getRootClassName,
  getTriggerClassName,
  getTriggerIconClassName,
  getTriggerValueClassName,
} from '@/shared/ui/dropdown/utils';
import { Typography } from '@/shared/ui/Typography';

import { ComboboxChips } from './combobox-chips';
import { ComboboxFilterContext } from './combobox-context';
import { ComboboxHiddenInputs } from './combobox-hidden-inputs';
import { ComboboxSearch } from './combobox-search';
import { emptyClass, fieldStackClass, triggerWrapClass } from './constants';
import type { ComboboxProps } from './types';
import { useOpenedWithItems } from './use-open-chip-lock';

export function Combobox({
  children,
  className,
  contentWidth,
  defaultOpen,
  defaultValue,
  disabled,
  emptyText = 'No results',
  error = false,
  id,
  itemSize = 'sm',
  loading = false,
  loadingMore = false,
  multiple = false,
  name,
  onLoadMore,
  onOpenChange,
  onValueChange,
  open,
  placeholder = 'Select',
  searchPlaceholder = 'Search',
  showClearAll = true,
  showSelected = true,
  size = 'lg',
  value,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ComboboxProps) {
  const [query, setQuery] = useState('');
  const isInvalid = error || ariaInvalid === true || ariaInvalid === 'true';
  const {
    dropdownId,
    handleRootBlur,
    handleTriggerKeyDown,
    highlightedId,
    highlightedValue,
    items,
    listId,
    menuRef,
    moveHighlight,
    open: isOpen,
    rootRef,
    clearAll,
    select,
    selectedItem,
    selectedItems,
    selectedValues,
    setHighlightedValue,
    setOpen,
    triggerRef,
    value: selectedValue,
  } = useDropdown({
    children,
    defaultOpen,
    defaultValue,
    disabled,
    id,
    loading,
    multiple,
    onOpenChange,
    onValueChange,
    open,
    query,
    value,
  });
  const displayValue = multiple ? placeholder : (selectedItem?.label ?? placeholder);
  const isPlaceholder = multiple || selectedItem == null;
  const showSpinner = loading || loadingMore;
  const hasResults = items.length > 0;
  const showChips = Boolean(multiple && showSelected && selectedItems.length);
  const openedWithChips = useOpenedWithItems(isOpen, selectedItems.length);
  const showChipStack = isOpen ? openedWithChips : showChips;
  const slot = multiple ? 'multi-select' : 'combobox';

  if (!isOpen && query !== '') {
    setQuery('');
  }

  const filterValue = useMemo(() => ({ query }), [query]);
  const dropdownValue = useMemo(
    () => ({
      highlightedValue,
      indicator: 'check' as const,
      itemAs: 'div' as const,
      itemSize,
      listId,
      onHighlight: setHighlightedValue,
      onSelect: select,
      selectedValue: typeof selectedValue === 'string' ? selectedValue : undefined,
      selectedValues,
    }),
    [
      highlightedValue,
      itemSize,
      listId,
      select,
      selectedValue,
      selectedValues,
      setHighlightedValue,
    ],
  );

  function removeLastChip(event: KeyboardEvent) {
    const lastItem = selectedItems.at(-1);
    if (
      event.key !== 'Backspace' ||
      !multiple ||
      !showSelected ||
      disabled ||
      loading ||
      !lastItem
    ) {
      return;
    }

    event.preventDefault();
    select(lastItem.value);
  }

  function handleTriggerKeyDownWithChips(event: KeyboardEvent<HTMLElement>) {
    removeLastChip(event);
    handleTriggerKeyDown(event);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (query === '') {
      removeLastChip(event);
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveHighlight(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (highlightedValue) {
        select(highlightedValue);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <ComboboxFilterContext.Provider value={filterValue}>
      <DropdownContext.Provider value={dropdownValue}>
        <div
          className={cn(showChipStack ? fieldStackClass : getRootClassName(), className)}
          data-disabled={disabled || undefined}
          data-loading={showSpinner || undefined}
          data-slot={slot}
          onBlur={handleRootBlur}
          ref={rootRef}
          role="presentation"
        >
          <div className={multiple ? triggerWrapClass : undefined}>
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
              data-slot={`${slot}-trigger`}
              disabled={disabled}
              id={dropdownId}
              onClick={() => setOpen(!isOpen)}
              onKeyDown={handleTriggerKeyDownWithChips}
              ref={triggerRef}
              role="combobox"
              type="button"
            >
              <span
                className={getTriggerValueClassName(size, isPlaceholder)}
                data-slot={`${slot}-value`}
              >
                {displayValue}
              </span>
              <span
                className={getTriggerIconClassName(size)}
                data-slot={showSpinner ? `${slot}-spinner` : `${slot}-caret`}
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
            {isOpen ? (
              <DropdownMenu
                anchorRef={triggerRef}
                contentWidth={contentWidth}
                header={
                  <ComboboxSearch
                    highlightedId={highlightedId}
                    listId={listId}
                    onChange={setQuery}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={searchPlaceholder}
                    value={query}
                  />
                }
                id={listId}
                listAs="div"
                loadingMore={loadingMore}
                menuRef={menuRef}
                multiple={multiple}
                onBlur={handleRootBlur}
                onLoadMore={onLoadMore}
              >
                {hasResults ? (
                  children
                ) : (
                  <div className={emptyClass} data-slot={`${slot}-empty`}>
                    <Typography
                      as="span"
                      className="text-fg-secondary"
                      fontWeight="regular"
                      variant="body3"
                    >
                      {emptyText}
                    </Typography>
                  </div>
                )}
              </DropdownMenu>
            ) : null}
          </div>
          {multiple && showSelected && (showChips || isOpen) ? (
            <ComboboxChips
              disabled={disabled || loading}
              items={selectedItems}
              lockHeight={isOpen}
              onClearAll={clearAll}
              onRemove={select}
              showClearAll={showClearAll}
            />
          ) : null}
          {name ? (
            <ComboboxHiddenInputs
              multiple={multiple}
              name={name}
              selectedItems={selectedItems}
              selectedValue={selectedValue}
            />
          ) : null}
        </div>
      </DropdownContext.Provider>
    </ComboboxFilterContext.Provider>
  );
}
