import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';

import { Button } from '@/shared/ui/button';

type TanStackExpandIconProps = {
  expanded: boolean;
  onToggle: () => void;
};

export function TanStackExpandIcon({ expanded, onToggle }: TanStackExpandIconProps) {
  return (
    <Button
      aria-expanded={expanded}
      aria-label={expanded ? 'Collapse row' : 'Expand row'}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <CaretDownIcon
        aria-hidden
        className={`size-4 shrink-0 text-icon-medium transition-transform duration-300 ease-out ${
          expanded ? 'rotate-180' : 'rotate-0'
        }`}
        weight="regular"
      />
    </Button>
  );
}
