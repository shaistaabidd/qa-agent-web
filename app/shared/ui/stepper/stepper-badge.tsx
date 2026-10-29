import { Typography } from '@/shared/ui/Typography';

import { StepperSuccessIcon } from './stepper-icons';
import type { StepperBadgeProps } from './types';
import { getBadgeClassName } from './utils';

export function StepperBadge({
  className,
  interaction = 'default',
  state = 'default',
  step = 1,
  ...props
}: StepperBadgeProps) {
  return (
    <span
      className={getBadgeClassName(state, interaction, className)}
      data-interaction={interaction}
      data-slot="stepper-badge"
      data-state={state}
      {...props}
    >
      {state === 'success' ? (
        <StepperSuccessIcon />
      ) : (
        <Typography
          as="span"
          className="text-center whitespace-nowrap"
          fontWeight="medium"
          variant="body3"
        >
          {state === 'error' ? '!' : step}
        </Typography>
      )}
    </span>
  );
}
