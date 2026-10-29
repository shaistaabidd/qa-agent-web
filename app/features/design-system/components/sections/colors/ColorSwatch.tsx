import { Typography } from '@/shared/ui/Typography';

import type { ColorSwatchItem } from './constants';

export function ColorSwatch({ hex, name, token, utility }: ColorSwatchItem) {
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <div
        className="h-[64px] w-full rounded-[8px] border border-subtle"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="flex min-w-0 flex-col gap-[2px]">
        <Typography variant="caption" fontWeight="medium">
          {name}
        </Typography>
        <Typography variant="footer" className="truncate text-fg-secondary">
          {utility}
        </Typography>
        <Typography variant="footer" className="truncate font-mono text-fg-secondary">
          {hex}
        </Typography>
      </div>
    </div>
  );
}
