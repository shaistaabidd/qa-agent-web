# react-phone-number-input & libphonenumber-js

Installed: `react-phone-number-input@^3.4.18` (pulls `libphonenumber-js`).

This app’s product control is the custom wrapper under `app/shared/ui/phone-input`. Use this file when touching helpers or comparing with upstream behavior.

## What the package is

Thin React layer over **libphonenumber-js**:

- Default entry (`react-phone-number-input`) = **min** metadata.
- Variants: `/min`, `/max`, `/mobile`, `/core` (pass your own metadata).
- Re-exports: `parsePhoneNumber`, `isValidPhoneNumber`, `isPossiblePhoneNumber`, `getCountryCallingCode`, `getCountries`, `formatPhoneNumber`, …

## Core value model

- Component `value` / `onChange` argument: **E.164** string (`+13125550148`) or `undefined` when empty.
- Falsy `value` (`undefined`, `null`, `""`) means empty.
- National formatting is display-only; do not store `(312) 555-0148` as the form value.

## Upstream props that bite

| Prop | Risk |
|------|------|
| `international={false}` | Forces national input. Pasting `+44…` while US is selected strips/`convert`s digits into a **US national** number → `(442) 079-4609`. |
| `countries={['US']}` | Limits the select list; does **not** safely reject foreign international pastes under national mode. |
| `countryCallingCodeEditable={false}` | Only protects the prefix in **international** mode; not a fix for national-mode foreign pastes. |
| `defaultCountry` | Initial country only; ignored when controlled `country` is set on the input-without-select variant. |
| `smartCaret` | Uses `InputSmart` + `input-format`; still subject to national-mode paste rules. |

## National vs international (library)

From `onPhoneDigitsChange` (library helper):

- `international === false` + selected country + input starting with `+` → `convertInternationalPhoneDigitsToNational`.
- If the pasted number’s calling code ≠ selected country, it often becomes **bare digits** of the foreign number, then formatted with the **selected** country’s mask.

That is why this app stopped using `PhoneInputWithCountry` for the design-system field.

## Metadata: min vs max

- **min** (default): smaller; `isValidPhoneNumber` is closer to possible-length checks.
- **max**: larger; stricter digit patterns / types (`getType()`).
- Prefer staying on **min** unless product requires stricter validation; then import from `libphonenumber-js/max` / `react-phone-number-input/max` consistently.

## Useful helpers

```ts
import {
  AsYouType,
  parseIncompletePhoneNumber,
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  getCountryCallingCode,
  validatePhoneNumberLength,
} from 'libphonenumber-js/min';

// Incomplete typing / paste normalize
parseIncompletePhoneNumber('+44 20 7946 0958'); // '+442079460958'

// Display
new AsYouType('US').input('3125550148'); // '(312) 555-0148'

// GB without trunk 0 often needs international national-part grouping:
new AsYouType('GB').input('2079460958');           // '2079460958' (no spaces)
new AsYouType('GB').input('+442079460958');        // '+44 20 7946 0958'
```

## Country codes

- ISO 3166-1 alpha-2: `"US"`, `"GB"`, `"CA"`.
- Calling codes are shared (US/CA both `1`). Manual country changes between same calling code should keep national digits; different calling codes should clear or migrate carefully.

## Locales / flags

- Labels: `react-phone-number-input/locale/en.json`
- This app uses custom flags under `/images/country-flags/{cc}.svg`, not the package’s flag sprites.

## When you may use the library component

Only for isolated experiments or docs **outside** product forms. For anything shipped in onboarding, settings, or the design-system catalog field, use `@/shared/ui` `PhoneInput`.
