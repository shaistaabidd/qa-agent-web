import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart';

const data = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 273 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--color-brand-600)' },
} satisfies ChartConfig;

const title = 'Desktop visitors by month';
const description = data.map((point) => `${point.month} ${point.desktop}`).join(', ');

export function ChartSection() {
  return (
    <ComponentSection
      description="Recharts wrapper with themed tooltips and config."
      id="chart"
      title="Chart"
    >
      <Example contentClassName="block" title="Bar">
        <ChartContainer
          aria-label={title}
          className="h-[260px] w-full max-w-[420px]"
          config={config}
        >
          <BarChart accessibilityLayer data={data} desc={description} title={title}>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey="month" tickLine={false} tickMargin={8} />
            <YAxis axisLine={false} tickLine={false} tickMargin={8} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Example>
    </ComponentSection>
  );
}
