import { useId, useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Label } from '@/shared/ui/label';
import { Slider } from '@/shared/ui/slider';
import type { SliderInteraction } from '@/shared/ui/slider/types';
import { getHandleClassName } from '@/shared/ui/slider/utils';

const HANDLE_STATES: { interaction: SliderInteraction; label: string }[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
  { interaction: 'pressed', label: 'Pressed' },
];

function PreviewHandle({ interaction }: { interaction: SliderInteraction }) {
  return (
    <span
      className={getHandleClassName({
        interaction,
        live: false,
        positioned: false,
      })}
      data-slot="slider-handle"
    />
  );
}

function TemperatureExample() {
  const id = useId();
  const labelId = `${id}-label`;
  const [value, setValue] = useState<readonly [number, number]>([0.25, 0.85]);

  return (
    <div className="flex w-full flex-col gap-[8px]">
      <Label
        as="span"
        bold
        description={`${value[0].toFixed(2)} → ${value[1].toFixed(2)}`}
        direction="horizontal"
        id={labelId}
      >
        Temperature
      </Label>
      <Slider
        aria-labelledby={labelId}
        id={id}
        max={1}
        min={0}
        onValueChange={setValue}
        step={0.01}
        type="range"
        value={value}
      />
    </div>
  );
}

function PressureExample() {
  const id = useId();
  const labelId = `${id}-label`;
  const [value, setValue] = useState(200);

  return (
    <div className="flex w-full flex-col gap-[8px]">
      <Label as="span" bold description={String(value)} direction="horizontal" id={labelId}>
        Pressure
      </Label>
      <Slider
        aria-labelledby={labelId}
        id={id}
        max={250}
        min={0}
        onValueChange={setValue}
        value={value}
      />
    </div>
  );
}

function EdgeCases() {
  const [count, setCount] = useState(0);
  const [singleCount, setSingleCount] = useState(0);
  const [stepValue, setStepValue] = useState(0.3);

  return (
    <div className="flex w-full max-w-[320px] flex-col gap-6">
      <div className="space-y-2" data-testid="slider-count-range">
        <span data-testid="range-count">{count}</span>
        <Slider
          aria-label="Counted range"
          defaultValue={[20, 80]}
          name="counted"
          onValueChange={() => setCount((c) => c + 1)}
          type="range"
        />
      </div>
      <div className="space-y-2" data-testid="slider-count-single">
        <span data-testid="single-count">{singleCount}</span>
        <Slider
          aria-label="Counted single"
          defaultValue={50}
          onValueChange={() => setSingleCount((c) => c + 1)}
        />
      </div>
      <div className="space-y-2" data-testid="slider-step">
        <span data-testid="step-value">{stepValue}</span>
        <Slider
          aria-label="Step 0.1"
          max={1}
          min={0}
          onValueChange={setStepValue}
          step={0.1}
          value={stepValue}
        />
      </div>
      <div data-testid="slider-reversed">
        <Slider aria-label="Reversed" type="range" value={[80, 20]} />
      </div>
      <div data-testid="slider-nan-range">
        <Slider aria-label="NaN range" type="range" value={[Number.NaN, 50]} />
      </div>
      <div data-testid="slider-nan-single">
        <Slider aria-label="NaN single" value={Number.NaN} />
      </div>
      <div data-testid="slider-out-of-range">
        <Slider aria-label="Out of range" type="range" value={[-50, 500]} />
      </div>
      <div data-testid="slider-equal">
        <Slider aria-label="Equal" defaultValue={[50, 50]} type="range" />
      </div>
    </div>
  );
}

export function SliderSection() {
  return (
    <ComponentSection
      id="slider"
      title="Slider"
      description="An input where the user selects a value from within a given range."
    >
      <Example
        title="Handle states"
        description="Default, hover, and pressed. Hover uses a brand-50 ring; pressed uses brand-100."
        contentClassName="overflow-visible"
      >
        <div className="flex items-center gap-10">
          {HANDLE_STATES.map(({ interaction, label }) => (
            <div key={interaction} className="flex flex-col items-center gap-3">
              <span className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]">
                {label}
              </span>
              <PreviewHandle interaction={interaction} />
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="Types"
        description="Default fills from the start to one handle. Range fills between two handles."
        contentClassName="w-full flex-col items-stretch overflow-visible"
      >
        <div className="flex w-full max-w-[180px] flex-col gap-6">
          <div className="space-y-2">
            <span className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]">
              Type=Default
            </span>
            <Slider defaultValue={78} />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]">
              Type=Range
            </span>
            <Slider defaultValue={[22, 78]} type="range" />
          </div>
        </div>
      </Example>

      <Example
        title="Examples"
        description="Horizontal label shows the current value. Range uses two handles; default uses one."
        contentClassName="w-full flex-col items-stretch overflow-visible"
      >
        <TemperatureExample />
        <PressureExample />
      </Example>

      <Example
        title="Edge cases"
        description="Event counting, controlled bad values, step precision, and equal thumbs."
        contentClassName="w-full flex-col items-stretch overflow-visible"
      >
        <EdgeCases />
      </Example>
    </ComponentSection>
  );
}
