import { DotsThreeIcon } from '@phosphor-icons/react/DotsThree';
import { NotePencilIcon } from '@phosphor-icons/react/NotePencil';
import { ProhibitIcon } from '@phosphor-icons/react/Prohibit';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export function DropdownMenuDemo() {
  return (
    <ComponentSection
      description="Action menu triggered from a button. Use this for more options, not the form Dropdown."
      id="dropdown-menu"
      title="Dropdown Menu"
    >
      <Example
        description="Icon trigger with default and destructive actions."
        title="More options"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="More options" size="icon-md" variant="outline">
              <DotsThreeIcon aria-hidden weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <NotePencilIcon aria-hidden weight="regular" />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <ProhibitIcon aria-hidden weight="regular" />
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>
    </ComponentSection>
  );
}
