import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Search } from '@/shared/ui/search';

export function SearchSection() {
  return (
    <ComponentSection description="Debounced URL-synced search field." id="search" title="Search">
      <Example contentClassName="block w-full max-w-[360px]" title="Default">
        <Search placeholder="Search users" />
      </Example>
    </ComponentSection>
  );
}
