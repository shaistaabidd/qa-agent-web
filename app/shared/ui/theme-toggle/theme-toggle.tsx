import type { ThemePreference } from '@/shared/lib/theme';
import { useThemePreference } from '@/shared/lib/theme';
import { Segmented, SegmentedItem } from '@/shared/ui/segmented';

const OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function ThemeToggle() {
  const [preference, setPreference] = useThemePreference();

  return (
    <Segmented
      aria-label="Theme"
      value={preference}
      onValueChange={(value) => setPreference(value as ThemePreference)}
    >
      {OPTIONS.map((option) => (
        <SegmentedItem key={option.value} value={option.value}>
          {option.label}
        </SegmentedItem>
      ))}
    </Segmented>
  );
}
