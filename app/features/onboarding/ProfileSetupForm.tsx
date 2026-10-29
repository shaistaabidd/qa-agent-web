import { useMutation } from '@apollo/client/react';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { useForm } from '@tanstack/react-form';

import {
  applyGraphQLSession,
  type AuthGraphQLUser,
  hardNavigateAfterAuth,
  normalizeUserType,
  useAuthStore,
} from '@/features/auth';
import { CLINIC_ONBOARDING } from '@/graphql/mutations/clinicMutations';
import { FormInput } from '@/shared/lib/FormInput';
import { FormPhoneField } from '@/shared/lib/FormPhoneField';
import { getMessageString } from '@/shared/lib/getMessageString';
import { optionalTextSchema, phoneSchema, requiredText } from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { toast } from '@/shared/ui/toast';
import { AuthScreenHeader } from '@/shell/auth';

const required = requiredText('This field is required');

export function ProfileSetupForm() {
  const user = useAuthStore((state) => state.user);
  const isClinicOwner = normalizeUserType(user?.userType) === 'super_clinic_admin';

  const [clinicOnboarding, { loading: clinicLoading }] = useMutation(CLINIC_ONBOARDING);

  const form = useForm({
    defaultValues: {
      address: user?.address ?? '',
      city: user?.city ?? '',
      clinicName: user?.clinicName ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
      smsConsent: false,
      state: user?.state ?? '',
      website: '',
      zipCode: user?.zipCode ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (isClinicOwner) {
          const result = await clinicOnboarding({
            variables: {
              address: value.address,
              city: value.city,
              firstName: value.firstName,
              lastName: value.lastName,
              name: value.clinicName,
              phone: value.phone,
              smsConsent: value.smsConsent,
              state: value.state,
              website: value.website || undefined,
              zip: value.zipCode,
            },
          });

          const payload = result.data as {
            clinicOnboarding?: {
              message?: string;
              user?: AuthGraphQLUser;
            };
          } | null;
          const nextUser = payload?.clinicOnboarding?.user;
          if (!nextUser) {
            toast.error(getMessageString(payload?.clinicOnboarding));
            return;
          }

          const token = useAuthStore.getState().accessToken;
          if (!token) {
            toast.error('Session expired. Please log in again.');
            return;
          }

          const sessionUser = applyGraphQLSession(token, {
            ...nextUser,
            onboardingCompleted: true,
          });
          toast.success(payload?.clinicOnboarding?.message || 'Clinic profile saved');
          hardNavigateAfterAuth(sessionUser);
          return;
        }

        // Only clinic roles have a setup step; saas-api users go straight on.
        if (user) {
          hardNavigateAfterAuth(user);
        }
      } catch {
        // The Apollo error link already shows this failure.
      }
    },
  });

  const isPending = clinicLoading;

  return (
    <form
      className="flex w-full flex-col gap-[24px]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <AuthScreenHeader description="Complete your profile to continue." title="Profile setup" />

      <div className="grid gap-[16px]">
        <FormInput form={form} label="First name" name="firstName" size="xl" validate={required} />
        <FormInput form={form} label="Last name" name="lastName" size="xl" validate={required} />
        {isClinicOwner ? (
          <>
            <FormInput
              form={form}
              label="Clinic name"
              name="clinicName"
              size="xl"
              validate={required}
            />
            <FormInput
              form={form}
              label="Website"
              name="website"
              size="xl"
              validate={optionalTextSchema}
            />
          </>
        ) : null}
        <FormPhoneField form={form} label="Phone" name="phone" validate={phoneSchema} />
        <FormInput form={form} label="Address" name="address" size="xl" validate={required} />
        <FormInput form={form} label="City" name="city" size="xl" validate={required} />
        <FormInput form={form} label="State" name="state" size="xl" validate={required} />
        <FormInput form={form} label="ZIP code" name="zipCode" size="xl" validate={required} />
        {isClinicOwner ? (
          <form.Field name="smsConsent">
            {(field) => (
              <Checkbox
                checked={field.state.value}
                name={field.name}
                onBlur={field.handleBlur}
                onCheckedChange={(checked) => field.handleChange(checked === true)}
              >
                I agree to receive SMS updates related to my account.
              </Checkbox>
            )}
          </form.Field>
        ) : null}
      </div>

      <Button disabled={isPending} size="xl" type="submit" variant="default">
        {isPending ? <CircleNotchIcon aria-hidden className="animate-spin" /> : null}
        Continue
      </Button>
    </form>
  );
}
