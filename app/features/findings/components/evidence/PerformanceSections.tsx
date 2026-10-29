import type { FindingDetails } from '../../types';
import { EvidenceSection, Facts } from './primitives';

function PagePerformance({ details }: { details: FindingDetails }) {
  const { metrics } = details;
  if (!metrics) {
    return null;
  }

  return (
    <EvidenceSection title="Page performance">
      <Facts
        items={[
          ['TTFB', `${metrics.ttfbMs ?? '—'} ms`],
          ['DOM ready', `${metrics.domContentLoadedMs ?? '—'} ms`],
          ['LCP', `${metrics.lcpMs ?? '—'} ms`],
          ['CLS', metrics.cls],
          ['Long tasks', `${metrics.longTaskMs} ms`],
        ]}
      />
    </EvidenceSection>
  );
}

function BrowserMemory({ details }: { details: FindingDetails }) {
  const { memory, memoryAfter, memoryBefore } = details;
  if (!memoryBefore && !memory) {
    return null;
  }

  const items: [string, string | number | undefined][] =
    memoryBefore && memoryAfter
      ? [
          ['JS heap', `${memoryBefore.heapMb} → ${memoryAfter.heapMb} MB`],
          ['DOM nodes', `${memoryBefore.nodes} → ${memoryAfter.nodes}`],
          ['Listeners', `${memoryBefore.listeners} → ${memoryAfter.listeners}`],
        ]
      : [
          ['JS heap', `${memory?.heapMb} MB`],
          ['DOM nodes', memory?.nodes],
          ['Listeners', memory?.listeners],
        ];

  return (
    <EvidenceSection title="Browser memory (after garbage collection)">
      <Facts items={items} />
    </EvidenceSection>
  );
}

export function PerformanceSections({ details }: { details: FindingDetails }) {
  return (
    <>
      <PagePerformance details={details} />
      <BrowserMemory details={details} />
    </>
  );
}
