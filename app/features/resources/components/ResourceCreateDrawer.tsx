import { useEffect } from 'react';

import type { CrudFormRenderApi } from '@/shared/ui/crud';

import type { useResourceActions } from '../hooks/useResourceActions';
import { EMPTY_RESOURCE_FORM, useResourceForm } from '../hooks/useResourceForm';
import type { Resource } from '../types';
import { ResourceFormDrawer } from './ResourceFormDrawer';

type ResourceCreateDrawerProps = CrudFormRenderApi<Resource> & {
  actions: ReturnType<typeof useResourceActions>;
};

export function ResourceCreateDrawer({ actions, close, list, visible }: ResourceCreateDrawerProps) {
  const form = useResourceForm({
    initial: EMPTY_RESOURCE_FORM,
    onClose: close,
    onSubmit: async (values) => {
      await actions.create(values);
      list.goToFirstPage();
      list.refetch();
    },
    successMessage: 'Resource added successfully',
  });

  useEffect(() => {
    if (!visible) {
      form.reset(EMPTY_RESOURCE_FORM);
    }
  }, [form, visible]);

  return (
    <ResourceFormDrawer
      form={form}
      onClose={close}
      open={visible}
      submitLabel="Add resource"
      title="Add resource"
    />
  );
}
