import { useState } from 'react';

import { getMessageString } from '@/shared/lib/getMessageString';
import { Switch } from '@/shared/ui/switch';
import { toast } from '@/shared/ui/toast';

type ResourceAccessSwitchProps = {
  checked: boolean;
  label: string;
  onChange: (isActive: boolean) => Promise<void>;
};

export function ResourceAccessSwitch({ checked, label, onChange }: ResourceAccessSwitchProps) {
  const [value, setValue] = useState(checked);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: boolean) {
    setValue(next);
    setSaving(true);
    try {
      await onChange(next);
      toast.success('Resource access updated');
    } catch (error) {
      setValue(!next);
      toast.error(getMessageString(error, 'Something went wrong. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Switch
      aria-label={`Access for ${label}`}
      checked={value}
      disabled={saving}
      onCheckedChange={(next) => void handleChange(next)}
    />
  );
}
