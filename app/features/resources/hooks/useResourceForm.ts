import { useForm } from '@tanstack/react-form';

import { getMessageString } from '@/shared/lib/getMessageString';
import { toast } from '@/shared/ui/toast';

import type { ResourceFormValues } from '../types';

export const EMPTY_RESOURCE_FORM: ResourceFormValues = {
  category: '',
  description: '',
  file: null,
  resourceType: 'CLIENT',
  title: '',
  videoLink: '',
};

type UseResourceFormOptions = {
  initial: ResourceFormValues;
  onClose: () => void;
  onSubmit: (values: ResourceFormValues) => Promise<void>;
  successMessage: string;
};

export function useResourceForm({
  initial,
  onClose,
  onSubmit,
  successMessage,
}: UseResourceFormOptions) {
  const form = useForm({
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

  return form;
}

export type ResourceFormApi = ReturnType<typeof useResourceForm>;
