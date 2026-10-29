import { getMessageString } from '@/shared/lib/getMessageString';
import { toast } from '@/shared/ui/toast';

import { CrudDeleteDialog } from './crud-delete-dialog';
import { CrudEntityFormDialog } from './crud-entity-form-dialog';
import type { CrudCreateConfig, CrudDeleteConfig, CrudEditConfig, CrudListMutators } from './types';
import { isCrudEditFieldsConfig, isCrudFormFieldsConfig } from './types';

function defaultEditValues<T>(row: T, fieldNames: string[]): Record<string, string> {
  const record = row as Record<string, unknown>;
  return Object.fromEntries(
    fieldNames.map((name) => [name, record[name] == null ? '' : String(record[name])]),
  );
}

function entityName(entityLabel: string) {
  return `${entityLabel[0]!.toUpperCase()}${entityLabel.slice(1)}`;
}

function awaitToast<T>(result: Promise<T> | { unwrap: () => Promise<T> }): Promise<T> {
  if (typeof result === 'object' && result != null && 'unwrap' in result) {
    return result.unwrap();
  }
  return result;
}

export function CrudScreenDialogs<T>({
  activeTab,
  entityLabel,
  create,
  edit,
  deleteConfig,
  createOpen,
  setCreateOpen,
  editing,
  setEditing,
  deleteTarget,
  setDeleteTarget,
  deleting,
  setDeleting,
  setTab,
  list,
}: {
  activeTab: string | null;
  entityLabel: string;
  create?: CrudCreateConfig<T>;
  edit?: CrudEditConfig<T>;
  deleteConfig?: CrudDeleteConfig<T>;
  createOpen: boolean;
  setCreateOpen: (open: boolean) => void;
  editing: T | null;
  setEditing: (row: T | null) => void;
  deleteTarget: T | null;
  setDeleteTarget: (row: T | null) => void;
  deleting: boolean;
  setDeleting: (deleting: boolean) => void;
  setTab: (tab: string) => void;
  list: CrudListMutators<T>;
}) {
  return (
    <>
      {create && isCrudFormFieldsConfig(create) ? (
        <CrudEntityFormDialog
          description={create.description}
          fields={create.fields}
          initialValues={create.initialValues as Record<string, string> | undefined}
          onOpenChange={setCreateOpen}
          onSubmit={async (values) => {
            await awaitToast(
              toast.promise(
                Promise.resolve(create.onSubmit(values as never)).then((item) => {
                  // New rows are listed first, so go to page 1 and let the server say what is there.
                  list.goToFirstPage();
                  list.refetch();
                  return item;
                }),
                {
                  loading: `Creating ${entityLabel}…`,
                  success: create.successMessage ?? `${entityName(entityLabel)} created`,
                  error: (err: unknown) =>
                    getMessageString(err, 'Something went wrong. Please try again.'),
                },
              ),
            );
          }}
          open={createOpen}
          submitLabel={create.submitLabel ?? `Create ${entityLabel}`}
          title={create.title}
        />
      ) : null}

      {create && !isCrudFormFieldsConfig(create)
        ? create.render({
            close: () => setCreateOpen(false),
            list,
            setTab,
            tab: activeTab,
            visible: createOpen,
          })
        : null}

      {edit && editing && isCrudEditFieldsConfig(edit) ? (
        <CrudEntityFormDialog
          description={edit.description}
          fields={edit.fields}
          initialValues={
            edit.getValues
              ? (edit.getValues(editing) as Record<string, string>)
              : defaultEditValues(
                  editing,
                  edit.fields.map((field) => field.name),
                )
          }
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
          onSubmit={async (values) => {
            const row = editing;
            await awaitToast(
              toast.promise(
                Promise.resolve(edit.onSubmit(values as never, row)).then((updated) => {
                  // The edit may have moved the row out of this tab, filter or search.
                  list.refetch();
                  return updated;
                }),
                {
                  loading: `Updating ${entityLabel}…`,
                  success: edit.successMessage ?? `${entityName(entityLabel)} updated`,
                  error: (err: unknown) =>
                    getMessageString(err, 'Something went wrong. Please try again.'),
                },
              ),
            );
          }}
          open={editing != null}
          submitLabel={edit.submitLabel ?? 'Save changes'}
          title={edit.title}
        />
      ) : null}

      {edit && !isCrudEditFieldsConfig(edit) && editing
        ? edit.render({
            close: () => setEditing(null),
            list,
            row: editing,
            setTab,
            tab: activeTab,
            visible: true,
          })
        : null}

      {deleteConfig ? (
        <CrudDeleteDialog
          cancelLabel={deleteConfig.cancelLabel}
          confirmLabel={deleteConfig.confirmLabel}
          confirming={deleting}
          description={
            deleteTarget
              ? (deleteConfig.getDescription?.(deleteTarget) ?? 'This action cannot be undone.')
              : undefined
          }
          onConfirm={async () => {
            if (!deleteTarget) return;
            const row = deleteTarget;
            setDeleting(true);
            try {
              const promise = Promise.resolve(deleteConfig.onDelete(row)).then(() => {
                list.refetch();
              });
              await awaitToast(
                toast.promise(promise, {
                  loading: `Deleting ${entityLabel}…`,
                  success: `${entityName(entityLabel)} deleted`,
                  error: (err: unknown) =>
                    getMessageString(err, 'Something went wrong. Please try again.'),
                }),
              );
              setDeleteTarget(null);
            } catch {
              // toast.promise already surfaces the error
            } finally {
              setDeleting(false);
            }
          }}
          onOpenChange={(open) => {
            if (!open && !deleting) setDeleteTarget(null);
          }}
          open={deleteTarget != null}
          title={
            deleteTarget
              ? (deleteConfig.getTitle?.(deleteTarget) ?? `Delete this ${entityLabel}?`)
              : undefined
          }
        />
      ) : null}
    </>
  );
}
