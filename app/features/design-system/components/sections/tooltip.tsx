import { GearIcon } from '@phosphor-icons/react/Gear';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import { Tooltip, TOOLTIP_SIDES, TooltipProvider } from '@/shared/ui/tooltip';

export function TooltipSection() {
  return (
    <ComponentSection
      description="Tooltips display informative text when users hover over, focus on, or tap an element."
      id="tooltip"
      title="Tooltip"
    >
      <TooltipProvider delayDuration={0}>
        <Example
          contentClassName="flex flex-wrap items-center gap-[8px]"
          description="Hover or focus the trigger to show the label."
          title="Button trigger"
        >
          <Tooltip content="Tooltip label">
            <Button size="md" variant="outline">
              Hover me
            </Button>
          </Tooltip>
        </Example>

        <Example
          contentClassName="flex flex-wrap items-center justify-center gap-[48px] py-[48px]"
          description="Place the tooltip on the top, bottom, left, or right of the trigger."
          title="Position"
        >
          {TOOLTIP_SIDES.map((side) => (
            <Tooltip content="Tooltip label" key={side} side={side}>
              <Button size="md" variant="outline">
                {side}
              </Button>
            </Tooltip>
          ))}
        </Example>

        <Example
          contentClassName="flex flex-wrap items-center gap-[8px]"
          description="Use an icon-only control when the label is the only text."
          title="Icon trigger"
        >
          <Tooltip content="Settings" side="bottom">
            <Button aria-label="Settings" size="icon-md" variant="ghost">
              <GearIcon aria-hidden weight="regular" />
            </Button>
          </Tooltip>
        </Example>
      </TooltipProvider>
    </ComponentSection>
  );
}
