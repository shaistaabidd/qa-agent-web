import { CheckCircleIcon } from '@phosphor-icons/react/CheckCircle';
import { CircleIcon } from '@phosphor-icons/react/Circle';

import { PASSWORD_RULES } from '@/shared/lib/schemas';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const hasValue = password.length > 0;

  return (
    <ul className="flex flex-col gap-[8px]">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        const invalid = hasValue && !met;

        return (
          <li className="flex items-center gap-[8px]" key={rule.id}>
            {met ? (
              <CheckCircleIcon
                aria-hidden
                className="size-[18px] shrink-0 text-icon-primary"
                weight="fill"
              />
            ) : (
              <CircleIcon
                aria-hidden
                className={cn('size-[18px] shrink-0', invalid ? 'text-error' : 'text-medium')}
                weight="regular"
              />
            )}
            <Typography className={invalid ? 'text-error' : 'text-medium'} size="sm">
              {rule.label}
            </Typography>
          </li>
        );
      })}
    </ul>
  );
}
