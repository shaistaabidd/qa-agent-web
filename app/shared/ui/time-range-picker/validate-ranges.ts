export type TimeRange = { end: string; id?: string; start: string };

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

const DEFAULT_RANGE: TimeRange = { start: '09:00', end: '17:00' };

/** Next range that starts when the latest one ends, keeping that same length. */
export function nextAvailableRange(
  ranges: TimeRange[],
  options: { value: string }[],
): TimeRange | null {
  if (ranges.length === 0) return DEFAULT_RANGE;

  const latest = ranges.reduce((best, range) =>
    toMinutes(range.end) > toMinutes(best.end) ? range : best,
  );
  const span = toMinutes(latest.end) - toMinutes(latest.start);
  const start = options.find((option) => toMinutes(option.value) >= toMinutes(latest.end))?.value;
  if (!start || span <= 0) return null;

  const target = toMinutes(start) + span;
  let end: string | undefined;
  for (const option of options) {
    const minutes = toMinutes(option.value);
    if (minutes <= toMinutes(start)) continue;
    end = option.value;
    if (minutes >= target) break;
  }

  return end ? { start, end } : null;
}

export function findOverlappingRanges(ranges: TimeRange[]): [number, number][] {
  const pairs: [number, number][] = [];
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const a = ranges[i];
      const b = ranges[j];
      const aStart = toMinutes(a.start);
      const aEnd = toMinutes(a.end);
      const bStart = toMinutes(b.start);
      const bEnd = toMinutes(b.end);
      if (aStart < bEnd && bStart < aEnd) {
        pairs.push([i, j]);
      }
    }
  }
  return pairs;
}
