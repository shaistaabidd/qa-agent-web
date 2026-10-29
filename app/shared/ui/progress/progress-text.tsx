import type { ReactNode } from 'react';

import { Label, type LabelDirection } from '@/shared/ui/label';
import { getLabelClassName } from '@/shared/ui/label/utils';
import { Typography } from '@/shared/ui/Typography';

function isPlainText(value: ReactNode): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}

export function ProgressText({
  children,
  className,
  description,
  direction,
  id,
  muted = false,
}: {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  direction: LabelDirection;
  id?: string;
  muted?: boolean;
}) {
  if (children == null && description == null) {
    return null;
  }

  if (muted && (isPlainText(children) || children == null)) {
    return (
      <span className={getLabelClassName(direction, className)} id={id}>
        {children != null ? (
          <Typography as="span" className="text-fg-secondary" variant="body3">
            {children}
          </Typography>
        ) : null}
        {description ? (
          <Typography as="span" className="text-fg-secondary" variant="body3">
            {description}
          </Typography>
        ) : null}
      </span>
    );
  }

  if (isPlainText(children) || children == null) {
    return (
      <Label
        as="span"
        bold
        className={className}
        description={description}
        direction={direction}
        id={id}
      >
        {children ?? ''}
      </Label>
    );
  }

  return (
    <div className={className} id={id}>
      {children}
    </div>
  );
}
