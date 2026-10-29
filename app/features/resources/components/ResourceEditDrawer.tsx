import { useEffect, useRef } from 'react';

import type { CrudFormRenderApi } from '@/shared/ui/crud';

import type { useResourceActions } from '../hooks/useResourceActions';
import { useResourceDetail } from '../hooks/useResourceDetail';
import { useResourceForm } from '../hooks/useResourceForm';
import type { Resource } from '../types';
import { toFormValues } from '../utils';
import { ResourceFormDrawer } from './ResourceFormDrawer';

type ResourceEditDrawerProps = CrudFormRenderApi<Resource> & {
  actions: ReturnType<typeof useResourceActions>;
  row: Resource;
};

type ResourceEditFormProps = ResourceEditDrawerProps & {
  loadFailed: boolean;
  loading: boolean;
  onRetry: () => void;
  resource: Resource | null;
};

function ResourceEditForm({
  actions,
  close,
  list,
  loadFailed,
  loading,
  onRetry,
  resource,
  row,
  visible,
}: ResourceEditFormProps) {
  const initial = toFormValues(resource ?? row);

  const form = useResourceForm({
    initial,
    onClose: close,
    onSubmit: async (values) => {
      await actions.update(row, values);
      list.refetch();
    },
    successMessage: 'Resource updated successfully',
  });

  // Reset once per row. A background re-render or refetch of the same row must not wipe typing.
  const appliedForId = useRef<string | null>(null);
  useEffect(() => {
    if (!resource || appliedForId.current === resource.id) return;
    appliedForId.current = resource.id;
    form.reset(toFormValues(resource));
  }, [form, resource]);

  return (
    <ResourceFormDrawer
      existingFileUrl={resource?.pdfFileUrl}
      form={form}
      loadFailed={loadFailed}
      loading={loading}
      onClose={close}
      onRetry={onRetry}
      open={visible}
      submitLabel="Update resource"
      title="Edit resource"
    />
  );
}

export function ResourceEditDrawer(props: ResourceEditDrawerProps) {
  const { error, loading, refetch, resource } = useResourceDetail(props.row.id);

  return (
    <ResourceEditForm
      {...props}
      loadFailed={Boolean(error) || (!loading && !resource)}
      loading={loading}
      onRetry={() => void refetch()}
      resource={resource}
    />
  );
}
