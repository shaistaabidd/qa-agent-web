import { Button } from '@/shared/ui/button';
import type { CrudFormRenderApi } from '@/shared/ui/crud';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerFooterActions,
  DrawerHeader,
  DrawerHeaderText,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { ImageUploader } from '@/shared/ui/image-uploader';

import type { CoAdminActions } from '../hooks/useCoAdminActions';
import { useCoAdminForm } from '../hooks/useCoAdminForm';
import { useCoAdminPhoto } from '../hooks/useCoAdminPhoto';
import type { CoAdmin } from '../types';
import { coAdminLabel, coAdminPhotoUrl, toFormValues } from '../utils';
import { CoAdminFormFields } from './CoAdminFormFields';

const FORM_ID = 'co-admin-form';

type CoAdminEditDrawerProps = CrudFormRenderApi<CoAdmin> & {
  actions: CoAdminActions;
  row: CoAdmin;
};

export function CoAdminEditDrawer({ actions, close, list, row, visible }: CoAdminEditDrawerProps) {
  const photo = useCoAdminPhoto(coAdminPhotoUrl(row));

  const form = useCoAdminForm({
    initial: toFormValues(row),
    onClose: close,
    onSubmit: async (values) => {
      await actions.update(row, values, photo.change);
      list.refetch();
    },
    successMessage: 'User updated successfully',
  });

  return (
    <Drawer onOpenChange={(next) => (next ? undefined : close())} open={visible} position="right">
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerHeaderText>
            <DrawerTitle>Edit user</DrawerTitle>
          </DrawerHeaderText>
        </DrawerHeader>
        <DrawerBody>
          <form
            className="flex flex-col gap-[20px]"
            id={FORM_ID}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <ImageUploader
              alt={coAdminLabel(row)}
              onChange={() => {}}
              onFileChange={photo.pick}
              onRemove={photo.remove}
              removeVariant="ghost"
              shape="circular"
              size="80"
              value={photo.value}
            />
            <CoAdminFormFields email={row.email} form={form} />
          </form>
        </DrawerBody>
        <DrawerFooter sticky>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <>
                <DrawerFooterActions>
                  <Button
                    disabled={isSubmitting}
                    onClick={close}
                    size="md"
                    type="button"
                    variant="outline"
                  >
                    Close
                  </Button>
                </DrawerFooterActions>
                <DrawerFooterActions>
                  <Button disabled={isSubmitting} form={FORM_ID} size="md" type="submit">
                    {isSubmitting ? 'Saving…' : 'Save changes'}
                  </Button>
                </DrawerFooterActions>
              </>
            )}
          </form.Subscribe>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
