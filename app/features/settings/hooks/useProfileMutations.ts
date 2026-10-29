import { useMutation } from '@apollo/client/react';

import { type AuthGraphQLUser } from '@/features/auth';
import { REMOVE_IMAGE, UPDATE_USER } from '@/graphql/mutations/userMutations';

import { showSuccess, syncSessionUser } from './syncSessionUser';

type UpdateUserData = { updateUser?: { user?: AuthGraphQLUser } };
type RemoveImageData = { updateUser?: { user?: AuthGraphQLUser } };

export type ProfileUpdate = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export function useProfileMutations() {
  const [updateUser] = useMutation<UpdateUserData>(UPDATE_USER);
  const [uploadImage, { loading: isUploading }] = useMutation<UpdateUserData>(UPDATE_USER);
  const [removeImage, { loading: isRemoving }] = useMutation<RemoveImageData>(REMOVE_IMAGE);

  async function updateProfile(patch: ProfileUpdate, message = 'Profile updated successfully.') {
    const result = await updateUser({ variables: patch });

    syncSessionUser(result.data?.updateUser?.user);
    showSuccess(message);
  }

  async function uploadPhoto(file: File) {
    const result = await uploadImage({ variables: { image: file } });

    syncSessionUser(result.data?.updateUser?.user);
    showSuccess('Profile photo updated.');
  }

  async function removePhoto() {
    const result = await removeImage();

    syncSessionUser(result.data?.updateUser?.user);
    showSuccess('Profile photo removed.');
  }

  return {
    isPhotoPending: isUploading || isRemoving,
    removePhoto,
    updateProfile,
    uploadPhoto,
  };
}
