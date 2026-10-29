import { z } from 'zod';

import { requiredText } from '@/shared/lib/schemas';

import { isVideoUrl } from './utils';

export const resourceTitleSchema = requiredText('Please enter a title');

export const resourceCategorySchema = requiredText('Please select a category');

export const videoLinkSchema = z
  .string()
  .refine(
    (value) => value.trim() === '' || isVideoUrl(value),
    'Please enter a valid Vimeo or YouTube URL',
  );

export const descriptionSchema = z.string();
