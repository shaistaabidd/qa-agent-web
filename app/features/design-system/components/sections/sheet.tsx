import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerHeaderText,
  DrawerTitle,
} from '@/shared/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';

function DrawerWithDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open drawer with dialog
      </Button>
      <Drawer onOpenChange={setOpen} open={open} position="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerHeaderText>
              <DrawerTitle>Drawer</DrawerTitle>
              <DrawerDescription>Opens a dialog above this drawer.</DrawerDescription>
            </DrawerHeaderText>
          </DrawerHeader>
          <DrawerBody>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog over drawer</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm over drawer</DialogTitle>
                  <DialogDescription>Escape closes this dialog first.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function SheetSection() {
  return (
    <ComponentSection
      description="Side panel overlay for secondary flows."
      id="sheet"
      title="Sheet"
    >
      <Example title="Right">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow the list with status and date range.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-[16px] text-sm text-fg-secondary">Sheet body</div>
            <SheetFooter>
              <Button variant="outline">Reset</Button>
              <Button>Apply</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Example>

      <Example title="With dialog">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open sheet with dialog</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Delete items</SheetTitle>
              <SheetDescription>Confirming opens a dialog above this sheet.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-[16px]">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>Escape should close only this dialog.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </SheetContent>
        </Sheet>
      </Example>

      <Example title="Drawer with dialog">
        <DrawerWithDialog />
      </Example>
    </ComponentSection>
  );
}
