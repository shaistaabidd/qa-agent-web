import type { ChoiceCardSize } from './types';

export const cardBaseClass = [
  'relative box-border flex w-full cursor-pointer items-center overflow-hidden border border-solid px-[12px]',
  'has-[:disabled]:cursor-not-allowed',
].join(' ');

export const cardSizeClass: Record<ChoiceCardSize, string> = {
  large: 'rounded-[12px] py-[10px]',
  medium: 'rounded-[8px] py-[8px]',
};

export const cardDefaultClass = 'border-subtle bg-bg-raised';

export const cardHoverClass =
  'border-subtle bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]';

export const cardSelectedClass = 'border-primary bg-bg-primary-subtle';

export const cardLiveClass = [
  cardDefaultClass,
  'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'has-[:checked]:border-primary has-[:checked]:bg-bg-primary-subtle',
  'has-[:checked]:hover:border-primary has-[:checked]:hover:bg-bg-primary-subtle',
  'has-[:focus-visible]:shadow-focus',
].join(' ');

export const fieldClass =
  'w-full [&_[data-slot=checkbox-text]]:flex-1 [&_[data-slot=radio-text]]:flex-1 [&_[data-slot=switch-text]]:flex-1';
