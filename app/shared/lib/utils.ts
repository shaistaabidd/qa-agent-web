import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Named type-scale tokens (text-label-lg, text-body-base, ...) aren't recognized
// by tailwind-merge's default font-size matcher, so it falls back to treating them
// as text-color utilities -- silently dropping a real color class like
// text-fg-default when both appear in the same cn() call. Registering them under
// the font-size group keeps that conflict resolution (later size wins) without
// colliding with color utilities.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'heading-lg',
            'heading-md',
            'heading-sm',
            'body-lg',
            'body-base',
            'body-sm',
            'label-lg',
            'label-base',
            'label-sm',
            'overline',
            'code',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
