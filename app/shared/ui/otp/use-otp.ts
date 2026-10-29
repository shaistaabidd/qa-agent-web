import {
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { DEFAULT_OTP_SLOTS } from './constants';
import { toAsciiDigit, toAsciiDigits, toSlotValues } from './utils';

export function useOtp({
  autoFocus = false,
  defaultValue = '',
  disabled = false,
  onChange,
  slots = DEFAULT_OTP_SLOTS,
  value,
}: {
  autoFocus?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  slots?: number;
  value?: string;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pendingDigitRef = useRef<string | null>(null);
  // The parent stores one string. Joining ["", "2", "3"] becomes "23", so a
  // later render would slide every digit left. Skip that echo.
  const emittedValueRef = useRef(value ?? defaultValue);
  const [slotValues, setSlotValues] = useState(() => toSlotValues(value ?? defaultValue, slots));
  const slotValuesRef = useRef(slotValues);

  useEffect(() => {
    if (value === undefined || value === emittedValueRef.current) {
      return;
    }

    const nextSlots = toSlotValues(value, slots);
    emittedValueRef.current = value;

    if (nextSlots.every((slot, index) => slot === slotValuesRef.current[index])) {
      return;
    }

    slotValuesRef.current = nextSlots;
    setSlotValues(nextSlots);
  }, [slots, value]);

  function updateValues(newValues: string[]) {
    const nextValue = newValues.join('');
    emittedValueRef.current = nextValue;
    slotValuesRef.current = newValues;
    setSlotValues(newValues);
    onChange?.(nextValue);
  }

  function focusInput(index: number) {
    if (index < 0 || index >= slots) {
      return;
    }

    const input = inputRefs.current[index];
    input?.focus();
    input?.select();
  }

  function clearSlot(index: number) {
    const newValues = [...slotValuesRef.current];
    newValues[index] = '';
    updateValues(newValues);
  }

  function writeDigits(index: number, digits: string) {
    if (digits.length === 0) {
      return;
    }

    const newValues = [...slotValuesRef.current];

    for (let offset = 0; offset < digits.length && index + offset < slots; offset += 1) {
      newValues[index + offset] = digits[offset] ?? '';
    }

    updateValues(newValues);
    focusInput(Math.min(index + digits.length, slots - 1));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>, index: number) {
    if (disabled) {
      return;
    }

    const raw = event.target.value;
    const digits = toAsciiDigits(raw);
    const pendingDigit = pendingDigitRef.current;

    if (pendingDigit && (digits === pendingDigit || digits.endsWith(pendingDigit))) {
      pendingDigitRef.current = null;
      return;
    }

    if (digits.length === 0) {
      // A non-digit typed into a filled slot is ignored, not treated as a delete.
      if (raw.length > 0) {
        return;
      }

      clearSlot(index);
      return;
    }

    const current = slotValuesRef.current[index] ?? '';

    // A filled box appends the new key instead of replacing the selection.
    // Keep only the character the user just typed.
    if (current && digits.length === current.length + 1 && digits.startsWith(current)) {
      writeDigits(index, digits.slice(-1));
      return;
    }

    writeDigits(index, digits);
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>, index: number) {
    if (disabled) {
      return;
    }

    event.preventDefault();
    const digits = toAsciiDigits(event.clipboardData.getData('text/plain'));
    // A full code replaces the whole field, wherever focus was.
    writeDigits(digits.length >= slots ? 0 : index, digits);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (disabled) {
      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusInput(index + 1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusInput(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusInput(slots - 1);
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();

      if (slotValuesRef.current[index]) {
        clearSlot(index);
        return;
      }

      const previous = index - 1;

      if (previous < 0) {
        return;
      }

      const nextValues = [...slotValuesRef.current];
      nextValues[previous] = '';
      updateValues(nextValues);
      focusInput(previous);
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();

      if (slotValuesRef.current[index]) {
        clearSlot(index);
        return;
      }

      const next = index + 1;

      if (next >= slots) {
        return;
      }

      const nextValues = [...slotValuesRef.current];
      nextValues[next] = '';
      updateValues(nextValues);
      return;
    }

    const digit = event.key.length === 1 ? toAsciiDigit(event.key) : '';

    if (digit) {
      event.preventDefault();
      pendingDigitRef.current = digit;
      writeDigits(index, digit);
      queueMicrotask(() => {
        if (pendingDigitRef.current === digit) {
          pendingDigitRef.current = null;
        }
      });
    }
  }

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    inputRefs.current[0]?.focus();
  }, [autoFocus]);

  return {
    handleChange,
    handleKeyDown,
    handlePaste,
    inputRefs,
    inputValues: slotValues,
  };
}
