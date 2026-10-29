import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import type { FormEvent, ReactNode } from 'react';

import type { ButtonVariant } from '@/shared/ui/button';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogFooterActions,
  DialogHeader,
  DialogHeaderText,
  DialogTitle,
} from '@/shared/ui/dialog';

import { reportSettingsError } from '../errors';

type SettingsDialogProps = {
  cancelLabel?: string;
  children?: ReactNode;
  confirmDisabled?: boolean;
  confirmLabel: string;
  confirmPending?: boolean;
  confirmVariant?: ButtonVariant;
  description?: ReactNode;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void | Promise<void>;
  open: boolean;
  title: string;
};

export function SettingsDialog({
  cancelLabel = 'Cancel',
  children,
  confirmDisabled = false,
  confirmLabel,
  confirmPending = false,
  confirmVariant = 'default',
  description,
  onOpenChange,
  onSubmit,
  open,
  title,
}: SettingsDialogProps) {
  const pending = confirmPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (confirmDisabled || pending) {
      return;
    }

    try {
      await onSubmit();
    } catch (error) {
      reportSettingsError(error);
    }
  }

  function handleOpenChange(next: boolean) {
    if (pending && !next) {
      return;
    }

    onOpenChange(next);
  }

  const cancelAction = (
    <DialogFooterActions>
      <DialogClose asChild>
        <Button disabled={pending} size="md" type="button" variant="outline">
          {cancelLabel}
        </Button>
      </DialogClose>
    </DialogFooterActions>
  );
  const confirmAction = (
    <DialogFooterActions>
      <Button
        aria-busy={pending || undefined}
        disabled={confirmDisabled || pending}
        leftIcon={
          pending ? (
            <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
          ) : undefined
        }
        size="md"
        type="submit"
        variant={confirmVariant}
      >
        {confirmLabel}
      </Button>
    </DialogFooterActions>
  );

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent
        className="max-w-[400px]"
        closeOnEscape={!pending}
        closeOnOutsideClick={!pending}
        size="md"
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogHeaderText>
              <DialogTitle>{title}</DialogTitle>
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeaderText>
          </DialogHeader>
          {children ? <DialogBody>{children}</DialogBody> : null}
          <DialogFooter>
            {cancelAction}
            {confirmAction}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
