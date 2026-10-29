import { z } from 'zod';

export const roleNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter a role name')
  .max(100, 'Use 100 characters or fewer');

export const credentialValueSchema = z.string().min(1, 'Enter the credential');
