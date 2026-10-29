import { useMutation } from '@apollo/client/react';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { useForm } from '@tanstack/react-form';

import {
  applyGraphQLSession,
  type AuthGraphQLUser,
  hardNavigateAfterAuth,
  useAuthStore,
} from '@/features/auth';
import { UPDATE_USER } from '@/graphql/mutations/userMutations';
import { FormInput } from '@/shared/lib/FormInput';
import { optionalTextSchema } from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast';
import { Typography } from '@/shared/ui/Typography';
import { AuthScreenHeader } from '@/shell/auth';

export function AddCalendarForm() {
  const user = useAuthStore((state) => state.user);
  const [updateUser, { loading }] = useMutation(UPDATE_USER);

  const form = useForm({
    defaultValues: {
      calendarLink: user?.calendarLink ?? '',
    },
    onSubmit: async ({ value }) => {
      if (!user?.id) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      try {
        const result = await updateUser({
          variables: {
            calendarLink: value.calendarLink.trim() || undefined,
            id: user.id,
          },
        });

        const payload = result.data as {
          updateUser?: { user?: AuthGraphQLUser };
        } | null;
        const nextUser = payload?.updateUser?.user;
        const token = useAuthStore.getState().accessToken;

        if (!token) {
          toast.error('Session expired. Please log in again.');
          return;
        }

        const sessionUser = applyGraphQLSession(token, {
          ...(nextUser ?? user),
          calendarLink: value.calendarLink.trim() || nextUser?.calendarLink || 'skipped',
        });
        toast.success('Calendar preferences saved');
        hardNavigateAfterAuth(sessionUser);
      } catch {
        // The Apollo error link already shows this failure.
      }
    },
  });

  async function skip() {
    const token = useAuthStore.getState().accessToken;
    if (!token || !user) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    const sessionUser = applyGraphQLSession(token, {
      ...user,
      calendarLink: user.calendarLink || 'skipped',
    });
    hardNavigateAfterAuth(sessionUser);
  }

  return (
    <form
      className="flex w-full flex-col gap-[24px]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <AuthScreenHeader
        description="Add your booking calendar link so clients can schedule with you."
        title="Add calendar"
      />

      <FormInput
        form={form}
        label="Calendar link"
        name="calendarLink"
        placeholder="https://"
        size="xl"
        validate={optionalTextSchema}
      />

      <div className="flex flex-col gap-[12px]">
        <Button disabled={loading} size="xl" type="submit" variant="default">
          {loading ? <CircleNotchIcon aria-hidden className="animate-spin" /> : null}
          Continue
        </Button>
        <Button
          disabled={loading}
          onClick={() => void skip()}
          size="xl"
          type="button"
          variant="outline"
        >
          Skip for now
        </Button>
        <Typography className="text-medium" variant="body2">
          You can update this later from your profile settings.
        </Typography>
      </div>
    </form>
  );
}
