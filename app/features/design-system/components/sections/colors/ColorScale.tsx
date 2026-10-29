import { Typography } from '@/shared/ui/Typography';

import type { ColorScale as ColorScaleData } from './constants';

export function ColorScale({ name, prefix, steps }: ColorScaleData) {
  return (
    <div className="w-full space-y-[6px]">
      <Typography variant="body3" fontWeight="medium">
        {name}
      </Typography>
      <div className="flex gap-[6px]">
        {steps.map((step) => (
          <div key={`${prefix}-${step.step}`} className="min-w-0 flex-1 space-y-[4px] text-center">
            <div
              className="h-[48px] w-full rounded-[6px] border border-subtle"
              style={{
                backgroundColor: `var(--color-${prefix}-${step.step})`,
              }}
            />
            <Typography variant="footer" className="text-fg-secondary">
              {step.step}
            </Typography>
            <Typography variant="footer" className="truncate font-mono text-fg-secondary">
              {step.hex}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
