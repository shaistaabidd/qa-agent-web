import { EyeIcon } from '@phosphor-icons/react/Eye';
import { EyeSlashIcon } from '@phosphor-icons/react/EyeSlash';

import { Button } from '@/shared/ui/button';

type PasswordToggleProps = {
  onToggle: () => void;
  visible: boolean;
};

export function PasswordToggle({ onToggle, visible }: PasswordToggleProps) {
  return (
    <Button
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      onClick={onToggle}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      {visible ? (
        <EyeSlashIcon aria-hidden weight="regular" />
      ) : (
        <EyeIcon aria-hidden weight="regular" />
      )}
    </Button>
  );
}
