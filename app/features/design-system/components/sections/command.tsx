import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';

export function CommandSection() {
  return (
    <ComponentSection
      description="Command palette / searchable action list."
      id="command"
      title="Command"
    >
      <Example contentClassName="block p-0" title="Search list">
        <Command className="max-w-[360px] rounded-[12px] border border-subtle">
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Example>
    </ComponentSection>
  );
}
