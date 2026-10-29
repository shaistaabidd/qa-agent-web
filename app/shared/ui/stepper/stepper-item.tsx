import { cn } from '@/shared/lib/utils';
import { Divider } from '@/shared/ui/divider';
import { Label } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/Typography';

import { itemLabelClass, overlayConnectorClass } from './constants';
import { StepperBadge } from './stepper-badge';
import { useStepperContext } from './stepper-context';
import type { StepperItemProps } from './types';
import { getItemClassName, hasStepperText, usesOverlayConnectors } from './utils';

function isPlainText(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}

export function StepperItem({
  className,
  description,
  direction,
  interaction = 'default',
  isLast = true,
  label,
  state = 'default',
  step,
  ...props
}: StepperItemProps) {
  const stepper = useStepperContext();
  const stepperDirection = stepper?.direction ?? 'horizontal';
  const itemDirection = direction ?? stepper?.itemDirection ?? 'horizontal';
  const showLabel = hasStepperText(label) || hasStepperText(description);
  const showOverlayConnector =
    stepper != null && usesOverlayConnectors(stepper.direction, itemDirection) && !isLast;
  const isCurrentStep = state === 'current' || state === 'error';

  return (
    <div
      aria-current={isCurrentStep ? 'step' : undefined}
      className={getItemClassName(stepperDirection, itemDirection, className, stepper != null)}
      data-direction={itemDirection}
      data-slot="stepper-item"
      data-state={state}
      {...props}
    >
      <StepperBadge interaction={interaction} state={state} step={step} />
      {showOverlayConnector ? (
        <div aria-hidden className={overlayConnectorClass} data-slot="stepper-connector">
          <Divider tone="default" />
        </div>
      ) : null}
      {showLabel ? (
        isPlainText(label) || label == null ? (
          <Label as="span" bold className={itemLabelClass[itemDirection]} description={description}>
            {label ?? ''}
          </Label>
        ) : (
          <div
            className={cn(
              'flex w-full flex-col justify-center gap-[2px]',
              itemLabelClass[itemDirection],
            )}
          >
            {label}
            {hasStepperText(description) ? (
              <Typography as="span" className="text-fg-secondary" variant="body3">
                {description}
              </Typography>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  );
}
