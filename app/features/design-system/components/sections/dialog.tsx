import { PencilLineIcon } from '@phosphor-icons/react/PencilLine';
import { XIcon } from '@phosphor-icons/react/X';
import { useId, useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Alert, AlertTitle } from '@/shared/ui/alert';
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
  DialogMedia,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/Typography';

const previewPanelClass =
  'group/dialog-content pointer-events-none relative flex w-[456px] flex-col overflow-hidden rounded-[16px] bg-bg-elevated text-fg-default shadow-modal';

function PreviewClose() {
  return (
    <Button
      aria-label="Close"
      className="absolute top-[6px] right-[6px] z-10"
      data-ui="dialog-close"
      size="icon-sm"
      variant="ghost"
    >
      <XIcon aria-hidden weight="light" />
    </Button>
  );
}

function InfoBanner() {
  return (
    <Alert variant="info">
      <AlertTitle>Please fill the form</AlertTitle>
    </Alert>
  );
}

function AnatomyFooter({ sticky = false }: { sticky?: boolean }) {
  return (
    <DialogFooter sticky={sticky}>
      <DialogFooterActions>
        <Button size="md" variant="outline">
          Close
        </Button>
      </DialogFooterActions>
      <DialogFooterActions>
        <Button size="md" variant="outline">
          Retry
        </Button>
        <Button size="md">Submit</Button>
      </DialogFooterActions>
    </DialogFooter>
  );
}

function ConfirmationExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="md" variant="outline">
          Open confirmation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeaderText>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>Are you sure you want to submit?</DialogDescription>
          </DialogHeaderText>
        </DialogHeader>
        <DialogFooter>
          <DialogFooterActions>
            <DialogClose asChild>
              <Button size="md" variant="outline">
                Discard
              </Button>
            </DialogClose>
          </DialogFooterActions>
          <DialogFooterActions>
            <DialogClose asChild>
              <Button size="md">Submit</Button>
            </DialogClose>
          </DialogFooterActions>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormExample() {
  const nameId = useId();
  const addressId = useId();
  const line2Id = useId();
  const cityId = useId();
  const zipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="md" variant="outline" onClick={() => setOpen(true)}>
        Open form dialog
      </Button>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent closeOnOutsideClick={false} size="lg">
          <DialogHeader>
            <DialogMedia>
              <PencilLineIcon aria-hidden weight="light" />
            </DialogMedia>
            <DialogHeaderText>
              <DialogTitle>Fill out your information</DialogTitle>
              <DialogDescription>Please fill the correct information.</DialogDescription>
            </DialogHeaderText>
          </DialogHeader>
          <DialogBody>
            <InfoBanner />
            <Typography as="p" fontWeight="bold" variant="body2">
              Your Information
            </Typography>
            <div className="flex w-full flex-col gap-[8px]">
              <Label htmlFor={nameId}>Full Name</Label>
              <Input defaultValue="John Doe" id={nameId} size="md" />
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              <Label htmlFor={addressId}>Address</Label>
              <Input defaultValue="Street 43" id={addressId} size="md" />
              <Input defaultValue="Line 2" id={line2Id} placeholder="Line 2" size="md" />
              <div className="flex gap-[8px]">
                <Input defaultValue="California" size="md" />
                <Input defaultValue="San Diego" id={cityId} size="md" />
                <Input defaultValue="12894" id={zipId} size="md" />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogFooterActions>
              <DialogClose asChild>
                <Button size="md" variant="outline">
                  Discard
                </Button>
              </DialogClose>
            </DialogFooterActions>
            <DialogFooterActions>
              <Button size="md" variant="outline">
                Retry
              </Button>
              <DialogClose asChild>
                <Button size="md">Submit</Button>
              </DialogClose>
            </DialogFooterActions>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CompactExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="md" variant="outline">
          Open compact
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} size="sm">
        <DialogHeader>
          <DialogHeaderText>
            <DialogTitle>Allow notifications?</DialogTitle>
            <DialogDescription>Get updates about your orders and messages.</DialogDescription>
          </DialogHeaderText>
        </DialogHeader>
        <DialogFooter>
          <DialogFooterActions>
            <DialogClose asChild>
              <Button size="md" variant="outline">
                Discard
              </Button>
            </DialogClose>
          </DialogFooterActions>
          <DialogFooterActions>
            <DialogClose asChild>
              <Button size="md">Allow</Button>
            </DialogClose>
          </DialogFooterActions>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DialogDemo() {
  return (
    <ComponentSection
      description="A window overlaid on the page that renders the content underneath inert. Header, body, and footer compose the dialog; the footer can be sticky."
      id="dialog"
      title="Dialog"
    >
      <Example
        description="Title, supporting text, and a close icon in the top-right."
        title="Header"
      >
        <div className="flex items-start gap-[24px]">
          <span className="w-[118px] pt-[16px] font-mono text-[16px] text-[#7B61FF] dark:text-[#a99bff]">
            Header
          </span>
          <div className={previewPanelClass}>
            <PreviewClose />
            <DialogHeader>
              <DialogHeaderText>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>Supporting text</DialogDescription>
              </DialogHeaderText>
            </DialogHeader>
          </div>
        </div>
      </Example>

      <Example
        description="Left and right action groups. Medium outline and primary buttons."
        title="Footer"
      >
        <div className="flex items-start gap-[24px]">
          <span className="w-[118px] pt-[16px] font-mono text-[16px] text-[#7B61FF] dark:text-[#a99bff]">
            Footer
          </span>
          <div className={previewPanelClass}>
            <AnatomyFooter />
          </div>
        </div>
      </Example>

      <Example
        description="Uses the background surface and a top border so it stays visually pinned while the body scrolls."
        title="Sticky footer"
      >
        <div className="flex items-start gap-[24px]">
          <span className="w-[118px] pt-[16px] font-mono text-[16px] text-[#7B61FF] dark:text-[#a99bff]">
            Sticky Footer
          </span>
          <div className={previewPanelClass}>
            <AnatomyFooter sticky />
          </div>
        </div>
      </Example>

      <Example
        description="Centered overlay with a blurred scrim. Escape, overlay click, and the close icon dismiss it."
        title="Confirmation"
      >
        <ConfirmationExample />
      </Example>

      <Example
        description="Large size with an icon header and scrollable body. closeOnOutsideClick is false so the form stays locked until Discard, Submit, or the close icon."
        title="Form"
      >
        <FormExample />
      </Example>

      <Example
        description="Small size without a close icon. Matches the compact overlay pattern."
        title="Compact"
      >
        <CompactExample />
      </Example>
    </ComponentSection>
  );
}
