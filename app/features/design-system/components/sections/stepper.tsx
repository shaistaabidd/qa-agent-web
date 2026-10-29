import {
  ComponentSection,
  Example,
  ExampleGrid,
} from '@/features/design-system/components/Showcase';
import { Stepper, StepperBadge, StepperItem } from '@/shared/ui/stepper';

const STEPS = [
  {
    description: 'Add basic info',
    label: 'Basic Details',
    state: 'success' as const,
  },
  {
    description: 'Add payment method',
    label: 'Billing',
    state: 'current' as const,
  },
  {
    description: 'Before placing order',
    label: 'Review',
    state: 'default' as const,
  },
];

export function StepperSection() {
  return (
    <ComponentSection
      description="Steppers convey progress through numbered steps. It provides a wizard-like workflow."
      id="stepper"
      title="Stepper"
    >
      <Example description="Default, hover, current, success, and error." title="Badge states">
        <div className="flex flex-col gap-5">
          <StepperBadge step={1} />
          <StepperBadge interaction="hover" step={1} />
          <StepperBadge state="current" step={1} />
          <StepperBadge state="success" />
          <StepperBadge state="error" />
        </div>
      </Example>

      <ExampleGrid>
        <Example
          description="Label sits to the right of the badge."
          title="Item direction horizontal"
        >
          <StepperItem label="Label" />
        </Example>
        <Example description="Label sits below the badge." title="Item direction vertical">
          <StepperItem direction="vertical" label="Label" />
        </Example>
      </ExampleGrid>

      <Example
        contentClassName="block w-full"
        description="Labels below the badges. Connectors stretch between steps."
        title="Horizontal"
      >
        <Stepper itemDirection="vertical">
          {STEPS.map((step) => (
            <StepperItem key={step.label} label={step.label} state={step.state} />
          ))}
        </Stepper>
      </Example>

      <Example
        contentClassName="block w-full"
        description="Labels beside the badges, with supporting descriptions."
        title="Horizontal with descriptions"
      >
        <Stepper>
          {STEPS.map((step) => (
            <StepperItem
              key={step.label}
              description={step.description}
              label={step.label}
              state={step.state}
            />
          ))}
        </Stepper>
      </Example>

      <Example
        contentClassName="block w-full"
        description="Labels beside the badges in a column."
        title="Vertical"
      >
        <Stepper direction="vertical">
          {STEPS.map((step) => (
            <StepperItem
              key={step.label}
              description={step.description}
              label={step.label}
              state={step.state}
            />
          ))}
        </Stepper>
      </Example>

      <Example
        contentClassName="block w-full"
        description="Labels below the badges in a column."
        title="Vertical with labels below"
      >
        <Stepper direction="vertical" itemDirection="vertical">
          {STEPS.map((step) => (
            <StepperItem key={step.label} label={step.label} state={step.state} />
          ))}
        </Stepper>
      </Example>

      <Example
        contentClassName="block w-full"
        description="Error on the current step, remaining steps upcoming."
        title="Error state"
      >
        <Stepper>
          <StepperItem label="Account" state="success" />
          <StepperItem description="Card declined" label="Payment" state="error" />
          <StepperItem label="Confirm" />
        </Stepper>
      </Example>
    </ComponentSection>
  );
}
