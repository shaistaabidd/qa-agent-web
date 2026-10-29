import { CheckCircleIcon } from '@phosphor-icons/react/CheckCircle';
import { CircleIcon } from '@phosphor-icons/react/Circle';

import type { OnboardingStatus, OnboardingStepName } from '@/features/auth';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Typography } from '@/shared/ui/Typography';

const STEP_LABELS: Record<OnboardingStepName, string> = {
  step1: 'Your name',
  step2: 'Phone number',
};

const FIELD_LABELS: Record<string, string> = {
  firstName: 'first name',
  lastName: 'last name',
  phone: 'phone number',
};

type OnboardingProgressProps = {
  current: OnboardingStepName;
  status: OnboardingStatus | null | undefined;
};

/** "Step 1 of 2", each step's completion, and what is still missing on this step. */
export function OnboardingProgress({ current, status }: OnboardingProgressProps) {
  const steps = status?.steps ?? [];
  const step = steps.find((item) => item.step === current);
  const missing = step && !step.completed ? step.missingFields : [];

  return (
    <div className="flex flex-col gap-[16px]">
      {step ? (
        <Typography className="text-disabled" variant="body2">
          Step {step.position} of {steps.length}
        </Typography>
      ) : null}
      <ol className="flex flex-col gap-[8px]">
        {steps.map((item) => (
          <li className="flex items-center gap-[8px]" key={item.step}>
            {item.completed ? (
              <CheckCircleIcon aria-hidden className="size-[20px] text-fg-success" weight="fill" />
            ) : (
              <CircleIcon aria-hidden className="size-[20px] text-disabled" weight="regular" />
            )}
            <Typography
              className={item.step === current ? 'text-high' : 'text-medium'}
              fontWeight={item.step === current ? 'semibold' : 'regular'}
              variant="body2"
            >
              {item.position}. {STEP_LABELS[item.step]}
              <span className="sr-only">{item.completed ? ' (done)' : ' (to do)'}</span>
            </Typography>
          </li>
        ))}
      </ol>
      {missing.length > 0 ? (
        <Alert variant="warning">
          <AlertTitle>Some details are missing</AlertTitle>
          <AlertDescription>
            Add your {missing.map((field) => FIELD_LABELS[field] ?? field).join(' and ')} to
            continue.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
