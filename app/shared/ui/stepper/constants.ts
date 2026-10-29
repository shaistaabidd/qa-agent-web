import type {
  StepperDirection,
  StepperInteraction,
  StepperItemDirection,
  StepperState,
} from './types';

export const badgeClass =
  'relative flex size-[28px] shrink-0 items-center justify-center overflow-hidden rounded-full text-label-sm [font-variant-numeric:tabular-nums]';

export const badgeStateClass: Record<StepperState, string> = {
  default: 'border border-solid border-default bg-transparent text-fg-secondary',
  current: 'border-transparent bg-bg-primary text-fg-on-primary',
  success: 'border-transparent bg-bg-success text-fg-on-primary',
  error: 'border-transparent bg-bg-danger text-fg-on-primary',
};

export const badgeInteractionClass: Record<StepperInteraction, string> = {
  default: badgeStateClass.default,
  hover:
    'border border-solid border-strong bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] text-fg-secondary',
};

export const itemDirectionClass: Record<StepperItemDirection, string> = {
  horizontal: 'flex items-center gap-[8px]',
  vertical: 'flex flex-col items-center gap-[8px]',
};

export const itemLayoutClass: Record<`${StepperDirection}-${StepperItemDirection}`, string> = {
  'horizontal-horizontal': 'shrink-0',
  'horizontal-vertical': 'relative min-w-0 flex-1',
  'vertical-horizontal': 'shrink-0',
  'vertical-vertical': 'shrink-0',
};

export const itemLabelClass: Record<StepperItemDirection, string | undefined> = {
  horizontal: undefined,
  vertical: 'w-full items-center text-center',
};

export const overlayConnectorClass =
  'pointer-events-none absolute top-[16px] left-[calc(50%+16px)] right-[calc(-50%+16px)] flex h-0 items-center px-[8px]';

export const rootDirectionClass: Record<StepperDirection, string> = {
  horizontal: 'flex w-full',
  vertical: 'flex flex-col',
};

export const rootAlignClass: Record<`${StepperDirection}-${StepperItemDirection}`, string> = {
  'horizontal-horizontal': 'items-center',
  'horizontal-vertical': 'items-start',
  'vertical-horizontal': 'items-start',
  'vertical-vertical': 'items-center',
};

export const connectorWrapClass: Record<`${StepperDirection}-${StepperItemDirection}`, string> = {
  'horizontal-horizontal': 'flex min-w-0 flex-1 items-center px-[8px]',
  'horizontal-vertical': 'flex h-[32px] min-w-0 flex-1 items-center self-start px-[8px]',
  'vertical-horizontal': 'flex h-[40px] w-[32px] shrink-0 items-center justify-center',
  'vertical-vertical': 'flex h-[40px] w-[32px] shrink-0 items-center justify-center',
};
