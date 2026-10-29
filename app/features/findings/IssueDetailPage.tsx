import { ArrowLeftIcon } from '@phosphor-icons/react/ArrowLeft';
import { BugIcon } from '@phosphor-icons/react/Bug';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { Link } from 'react-router';

import { projectPath, useProject } from '@/features/projects';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Typography } from '@/shared/ui/Typography';

import { FindingEvidence } from './components/evidence/FindingEvidence';
import { FindingSummaryTags } from './components/FindingSummaryTags';
import { useFindingDetail } from './hooks/useFindingDetail';

export function IssueDetailPage() {
  const project = useProject();
  const { error, finding, loading } = useFindingDetail();
  const issuesPath = projectPath(project.id, 'issues');

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <CircleNotchIcon
          aria-label="Loading issue"
          className="size-[24px] animate-spin text-icon-medium"
          weight="regular"
        />
      </div>
    );
  }

  if (error || !finding) {
    return (
      <EmptyState
        icon={<BugIcon aria-hidden weight="regular" />}
        subheading={error?.message || 'This issue may have been removed.'}
        title="Issue not found"
      >
        <Button asChild size="sm" variant="outline">
          <Link to={issuesPath}>Back to issues</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <div className="flex items-center gap-[12px]">
        <Button asChild size="icon-sm" variant="ghost">
          <Link aria-label="Back to issues" to={issuesPath}>
            <ArrowLeftIcon aria-hidden weight="regular" />
          </Link>
        </Button>
        <Typography as="h2" className="min-w-0 truncate" fontWeight="semibold" variant="h6">
          {finding.title}
        </Typography>
      </div>
      <FindingSummaryTags finding={finding} />
      <Card>
        <CardContent>
          <FindingEvidence finding={finding} />
        </CardContent>
      </Card>
    </>
  );
}
