import { useMutation } from '@apollo/client/react';

import { UPDATE_PASSWORD } from '@/graphql/mutations/userMutations';

import { SettingsActionError } from '../errors';
import { showSuccess } from './syncSessionUser';

type UpdatePasswordData = { updatePassword?: { success?: boolean } };

export function useChangePassword() {
  const [updatePassword] = useMutation<UpdatePasswordData>(UPDATE_PASSWORD);

  async function changePassword(values: { currentPassword: string; password: string }) {
    const result = await updatePassword({
      variables: {
        currentPassword: values.currentPassword,
        password: values.password,
        passwordConfirmation: values.password,
      },
    });

    if (!result.data?.updatePassword?.success) {
      throw new SettingsActionError('Unable to change password.');
    }

    showSuccess('Password changed successfully.');
  }

  return { changePassword };
}
