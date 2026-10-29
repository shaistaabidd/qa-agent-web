import type { ComponentProps } from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/shared/lib/utils';

import { getPayloadConfigFromPayload, useChart } from './chart-config';

export const ChartLegend = RechartsPrimitive.Legend;

export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign: _verticalAlign = 'bottom',
  nameKey,
}: ComponentProps<'div'> & {
  hideIcon?: boolean;
  nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div className={cn('flex items-center justify-center gap-[16px] py-[12px]', className)}>
      {payload
        .filter((item) => item.type !== 'none')
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              className="flex items-center gap-[6px] [&>svg]:h-[12px] [&>svg]:w-[12px] [&>svg]:text-fg-secondary"
              key={`${item.dataKey ?? item.value ?? 'item'}`}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-[8px] w-[8px] shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}
