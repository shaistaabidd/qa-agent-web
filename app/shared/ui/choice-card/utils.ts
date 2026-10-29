import { cn } from '@/shared/lib/utils';

import {
  cardBaseClass,
  cardDefaultClass,
  cardHoverClass,
  cardLiveClass,
  cardSelectedClass,
  cardSizeClass,
} from './constants';
import type { ChoiceCardInteraction, ChoiceCardSize } from './types';

export function getCardClassName({
  checked = false,
  className,
  interaction,
  size,
}: {
  checked?: boolean;
  className?: string;
  interaction?: ChoiceCardInteraction;
  size: ChoiceCardSize;
}) {
  const isPreview = interaction !== undefined;

  return cn(
    cardBaseClass,
    cardSizeClass[size],
    isPreview
      ? checked
        ? cardSelectedClass
        : interaction === 'hover'
          ? cardHoverClass
          : cardDefaultClass
      : cardLiveClass,
    isPreview && 'pointer-events-none',
    className,
  );
}
