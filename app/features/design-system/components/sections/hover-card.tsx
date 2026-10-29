import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/hover-card';

export function HoverCardSection() {
  return (
    <ComponentSection
      description="Preview card shown on hover or focus."
      id="hover-card"
      title="Hover Card"
    >
      <Example title="Basic">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@saastemp</Button>
          </HoverCardTrigger>
          <HoverCardContent className="flex gap-[12px]">
            <Avatar size="40">SH</Avatar>
            <div className="space-y-[2px] text-sm">
              <p className="font-medium text-fg-default">SaaS Temp</p>
              <p className="text-fg-secondary">Hover cards for quick profiles.</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Example>
    </ComponentSection>
  );
}
