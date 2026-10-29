import {
  ComponentSection,
  Example,
  ExampleGrid,
} from '@/features/design-system/components/Showcase';
import { Progress } from '@/shared/ui/progress';
import { Typography } from '@/shared/ui/Typography';

export function ProgressSection() {
  return (
    <ComponentSection
      description="Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."
      id="progress"
      title="Progress"
    >
      <ExampleGrid>
        <Example
          contentClassName="w-full flex-col items-stretch"
          description="Thin 4px track. Fill uses brand-primary."
          title="Linear"
        >
          <Progress aria-label="Upload" value={25} />
          <Progress aria-label="Upload" value={60} />
          <Progress aria-label="Upload" value={100} />
        </Example>
        <Example
          contentClassName="w-full flex-col items-stretch"
          description="24px ring. Arc length follows value."
          title="Circular"
        >
          <Progress aria-label="Upload" type="circular" value={25} />
          <Progress aria-label="Upload" type="circular" value={60} />
          <Progress aria-label="Upload" type="circular" value={100} />
        </Example>
      </ExampleGrid>

      <Example
        contentClassName="w-full flex-col items-stretch"
        description="Horizontal keeps label, bar, and status on one row. Vertical stacks them."
        title="Linear direction"
      >
        <div className="space-y-2">
          <Typography
            as="span"
            className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]"
            variant="caption"
          >
            Direction=Horizontal
          </Typography>
          <Progress label="Label" value={90} valueLabel="Uploading" />
        </div>
        <div className="space-y-2">
          <Typography
            as="span"
            className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]"
            variant="caption"
          >
            Direction=Vertical
          </Typography>
          <Progress direction="vertical" label="Label" value={90} valueLabel="Uploading" />
        </div>
      </Example>

      <Example
        contentClassName="w-full flex-col items-stretch"
        description="Stacked and inline layouts from the design-system examples."
        title="Linear examples"
      >
        <Progress direction="vertical" label="Processing" labelDescription="75%" value={75} />
        <Progress
          direction="vertical"
          label="Copying..."
          value={80}
          valueLabel="Item 245 of 780"
          valueLabelDescription="80%"
          valueLabelMuted
        />
        <Progress label="Uploading" value={75} valueLabel="75%" />
      </Example>

      <Example
        contentClassName="w-full flex-col items-stretch"
        description="Circle with stacked copy, inline percent, or a trailing value."
        title="Circular examples"
      >
        <Progress
          type="circular"
          value={25}
          valueLabel="Uploading (25%)"
          valueLabelDescription="Please wait while we process your files..."
        />
        <Progress label="Processing" type="circular" value={25} valueLabel="25%" />
        <Progress
          type="circular"
          value={75}
          valueLabel="Uploading"
          valueLabelDescription="75%"
          valueLabelDirection="horizontal"
        />
      </Example>
    </ComponentSection>
  );
}
