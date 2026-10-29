import type { Finding } from '../../types';
import { BackendSections } from './BackendSections';
import {
  ContextSections,
  HistorySection,
  ScreenshotSection,
  StepsSection,
} from './ContextSections';
import { ErrorSections } from './ErrorSections';
import { PerformanceSections } from './PerformanceSections';

/** Everything a run collected for one finding, from the steps to the evidence behind it. */
export function FindingEvidence({ finding }: { finding: Finding }) {
  const details = finding.details ?? {};

  return (
    <div className="flex flex-col gap-[20px]">
      <HistorySection finding={finding} />
      <StepsSection steps={finding.reproSteps} />
      <ContextSections details={details} />
      <ErrorSections details={details} />
      <BackendSections details={details} />
      <PerformanceSections details={details} />
      <ScreenshotSection url={finding.screenshotUrl} />
    </div>
  );
}
