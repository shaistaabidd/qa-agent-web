import { Card, CardContent, CardHeader, CardHeaderText, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

import type { Coverage } from '../types';

export function CoverageCard({ coverage, error }: { coverage: Coverage | null; error?: Error }) {
  return (
    <Card>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Coverage</CardTitle>
        </CardHeaderText>
      </CardHeader>
      <CardContent className="flex flex-col gap-[12px]">
        {error ? <p className="text-error">{error.message || 'Unable to load coverage.'}</p> : null}
        {coverage ? (
          <>
            <Progress
              aria-label="Coverage of approved scope features"
              value={coverage.coveragePercentage}
              valueLabel={`${coverage.coveragePercentage}%`}
            />
            <p className="text-fg-secondary">
              {coverage.testedScopeFeatures} of {coverage.approvedScopeFeatures} approved features
              tested ({coverage.totalScopeFeatures} total in scope)
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
