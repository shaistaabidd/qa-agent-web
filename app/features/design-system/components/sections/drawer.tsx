import { UserIcon } from '@phosphor-icons/react/User';
import { useId, useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Alert, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerFooterActions,
  DrawerHeader,
  DrawerHeaderText,
  DrawerMedia,
  type DrawerPosition,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/Typography';

const POSITIONS: DrawerPosition[] = ['right', 'bottom', 'left', 'top'];

function InfoBanner() {
  return (
    <Alert variant="info">
      <AlertTitle>Please fill the form</AlertTitle>
    </Alert>
  );
}

function OffCanvasExample() {
  const nameId = useId();
  const addressId = useId();
  const line2Id = useId();
  const cityId = useId();
  const zipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="md" variant="outline" onClick={() => setOpen(true)}>
        Open right drawer
      </Button>
      <Drawer onOpenChange={setOpen} open={open} position="right">
        <DrawerContent closeOnOutsideClick={false}>
          <DrawerHeader>
            <DrawerMedia variant="avatar">
              <span className="flex size-full items-center justify-center bg-bg-primary-subtle text-fg-primary">
                <UserIcon aria-hidden weight="light" />
              </span>
            </DrawerMedia>
            <DrawerHeaderText>
              <DrawerTitle>John Doe</DrawerTitle>
              <DrawerDescription>Joined at 12 Apr, 2020</DrawerDescription>
            </DrawerHeaderText>
          </DrawerHeader>
          <DrawerBody>
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
          </DrawerBody>
          <DrawerFooter sticky>
            <DrawerFooterActions>
              <DrawerClose asChild>
                <Button size="md" variant="outline">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooterActions>
            <DrawerFooterActions>
              <Button size="md" variant="outline">
                Retry
              </Button>
              <DrawerClose asChild>
                <Button size="md">Submit</Button>
              </DrawerClose>
            </DrawerFooterActions>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function PositionExample({ position }: { position: DrawerPosition }) {
  return (
    <Drawer position={position}>
      <DrawerTrigger asChild>
        <Button size="md" variant="outline">
          Open {position}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerHeaderText>
            <DrawerTitle>Drawer title</DrawerTitle>
            <DrawerDescription>Slides in from the {position}.</DrawerDescription>
          </DrawerHeaderText>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerFooterActions>
            <DrawerClose asChild>
              <Button size="md" variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooterActions>
          <DrawerFooterActions>
            <DrawerClose asChild>
              <Button size="md">Submit</Button>
            </DrawerClose>
          </DrawerFooterActions>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function BottomSheetExample() {
  return (
    <Drawer position="bottom">
      <DrawerTrigger asChild>
        <Button size="md" variant="outline">
          Open bottom sheet
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerHeaderText>
            <DrawerTitle>Allow notifications?</DrawerTitle>
            <DrawerDescription>
              Use position=&quot;bottom&quot; on mobile as a bottom sheet.
            </DrawerDescription>
          </DrawerHeaderText>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerFooterActions>
            <DrawerClose asChild>
              <Button size="md" variant="outline">
                Discard
              </Button>
            </DrawerClose>
          </DrawerFooterActions>
          <DrawerFooterActions>
            <DrawerClose asChild>
              <Button size="md">Allow</Button>
            </DrawerClose>
          </DrawerFooterActions>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function DrawerDemo() {
  return (
    <ComponentSection
      description="An off-canvas panel that uses the same header, body, and footer as Dialog. Position it on the right, left, top, or bottom — bottom is the mobile bottom-sheet pattern."
      id="drawer"
      title="Drawer"
    >
      <Example
        description="Same Dialog elements, docked to the right with a sticky footer. Matches the Figma off-canvas example."
        title="Off canvas"
      >
        <OffCanvasExample />
      </Example>

      <Example
        description="Pass position on Drawer. Right and left are full-height; top and bottom cap at 80vh."
        title="Positions"
      >
        <div className="flex flex-wrap gap-[12px]">
          {POSITIONS.map((position) => (
            <PositionExample key={position} position={position} />
          ))}
        </div>
      </Example>

      <Example
        description="A bottom drawer with a grab handle. On mobile, open the same content from the bottom instead of the side."
        title="Bottom sheet"
      >
        <BottomSheetExample />
      </Example>
    </ComponentSection>
  );
}
