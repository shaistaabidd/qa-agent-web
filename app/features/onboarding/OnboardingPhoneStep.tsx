import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { useForm } from '@tanstack/react-form';
import { Link } from 'react-router';

import { ONBOARDING_STEP_PATHS, useAuthStore } from '@/features/auth';
import { FormPhoneField } from '@/shared/lib/FormPhoneField';
import { phoneSchema } from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { AuthScreenHeader } from '@/shell/auth';

import { OnboardingProgress } from './components/OnboardingProgress';
import { useSaveOnboardingStep } from './hooks/useSaveOnboardingStep';

/** Onboarding step 2: phone number. */
export function OnboardingPhoneStep() {
  const user = useAuthStore((state) => state.user);
  const { isPending, submit } = useSaveOnboardingStep();

  const form = useForm({
    defaultValues: { phone: user?.phone ?? '' },
    onSubmit: async ({ value }) => {
      await submit({ phone: value.phone });
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-[24px]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <AuthScreenHeader description="Add a phone number for your account." title="Phone number" />
      <OnboardingProgress current="step2" status={user?.onboarding} />

      <FormPhoneField
        form={form}
        label="Phone number"
        name="phone"
        required
        validate={phoneSchema}
      />

      <div className="flex gap-[12px]">
        <Button asChild className="flex-1" size="xl" variant="outline">
          <Link to={ONBOARDING_STEP_PATHS.step1}>Back</Link>
        </Button>
        <Button className="flex-1" disabled={isPending} size="xl" type="submit" variant="default">
          {isPending ? <CircleNotchIcon aria-hidden className="animate-spin" /> : null}
          Finish
        </Button>
      </div>
    </form>
  );
}
