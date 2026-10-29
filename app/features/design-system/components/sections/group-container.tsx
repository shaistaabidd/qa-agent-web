import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import { GroupContainer } from '@/shared/ui/group-container';

export function GroupContainerSection() {
  return (
    <ComponentSection
      description="Grouped panel with optional title and action."
      id="group-container"
      title="Group Container"
    >
      <Example
        contentClassName="block w-full max-w-[420px] bg-transparent p-0 border-0"
        title="With title"
      >
        <GroupContainer
          action={
            <Button size="sm" variant="ghost">
              Edit
            </Button>
          }
          title="Contact details"
        >
          <div className="rounded-[8px] bg-bg-raised p-[16px] text-sm text-fg-secondary">
            Group body content
          </div>
        </GroupContainer>
      </Example>
    </ComponentSection>
  );
}
