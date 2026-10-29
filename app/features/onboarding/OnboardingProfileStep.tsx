import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { useForm } from '@tanstack/react-form';

import { useAuthStore } from '@/features/auth';
import { FormInput } from '@/shared/lib/FormInput';
import { firstNameSchema, lastNameSchema } from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { AuthScreenHeader } from '@/shell/auth';

import { OnboardingProgress } from './components/OnboardingProgress';
import { useSaveOnboardingStep } from './hooks/useSaveOnboardingStep';

/** Onboarding step 1: first and last name. */
export function OnboardingProfileStep() {
  const user = useAuthStore((state) => state.user);
  const { isPending, submit } = useSaveOnboardingStep();

  const form = useForm({
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' },
    onSubmit: async ({ value }) => {
      await submit({ firstName: value.firstName.trim(), lastName: value.lastName.trim() });
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
      <AuthScreenHeader description="Tell us your first and last name." title="Your name" />
      <OnboardingProgress current="step1" status={user?.onboarding} />

      <div className="grid gap-[16px]">
        <FormInput
          form={form}
          label="First name"
          name="firstName"
          size="xl"
          validate={firstNameSchema}
        />
        <FormInput
          form={form}
          label="Last name"
          name="lastName"
          size="xl"
          validate={lastNameSchema}
        />
      </div>

      <Button disabled={isPending} size="xl" type="submit" variant="default">
        {isPending ? <CircleNotchIcon aria-hidden className="animate-spin" /> : null}
        Next
      </Button>
    </form>
  );
}
