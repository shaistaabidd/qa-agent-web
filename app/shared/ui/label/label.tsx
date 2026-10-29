import { InfoIcon } from '@phosphor-icons/react/Info';

import { Typography } from '@/shared/ui/Typography';

import { hintIconClass, rowClass } from './constants';
import type { LabelProps } from './types';
import { getLabelClassName } from './utils';

export function Label({
  as = 'label',
  bold = false,
  children,
  className,
  description,
  direction = 'vertical',
  disabled = false,
  error = false,
  hint = false,
  hintIcon,
  htmlFor,
  optional = false,
  required,
  ...props
}: LabelProps) {
  const Comp = as;
  const labelColor = disabled ? 'text-fg-muted' : error ? 'text-fg-danger' : 'text-fg-default';
  const resolvedHint = hintIcon ?? (hint ? <InfoIcon weight="fill" /> : null);

  return (
    <Comp
      className={getLabelClassName(direction, className)}
      data-invalid={error || undefined}
      data-slot="label"
      htmlFor={as === 'label' ? htmlFor : undefined}
      {...props}
    >
      <span className={rowClass}>
        <Typography
          as="span"
          variant="body3"
          fontWeight={bold ? 'medium' : 'regular'}
          className={labelColor}
        >
          {children}
        </Typography>
        {required ? (
          <Typography
            as="span"
            variant="body3"
            fontWeight="bold"
            className={disabled ? 'text-fg-muted' : 'text-fg-danger'}
          >
            *
          </Typography>
        ) : null}
        {optional && !required ? (
          <Typography as="span" variant="caption" className="text-fg-muted">
            (optional)
          </Typography>
        ) : null}
        {resolvedHint ? <span className={hintIconClass}>{resolvedHint}</span> : null}
      </span>
      {description ? (
        <Typography
          variant="body3"
          as="span"
          className={disabled ? 'text-fg-muted' : 'text-fg-secondary'}
        >
          {description}
        </Typography>
      ) : null}
    </Comp>
  );
}
