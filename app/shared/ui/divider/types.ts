import type { HTMLAttributes } from 'react';

export const DIVIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export type DividerOrientation = (typeof DIVIDER_ORIENTATIONS)[number];

export type DividerTone = 'subtle' | 'default';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  decorative?: boolean;
  orientation?: DividerOrientation;
  tone?: DividerTone;
}
