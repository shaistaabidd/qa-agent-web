import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export function requiredText(message: string) {
  return z.string().trim().min(1, message);
}

export const phoneSchema = z
  .string()
  .refine(
    (value) => Boolean(value) && isValidPhoneNumber(value),
    'Please enter a valid phone number',
  );

export const faxSchema = z
  .string()
  .refine(
    (value) => Boolean(value) && isValidPhoneNumber(value),
    'Please enter a valid fax number',
  );

export const NPI_DIGIT_COUNT = 10;

export const npiSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || /^\d{10}$/.test(value),
    `Please enter a ${NPI_DIGIT_COUNT}-digit NPI number`,
  );

export const requiredNpiSchema = z
  .string()
  .trim()
  .regex(/^\d{10}$/, `Please enter a ${NPI_DIGIT_COUNT}-digit NPI number`);

export const zipSchema = requiredText('Please enter a ZIP code');

export const NAME_MAX_LENGTH = 50;

function personNameSchema(requiredMessage: string) {
  return requiredText(requiredMessage)
    .max(NAME_MAX_LENGTH, `Must be ${NAME_MAX_LENGTH} characters or fewer`)
    .regex(
      /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u,
      'Use letters, spaces, hyphens, apostrophes, and periods only',
    );
}

export const firstNameSchema = personNameSchema('Please enter a first name');

export const lastNameSchema = personNameSchema('Please enter a last name');

export const pharmacyNameSchema = requiredText('Please enter a pharmacy name');

export const contactPersonNameSchema = requiredText('Please enter a contact person name');

export const citySchema = requiredText('Please enter a city');

export const stateSchema = requiredText('Please select a state');

export const dateOfBirthSchema = requiredText('Please enter a date of birth');

export const genderSchema = requiredText('Please select a gender');

export const licensedStatesSchema = z.array(z.string()).min(1, 'Select at least 1 licensed state.');

export const optionalTextSchema = z.string();
