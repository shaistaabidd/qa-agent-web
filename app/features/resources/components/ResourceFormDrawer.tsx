import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';

import { Button } from '@/shared/ui/button';
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
import { EmptyState } from '@/shared/ui/empty-state';

import type { ResourceFormApi } from '../hooks/useResourceForm';
import { ResourceFormFields } from './ResourceFormFields';

const FORM_ID = 'resource-form';

type ResourceFormDrawerProps = {
  existingFileUrl?: string | null;
  form: ResourceFormApi;
  loadFailed?: boolean;
  loading?: boolean;
  onClose: () => void;
  onRetry?: () => void;
  open: boolean;
  submitLabel: string;
  title: string;
};

export function ResourceFormDrawer({
  existingFileUrl,
  form,
  loadFailed,
  loading,
  onClose,
  onRetry,
  open,
  submitLabel,
  title,
}: ResourceFormDrawerProps) {
  return (
    <Drawer onOpenChange={(next) => (next ? undefined : onClose())} open={open} position="right">
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerHeaderText>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeaderText>
        </DrawerHeader>
        <DrawerBody>
          {loading ? (
            <div className="flex flex-1 items-center justify-center py-[48px]">
              <CircleNotchIcon
                aria-label="Loading resource"
                className="size-6 animate-spin text-icon-medium"
                weight="bold"
              />
            </div>
          ) : loadFailed ? (
            <EmptyState
              icon={<WarningCircleIcon aria-hidden weight="regular" />}
              subheading="Unable to load this resource. Please try again."
              title="Failed to load resource"
            >
              <Button onClick={onRetry} size="sm" type="button" variant="outline">
                Retry
              </Button>
            </EmptyState>
          ) : (
            <form
              className="flex flex-col gap-[20px]"
              id={FORM_ID}
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void form.handleSubmit();
              }}
            >
              <ResourceFormFields existingFileUrl={existingFileUrl} form={form} />
            </form>
          )}
        </DrawerBody>
        <DrawerFooter sticky>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <>
                <DrawerFooterActions>
                  <Button
                    disabled={isSubmitting}
                    onClick={onClose}
                    size="md"
                    type="button"
                    variant="outline"
                  >
                    Close
                  </Button>
                </DrawerFooterActions>
                <DrawerFooterActions>
                  <Button
                    disabled={isSubmitting || loading || loadFailed}
                    form={FORM_ID}
                    size="md"
                    type="submit"
                  >
                    {isSubmitting ? 'Saving…' : submitLabel}
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
