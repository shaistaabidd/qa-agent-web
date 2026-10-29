import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { XIcon } from '@phosphor-icons/react/X';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

import { moveFocus } from '@/shared/lib/focus';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { SEARCH_DEBOUNCE_MS, SEARCH_PARAM } from './constants';
import type { SearchProps } from './types';

export function Search({
  className,
  debounceMs = SEARCH_DEBOUNCE_MS,
  param = SEARCH_PARAM,
  placeholder = 'Search',
  size = 'md',
  ...props
}: SearchProps) {
  const [urlValue, setUrlValue] = useQueryState(
    param,
    parseAsString.withDefault('').withOptions({
      history: 'replace',
    }),
  );
  const [value, setValue] = useState(urlValue);
  const [seenUrlValue, setSeenUrlValue] = useState(urlValue);
  const [pushedValue, setPushedValue] = useState(urlValue);

  if (urlValue !== seenUrlValue) {
    setSeenUrlValue(urlValue);
    if (urlValue !== pushedValue) {
      setValue(urlValue);
      setPushedValue(urlValue);
    }
  }

  useEffect(() => {
    if (value === urlValue) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPushedValue(value);
      void setUrlValue(value || null);
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [debounceMs, setUrlValue, urlValue, value]);

  return (
    <Input
      {...props}
      aria-label={props['aria-label'] ?? placeholder}
      className={cn(
        '[&_[data-slot=input]::-webkit-search-cancel-button]:hidden [&_[data-slot=input]::-webkit-search-decoration]:hidden',
        className,
      )}
      leftIcon={<MagnifyingGlassIcon aria-hidden weight="bold" />}
      onChange={(event) => setValue(event.target.value)}
      placeholder={placeholder}
      rightIcon={
        value ? (
          <Button
            aria-label="Clear search"
            className="size-[20px] rounded-full"
            onClick={(event) => {
              const input = event.currentTarget
                .closest('[data-slot="input-container"]')
                ?.querySelector('input');
              if (input instanceof HTMLInputElement) {
                moveFocus(input);
              }
              setValue('');
            }}
            onMouseDown={(event) => event.stopPropagation()}
            size="icon-sm"
            variant="ghost"
          >
            <XIcon aria-hidden weight="bold" />
          </Button>
        ) : undefined
      }
      size={size}
      type="search"
      value={value}
    />
  );
}
