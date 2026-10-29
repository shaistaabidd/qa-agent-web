import { BuildingsIcon } from '@phosphor-icons/react/Buildings';
import { PlusIcon } from '@phosphor-icons/react/Plus';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';

export function EmptyStateSection() {
  return (
    <ComponentSection
      description="Placeholder for lists and pages with no items. md is the compact in-list state; lg is the full-pane illustration."
      id="empty-state"
      title="Empty State"
    >
      <Example
        contentClassName="flex min-h-[240px] items-center justify-center px-[24px]"
        description="md: 80px circle, 40px icon, body2 title, and body3 subheading."
        title="Default"
      >
        <EmptyState
          icon={<BuildingsIcon aria-hidden weight="regular" />}
          subheading="Pending accounts require your approval before they can get started."
          title="No pending accounts"
        />
      </Example>

      <Example
        contentClassName="flex min-h-[280px] items-center justify-center px-[24px]"
        description="Optional children render below the copy, for an action."
        title="With action"
      >
        <EmptyState
          icon={<BuildingsIcon aria-hidden weight="regular" />}
          subheading="Add or invite an account to get started."
          title="No accounts yet"
        >
          <Button leftIcon={<PlusIcon aria-hidden weight="bold" />} size="lg">
            Add Account
          </Button>
        </EmptyState>
      </Example>

      <Example
        contentClassName="flex min-h-[420px] items-stretch px-[24px]"
        description="lg: 200px illustration, h6 title, and the same action slot."
        title="Large"
      >
        <EmptyState
          icon={<BuildingsIcon aria-hidden weight="regular" />}
          size="lg"
          subheading="Add or invite an account to get started."
          title="No accounts yet"
        >
          <Button leftIcon={<PlusIcon aria-hidden weight="bold" />} size="lg">
            Add Account
          </Button>
        </EmptyState>
      </Example>
    </ComponentSection>
  );
}
