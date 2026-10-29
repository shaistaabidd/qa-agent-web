import { AsYouType, parseIncompletePhoneNumber } from 'libphonenumber-js/min';

import {
  callingCodeValue,
  couldMatchAllowedCallingCode,
  E164_DIGIT_LIMIT,
  emptyDraft,
  formatInternational,
  getCountryCallingCode,
  hasGrouping,
  limitNationalDigits,
  matchCallingCode,
  pickCountry,
  sameCallingCode,
  toE164,
} from './format-helpers';
import type { Country } from './types';

export type PhoneDraft = {
  country: Country;
  error: boolean;
  nationalDigits: string;
  /** International text that cannot use the selected country's national mask. */
  rejectedText?: string;
  /** More national digits were typed than the country allows. They are kept, not dropped. */
  tooLong?: boolean;
  value?: string;
};

export function readPhoneInput(
  raw: string,
  country: Country,
  allowedCountries: Country[],
): PhoneDraft {
  const compact = parseIncompletePhoneNumber(raw);

  if (!compact) {
    return emptyDraft(country);
  }

  if (compact.startsWith('+')) {
    return readInternational(compact, country, allowedCountries);
  }

  return readNational(compact, country);
}

/** Manual country pick — always keep the chosen country. */
export function selectPhoneCountry(nextCountry: Country, current: PhoneDraft): PhoneDraft {
  const keepDigits = !current.rejectedText && sameCallingCode(current.country, nextCountry);

  if (keepDigits) {
    return nationalDraft(nextCountry, current.nationalDigits);
  }

  return { country: nextCountry, error: false, nationalDigits: '', value: undefined };
}

export function phoneDraftFromValue(
  value: string | undefined,
  country: Country,
  allowedCountries: Country[],
): PhoneDraft {
  if (!value) {
    return emptyDraft(country);
  }

  return readPhoneInput(value, country, allowedCountries);
}

export function phoneDraftDisplay(draft: PhoneDraft) {
  if (draft.rejectedText) {
    return draft.rejectedText;
  }

  return formatNationalInput(draft.country, draft.nationalDigits);
}

export function phoneFieldValue(draft: PhoneDraft) {
  if (draft.rejectedText) {
    return draft.value ?? callingCodeValue(draft.country);
  }

  if (draft.nationalDigits && draft.value) {
    return draft.value;
  }

  return callingCodeValue(draft.country);
}

export function isBlankPhoneValue(value: string | undefined, country: Country) {
  return !value || value === '+' || value === callingCodeValue(country);
}

export function formatNationalInput(country: Country, digits: string) {
  if (!digits) {
    return '';
  }

  const national = new AsYouType(country).input(digits);
  // NANP reads a leading 1 as the trunk prefix and shows "1 2" until the area code is complete.
  if (getCountryCallingCode(country) === '1' && !/[()]/.test(national)) {
    return digits;
  }

  if (hasGrouping(national)) {
    return national;
  }

  // GB without a leading 0 only groups as an international national-part.
  const callingCode = getCountryCallingCode(country);
  const international = new AsYouType(country).input(`+${callingCode}${digits}`);
  const prefix = `+${callingCode}`;
  if (!international.startsWith(prefix)) {
    return national;
  }

  const rest = international.slice(prefix.length).trimStart();
  return hasGrouping(rest) ? rest : national;
}

export function caretAfterDigits(formatted: string, digitCount: number, afterPlus: boolean) {
  if (digitCount <= 0) {
    return afterPlus && formatted.startsWith('+') ? 1 : 0;
  }

  let seen = 0;
  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index] ?? '')) {
      seen += 1;
      if (seen === digitCount) {
        return index + 1;
      }
    }
  }

  return formatted.length;
}

function nationalDraft(country: Country, digits: string): PhoneDraft {
  const typed = digits.slice(0, E164_DIGIT_LIMIT);
  const tooLong = limitNationalDigits(country, typed).length < typed.length;

  return {
    country,
    error: tooLong,
    nationalDigits: typed,
    tooLong: tooLong || undefined,
    value: toE164(country, typed),
  };
}

// The selected country is never changed by national digits. Only an explicit
// "+" prefix or the country picker switches it.
function readNational(digits: string, country: Country): PhoneDraft {
  return nationalDraft(country, digits);
}

function readInternational(
  compact: string,
  country: Country,
  allowedCountries: Country[],
): PhoneDraft {
  const digits = compact.slice(1).slice(0, E164_DIGIT_LIMIT);
  const e164 = `+${digits}`;

  if (!digits) {
    return {
      country,
      error: false,
      nationalDigits: '',
      rejectedText: '+',
      value: '+',
    };
  }

  const match = matchCallingCode(digits);
  if (!match) {
    return rejectInternational(
      country,
      e164,
      !couldMatchAllowedCallingCode(digits, allowedCountries),
    );
  }

  const allowedForCode = match.countries.filter((candidate) =>
    allowedCountries.includes(candidate),
  );
  if (allowedForCode.length === 0) {
    return rejectInternational(country, e164, true);
  }

  const nextCountry = pickCountry(allowedForCode, country, e164, allowedCountries);

  return nationalDraft(nextCountry, match.rest);
}

function rejectInternational(country: Country, e164: string, error: boolean): PhoneDraft {
  return {
    country,
    error,
    nationalDigits: '',
    rejectedText: formatInternational(e164),
    value: e164,
  };
}
