import { type ComponentProps, useId, useMemo } from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/shared/lib/utils';

import { type ChartConfig, ChartContext, THEMES } from './chart-config';

const CSS_VALUE_BREAKOUT_RE = /[;{}]|\/\*/;

function isSafeCssValue(value: string) {
  return !CSS_VALUE_BREAKOUT_RE.test(value);
}

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;
const surfaceFocusClass = [
  '[&_.recharts-surface]:outline-hidden',
  '[&_.recharts-surface:focus-visible]:outline-solid',
  '[&_.recharts-surface:focus-visible]:outline-2',
  '[&_.recharts-surface:focus-visible]:-outline-offset-2',
  '[&_.recharts-surface:focus-visible]:outline-brand-500',
].join(' ');

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: Omit<ComponentProps<'div'>, 'aria-label'> & {
  'aria-label': string;
  config: ChartConfig;
  children: ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
  initialDimension?: {
    width: number;
    height: number;
  };
}) {
  const uniqueId = useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;
  const contextValue = useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex aspect-video justify-center text-sm [&_.recharts-cartesian-axis-tick_text]:fill-medium [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-[var(--border-color-low)]/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-[var(--border-color-low)] [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-[var(--border-color-low)] [&_.recharts-radial-bar-background-sector]:fill-surface-background-variant [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-surface-background-variant [&_.recharts-reference-line_[stroke='#ccc']]:stroke-[var(--border-color-low)] [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          surfaceFocusClass,
          className,
        )}
        data-chart={chartId}
        role="group"
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.theme ?? item.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color;
    if (!color || !isSafeCssValue(color) || !isSafeCssValue(key)) return null;
    return `  --color-${key}: ${color};`;
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  );
}

export { ChartContainer, ChartStyle };
