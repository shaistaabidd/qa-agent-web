import { z } from 'zod';

export const projectNameSchema = z
  .string()
  .trim()
  .min(1, 'Enter a project name')
  .max(255, 'Use 255 characters or fewer');

export const targetUrlSchema = z
  .string()
  .trim()
  .min(1, 'Enter the address of the app to test')
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Enter a web address, like https://staging.example.com');
