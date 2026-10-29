import { CheckIcon } from '@phosphor-icons/react/Check';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

import { itemPrimaryVariant, itemSupportingVariant } from '@/shared/ui/dropdown/constants';
import { DropdownMenu } from '@/shared/ui/dropdown/dropdown-menu';
import {
  getItemCheckClassName,
  getItemClassName,
  getItemLeftAdornmentClassName,
  getItemRightAdornmentClassName,
  getItemTextClassName,
  getOptionId,
} from '@/shared/ui/dropdown/utils';
import { Typography } from '@/shared/ui/Typography';

import { COUNTRY_MENU_MIN_WIDTH, countryRootClass } from './constants';
import { CountryFlag } from './country-flag';
import { usePhoneField } from './phone-field-context';
import type { PhoneCountrySelectProps } from './types';
import { getCallingCodeClassName, getCallingCodeLabel, getPrefixClassName } from './utils';

export function CountrySelect({
  'aria-label': ariaLabel = 'Country',
  disabled,
  onBlur,
  onChange,
  onFocus,
  options,
  readOnly,
  value,
}: PhoneCountrySelectProps) {
  const { size } = usePhoneField();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState(value);

  const countries = options.filter(
    (option): option is { label: string; value: string } =>
      Boolean(option.value) && !option.divider,
  );
  const canSelect = !disabled && !readOnly && countries.length > 1;

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  function chooseCountry(next: string) {
    onChange(next);
    setOpen(false);
  }

  function openMenu() {
    const current = countries.some((option) => option.value === value)
      ? value
      : countries[0]?.value;
    setActiveValue(current);
    setOpen(true);
  }

  function moveActive(delta: number) {
    if (countries.length === 0) {
      return;
    }

    const currentIndex = countries.findIndex((option) => option.value === activeValue);
    const nextIndex =
      currentIndex < 0
        ? delta > 0
          ? 0
          : countries.length - 1
        : (currentIndex + delta + countries.length) % countries.length;

    setActiveValue(countries[nextIndex]?.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }

      moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if ((event.key === 'Home' || event.key === 'End') && open) {
      event.preventDefault();
      setActiveValue(
        event.key === 'Home' ? countries[0]?.value : countries[countries.length - 1]?.value,
      );
      return;
    }

    if (event.key === 'Tab' && open) {
      setOpen(false);
      return;
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    if (!open) {
      openMenu();
      return;
    }

    if (activeValue) {
      chooseCountry(activeValue);
    }
  }

  const activeDescendantId = open && activeValue ? getOptionId(listId, activeValue) : undefined;

  useEffect(() => {
    if (!activeDescendantId) {
      return;
    }

    document.getElementById(activeDescendantId)?.scrollIntoView({ block: 'nearest' });
  }, [activeDescendantId]);

  const callingCode = getCallingCodeLabel(value);
  const prefix = (
    <>
      <CountryFlag country={value} />
      {callingCode ? <span className={getCallingCodeClassName()}>{callingCode}</span> : null}
    </>
  );

  if (!canSelect) {
    return (
      <span className={getPrefixClassName(size)} data-slot="phone-country">
        {prefix}
      </span>
    );
  }

  return (
    <div
      className={countryRootClass}
      data-slot="phone-country"
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (
          open &&
          next instanceof Node &&
          !rootRef.current?.contains(next) &&
          !menuRef.current?.contains(next)
        ) {
          setOpen(false);
        }
      }}
      ref={rootRef}
      role="presentation"
    >
      <button
        aria-activedescendant={activeDescendantId}
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={getPrefixClassName(size, 'cursor-pointer')}
        disabled={disabled}
        onBlur={onBlur}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        ref={triggerRef}
        role="combobox"
        type="button"
      >
        {prefix}
      </button>

      {open ? (
        <DropdownMenu
          anchorRef={triggerRef}
          id={listId}
          listAs="div"
          menuRef={menuRef}
          minWidth={COUNTRY_MENU_MIN_WIDTH}
        >
          {countries.map((option) => {
            const selected = option.value === value;

            return (
              <div
                aria-selected={selected}
                className={getItemClassName({ live: true })}
                data-highlighted={option.value === activeValue || undefined}
                data-selected={selected || undefined}
                data-size="sm"
                data-slot="dropdown-item"
                id={getOptionId(listId, option.value)}
                key={option.value}
                onMouseEnter={() => setActiveValue(option.value)}
                tabIndex={-1}
                onPointerDown={(event) => {
                  // Commit on pointerdown so outside-close cannot beat the click.
                  event.preventDefault();
                  event.stopPropagation();
                  chooseCountry(option.value);
                }}
                role="option"
              >
                <span
                  aria-hidden
                  className={getItemLeftAdornmentClassName()}
                  data-slot="dropdown-item-left"
                >
                  <CountryFlag country={option.value} />
                </span>
                <span className={getItemTextClassName()} data-slot="dropdown-item-text">
                  <Typography
                    as="span"
                    className="w-full text-fg-default"
                    fontWeight="medium"
                    variant={itemPrimaryVariant.sm}
                  >
                    {option.label}
                  </Typography>
                  <Typography
                    as="span"
                    className="w-full text-fg-secondary"
                    fontWeight="regular"
                    variant={itemSupportingVariant.sm}
                  >
                    {getCallingCodeLabel(option.value)}
                  </Typography>
                </span>
                {selected ? (
                  <span
                    className={getItemRightAdornmentClassName()}
                    data-slot="dropdown-item-right"
                  >
                    <CheckIcon aria-hidden className={getItemCheckClassName()} weight="bold" />
                  </span>
                ) : null}
              </div>
            );
          })}
        </DropdownMenu>
      ) : null}
    </div>
  );
}
