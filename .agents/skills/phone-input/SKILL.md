---
name: phone-input
description: >
  Guide for phone number inputs in this app using the shared PhoneInput wrapper,
  react-phone-number-input helpers, and libphonenumber-js. Use when: (1) adding
  or changing a phone/fax field, (2) formatting or validating E.164 numbers,
  (3) editing app/shared/ui/phone-input, (4) debugging country paste, GB/US
  formatting, or country dropdown selection, (5) working with react-phone-number-input
  or libphonenumber-js.
---

# Phone Input

## Default rule

Product UI must use `PhoneInput` from `@/shared/ui` (or `FormPhoneField` in onboarding/settings).

Do **not** mount `react-phone-number-input`'s `<PhoneInput>` / `PhoneInputWithCountry` in feature screens. That library UI caused silent wrong US formatting when pasting `+44…` under `international={false}`.

```tsx
import { PhoneInput } from '@/shared/ui';
// or
import { FormPhoneField } from '@/features/onboarding/fields/FormPhoneField';
```

## Value contract

- Stored / form value is **E.164**: `"+13125550148"`, `"+442079460958"`.
- Empty is the calling-code placeholder only in the control (`"+1"`); forms usually use `''` or `undefined` via `onChange`.
- Validate with `phoneSchema` / `faxSchema` from `@/shared/lib/schemas` (they call `isValidPhoneNumber`).

## Shared wrapper layout

```
app/shared/ui/phone-input/
  phone-input.tsx      # UI shell: country select + tel input
  country-select.tsx   # Flag / calling-code picker (pointerdown select)
  use-phone-input.ts   # State, blur validation, onChange
  format.ts            # readPhoneInput / selectPhoneCountry / display
  format-helpers.ts    # E.164, calling-code match, length limits
```

Behavior that must stay true:

| Case | Expected |
|------|----------|
| US-only + paste `+44 20 7946 0958` | Keep international text, show US error — **never** `(442) 079-4609` |
| US/CA/GB + paste `+44…` | Switch to GB, format national part |
| US/CA/GB + paste valid US after GB | Switch to US |
| Manual country pick | Always stick; clear digits when calling code changes; keep digits for US↔CA |
| GB without leading `0` | Format like `20 7946 0958` beside `+44` |
| Country menu | Commit on **pointerdown** (click can be swallowed when the menu closes) |

## Imports

| Need | Import |
|------|--------|
| UI | `PhoneInput` from `@/shared/ui` |
| Country labels | `react-phone-number-input/locale/en.json` (wrapper already does) |
| Validate / parse helpers | `isValidPhoneNumber`, `parsePhoneNumber`, `formatPhoneNumber` from `react-phone-number-input` **or** `libphonenumber-js/min` |
| As-you-type / incomplete format | `libphonenumber-js/min` (`AsYouType`, `parseIncompletePhoneNumber`, …) |
| Types | `Country` from `react-phone-number-input` (re-exported by `@/shared/ui`) |

Prefer `libphonenumber-js/min` inside `phone-input/*` format code. Prefer `react-phone-number-input` re-exports in schemas/settings when only validating or displaying.

## Props that matter

```tsx
<PhoneInput
  allowedCountries={['US']}           // default: US only
  // allowedCountries={['US', 'CA', 'GB']}
  defaultCountry="US"
  value={value || undefined}
  onChange={(next) => handleChange(next ?? '')}
  onBlur={handleBlur}
  error={Boolean(error)}
  helperText={error}
/>
```

- One allowed country → flag/code is read-only (no menu).
- Multiple → country menu; paste of an allowed calling code may auto-switch.

## Do not

- Set `international={false}` on the library input and expect foreign `+CC` pastes to stay correct — the library converts them to **national digits of the selected country**.
- Treat `min` metadata `isValidPhoneNumber` as Google-full validation; it is length-oriented. Use `max` only if product asks for stricter digit checks.
- Rebuild phone masking in a feature; extend `format.ts` / `format-helpers.ts` instead.
- Use barrel `@phosphor-icons/react` imports for country UI icons.

## When editing the wrapper

1. Load this skill.
2. Change format logic in `format.ts` / `format-helpers.ts`, not in JSX.
3. Country select must call `onChange` on **pointerdown** with `preventDefault` + `stopPropagation`.
4. After changes, verify: US-only `+44` paste, multi-country GB↔US paste, GB formatting, country menu US/CA/GB.

## Library details

For raw `react-phone-number-input` / `libphonenumber-js` API notes and pitfalls, see [references/library.md](references/library.md).
