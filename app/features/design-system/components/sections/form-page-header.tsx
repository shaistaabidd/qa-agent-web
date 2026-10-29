import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { FormPageHeader } from '@/shared/ui/form-page-header';

export function FormPageHeaderSection() {
  return (
    <ComponentSection
      description="Sticky header for create/edit forms with back and actions."
      id="form-page-header"
      title="Form Page Header"
    >
      <Example contentClassName="block w-full p-0" title="Default">
        <FormPageHeader
          onBack={() => undefined}
          onDiscard={() => undefined}
          submitLabel="Save"
          title="Edit account"
        />
      </Example>
    </ComponentSection>
  );
}
