import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Country } from 'react-phone-number-input';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';

import { useLatestRef } from '@/shared/lib/use-latest-ref';

import {
  isBlankPhoneValue,
  type PhoneDraft,
  phoneDraftDisplay,
  phoneDraftFromValue,
  phoneFieldValue,
  readPhoneInput,
  selectPhoneCountry,
} from './format';
import { getValidationMessage, TOO_LONG_MESSAGE } from './utils';

export function usePhoneInput({
  allowedCountries: allowedCountriesProp,
  defaultCountry,
  defaultValue,
  onChange,
  onValidationChange,
  value,
}: {
  allowedCountries: Country[];
  defaultCountry: Country;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  onValidationChange?: (isValid: boolean) => void;
  value?: string;
}) {
  const [allowedCountries, setAllowedCountries] = useState(allowedCountriesProp);
  if (allowedCountries.join(',') !== allowedCountriesProp.join(',')) {
    setAllowedCountries(allowedCountriesProp);
  }
  const [draft, setDraft] = useState<PhoneDraft>(() =>
    phoneDraftFromValue(value ?? defaultValue, defaultCountry, allowedCountries),
  );
  const [internalError, setInternalError] = useState(() =>
    draft.error ? getValidationMessage(allowedCountries) : '',
  );
  const draftRef = useRef(draft);

  useLayoutEffect(() => {
    draftRef.current = draft;
  }, [draft]);
  const emittedRef = useRef(phoneFieldValue(draft));
  const onChangeRef = useLatestRef(onChange);

  const display = phoneDraftDisplay(draft);

  const validatePhoneNumber = useCallback(
    (phoneValue: string | undefined) => {
      if (!phoneValue || isBlankPhoneValue(phoneValue, draftRef.current.country)) {
        return false;
      }

      try {
        const phoneNumber = parsePhoneNumber(phoneValue);
        if (!phoneNumber?.country) {
          return false;
        }

        return allowedCountries.includes(phoneNumber.country) && isValidPhoneNumber(phoneValue);
      } catch {
        return false;
      }
    },
    [allowedCountries],
  );

  const applyDraft = useCallback(
    (next: PhoneDraft, notify: boolean) => {
      draftRef.current = next;
      setDraft(next);

      const fieldValue = phoneFieldValue(next);
      if (notify && fieldValue !== emittedRef.current) {
        onChangeRef.current?.(fieldValue);
      }
      emittedRef.current = fieldValue;

      setInternalError((current) => {
        if (next.error) {
          return next.tooLong ? TOO_LONG_MESSAGE : getValidationMessage(allowedCountries);
        }

        if (
          !current ||
          current === TOO_LONG_MESSAGE ||
          isBlankPhoneValue(fieldValue, next.country) ||
          validatePhoneNumber(fieldValue)
        ) {
          return '';
        }

        return current;
      });
    },
    [allowedCountries, onChangeRef, validatePhoneNumber],
  );

  useEffect(() => {
    if (value === undefined || value === emittedRef.current) {
      return;
    }

    applyDraft(phoneDraftFromValue(value, draftRef.current.country, allowedCountries), false);
  }, [allowedCountries, applyDraft, value]);

  useEffect(() => {
    if (!onValidationChange) {
      return;
    }

    const fieldValue = phoneFieldValue(draft);
    const isValid =
      !internalError && !draft.error && !draft.rejectedText && validatePhoneNumber(fieldValue);

    const frame = window.setTimeout(() => {
      onValidationChange(isValid);
    }, 0);

    return () => window.clearTimeout(frame);
  }, [draft, internalError, onValidationChange, validatePhoneNumber]);

  const handleInput = useCallback(
    (raw: string) => {
      applyDraft(readPhoneInput(raw, draftRef.current.country, allowedCountries), true);
    },
    [allowedCountries, applyDraft],
  );

  const handleCountryChange = useCallback(
    (nextCountry: string) => {
      if (!allowedCountries.includes(nextCountry as Country)) {
        return;
      }

      applyDraft(selectPhoneCountry(nextCountry as Country, draftRef.current), true);
    },
    [allowedCountries, applyDraft],
  );

  const handleBlur = useCallback(() => {
    const current = draftRef.current;
    const fieldValue = phoneFieldValue(current);

    if (current.rejectedText === '+') {
      applyDraft(phoneDraftFromValue(undefined, current.country, allowedCountries), true);
      setInternalError('');
      return;
    }

    if (isBlankPhoneValue(fieldValue, current.country) && !current.rejectedText) {
      return;
    }

    if (current.tooLong) {
      setInternalError(TOO_LONG_MESSAGE);
      return;
    }

    setInternalError(
      current.error || !validatePhoneNumber(fieldValue)
        ? getValidationMessage(allowedCountries)
        : '',
    );
  }, [allowedCountries, applyDraft, validatePhoneNumber]);

  return {
    country: draft.country,
    display,
    handleBlur,
    handleCountryChange,
    handleInput,
    internalError,
  };
}
