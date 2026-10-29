import { TrashIcon } from '@phosphor-icons/react/Trash';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogFooterActions,
  DialogHeader,
  DialogHeaderText,
  DialogMedia,
  DialogTitle,
} from '@/shared/ui/dialog';

export type CrudDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
  onConfirm: () => void;
};

export function CrudDeleteDialog({
  open,
  onOpenChange,
  title = 'Delete this item?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  confirmingLabel,
  cancelLabel = 'Cancel',
  confirming = false,
  onConfirm,
}: CrudDeleteDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        closeDisabled={confirming}
        closeOnEscape={!confirming}
        closeOnOutsideClick={!confirming}
      >
        <DialogHeader>
          <DialogMedia>
            <TrashIcon aria-hidden weight="regular" />
          </DialogMedia>
          <DialogHeaderText>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeaderText>
        </DialogHeader>
        <DialogFooter>
          <DialogFooterActions>
            <Button
              disabled={confirming}
              onClick={() => onOpenChange(false)}
              size="md"
              type="button"
              variant="outline"
            >
              {cancelLabel}
            </Button>
          </DialogFooterActions>
          <DialogFooterActions>
            <Button
              disabled={confirming}
              onClick={onConfirm}
              size="md"
              type="button"
              variant="danger"
            >
              {confirming ? (confirmingLabel ?? 'Deleting…') : confirmLabel}
            </Button>
          </DialogFooterActions>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
