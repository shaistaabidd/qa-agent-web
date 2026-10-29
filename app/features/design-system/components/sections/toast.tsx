import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogFooterActions,
  DialogHeader,
  DialogHeaderText,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import type { ToastStatusVariant } from '@/shared/ui/toast';
import { toast, TOAST_POSITIONS } from '@/shared/ui/toast';

const STATUS_VARIANTS = ['success', 'error', 'info'] as const;

const STATUS_LABELS: Record<ToastStatusVariant, string> = {
  error: 'Show error toast',
  info: 'Show info toast',
  success: 'Show success toast',
};

function showStatusToast(variant: ToastStatusVariant) {
  const show = {
    error: toast.error,
    info: toast.info,
    success: toast.success,
  }[variant];

  show('Message goes here', {
    action: {
      label: 'Undo',
      onClick: () => {},
    },
  });
}

function DialogToastExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="md" variant="outline">
          Open dialog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeaderText>
            <DialogTitle>Toast over dialog</DialogTitle>
            <DialogDescription>The toast stays above this dialog.</DialogDescription>
          </DialogHeaderText>
        </DialogHeader>
        <DialogFooter>
          <DialogFooterActions>
            <Button
              onClick={() =>
                toast.success('Saved while a dialog is open', {
                  action: {
                    label: 'Undo',
                    onClick: () => {},
                  },
                })
              }
              size="md"
            >
              Show toast
            </Button>
          </DialogFooterActions>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ToastSection() {
  return (
    <ComponentSection
      description="A floating notification for short feedback. Uses Sonner, with success, error, and info icons from the design system."
      id="toast"
      title="Toast"
    >
      <Example
        contentClassName="flex flex-wrap items-center gap-[8px]"
        description="Click a button to open that toast."
        title="Examples"
      >
        {STATUS_VARIANTS.map((variant) => (
          <Button
            key={variant}
            onClick={() => showStatusToast(variant)}
            size="md"
            variant="outline"
          >
            {STATUS_LABELS[variant]}
          </Button>
        ))}
        <Button
          onClick={() => toast('Message goes here', { closeButton: false })}
          size="md"
          variant="outline"
        >
          Show pill toast
        </Button>
        <Button
          onClick={() =>
            toast.success('Message goes here', {
              action: {
                label: 'Undo',
                onClick: () => toast.info('Undo clicked'),
              },
            })
          }
          size="md"
          variant="outline"
        >
          Show with undo
        </Button>
      </Example>

      <Example
        contentClassName="flex flex-wrap items-center gap-[8px]"
        description="Pass position on the toast, or set a default on Toaster."
        title="Position"
      >
        {TOAST_POSITIONS.map((position) => (
          <Button
            key={position}
            onClick={() =>
              toast.success(`Toast at ${position.replaceAll('-', ' ')}`, {
                position,
              })
            }
            size="sm"
            variant="outline"
          >
            {position.replaceAll('-', ' ')}
          </Button>
        ))}
      </Example>

      <Example
        description="Open the dialog, then show a toast. It should stay in front of the overlay."
        title="Above dialog"
      >
        <DialogToastExample />
      </Example>
    </ComponentSection>
  );
}
