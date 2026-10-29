import { useForm } from '@tanstack/react-form';

import { getMessageString } from '@/shared/lib/getMessageString';
import { toast } from '@/shared/ui/toast';

import type { CoAdminFormValues } from '../types';

type UseCoAdminFormOptions = {
  initial: CoAdminFormValues;
  onClose: () => void;
  onSubmit: (values: CoAdminFormValues) => Promise<void>;
  successMessage: string;
};

export function useCoAdminForm({
  initial,
  onClose,
  onSubmit,
  successMessage,
}: UseCoAdminFormOptions) {
  return useForm({
    defaultValues: initial,
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value);
        toast.success(successMessage);
        onClose();
      } catch (error) {
        toast.error(getMessageString(error, 'Something went wrong. Please try again.'));
      }
    },
  });
}

export type CoAdminFormApi = ReturnType<typeof useCoAdminForm>;
