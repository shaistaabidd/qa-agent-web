import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { type ChangeEvent, type KeyboardEvent, useEffect, useId } from 'react';

import { Input } from '@/shared/ui/input';

import { searchFieldClass } from './constants';

export function ComboboxSearch({
  highlightedId,
  listId,
  onChange,
  onKeyDown,
  placeholder,
  value,
}: {
  highlightedId?: string;
  listId: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
}) {
  const inputId = useId();

  useEffect(() => {
    document.getElementById(inputId)?.focus();
  }, [inputId]);

  return (
    <Input
      aria-activedescendant={highlightedId}
      aria-autocomplete="list"
      aria-controls={listId}
      aria-label={placeholder}
      autoComplete="off"
      className={searchFieldClass}
      id={inputId}
      leftIcon={<MagnifyingGlassIcon aria-hidden weight="light" />}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
      }}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      size="sm"
      type="search"
      value={value}
    />
  );
}
