import { z } from 'zod';

export const PASSWORD_RULES = [
  {
    id: 'length',
    label: '8+ characters',
    test: (value: string) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'special',
    label: 'At least one special character',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

export const EMAIL_MAX_LENGTH = 254;

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(EMAIL_MAX_LENGTH, 'Please enter a valid email address')
  .pipe(z.email('Please enter a valid email address'));

export const passwordSchema = z.string().min(1, 'Password is required');

export const strongPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .refine(
    (value) => PASSWORD_RULES.every((rule) => rule.test(value)),
    'Password must meet all the requirements listed below',
  );

export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Please enter the 6-digit verification code');

export function confirmPasswordError({
  value,
  fieldApi,
}: {
  value: string;
  fieldApi: {
    form: { getFieldValue: (name: 'password') => string };
  };
}) {
  return value === fieldApi.form.getFieldValue('password') ? undefined : 'Passwords do not match';
}
