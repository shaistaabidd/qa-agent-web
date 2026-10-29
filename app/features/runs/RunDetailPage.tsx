import { ArrowLeftIcon } from '@phosphor-icons/react/ArrowLeft';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { PlayIcon } from '@phosphor-icons/react/Play';
import { useState } from 'react';
import { Link } from 'react-router';

import { FindingsList } from '@/features/findings';
import { projectPath, useProject } from '@/features/projects';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { TabItem, Tabs } from '@/shared/ui/tabs';
import { Typography } from '@/shared/ui/Typography';

import { RunApiLogPanel } from './components/RunApiLogPanel';
import { RunAuditPanel } from './components/RunAuditPanel';
import { RunEndpointsPanel } from './components/RunEndpointsPanel';
import { RunMemoryPanel } from './components/RunMemoryPanel';
import { RunStatusTag } from './components/RunStatusTag';
import { RunSummaryTiles } from './components/RunSummaryTiles';
import { RUN_DETAIL_TABS, type RunDetailTab } from './constants';
import { useRunDetail } from './hooks/useRunDetail';
import { runTabCounts } from './utils';

export function RunDetailPage() {
  const project = useProject();
  const { error, loading, run } = useRunDetail();
  const [tab, setTab] = useState<RunDetailTab>('findings');
  const runsPath = projectPath(project.id, 'runs');

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <CircleNotchIcon
          aria-label="Loading run"
          className="size-[24px] animate-spin text-icon-medium"
          weight="regular"
        />
      </div>
    );
  }

  if (error || !run) {
    return (
      <EmptyState
        icon={<PlayIcon aria-hidden weight="regular" />}
        subheading={error?.message || 'This run may have been removed.'}
        title="Run not found"
      >
        <Button asChild size="sm" variant="outline">
          <Link to={runsPath}>Back to runs</Link>
        </Button>
      </EmptyState>
    );
  }

  const counts = runTabCounts(run.summary, run.networkLog);
  const tabBadges: Partial<Record<RunDetailTab, number>> = {
    'api-log': counts.problemCalls,
    endpoints: counts.slowEndpoints,
    findings: counts.findings,
    memory: counts.memoryIssues,
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-[12px]">
        <Button asChild size="icon-sm" variant="ghost">
          <Link aria-label="Back to runs" to={runsPath}>
            <ArrowLeftIcon aria-hidden weight="regular" />
          </Link>
        </Button>
        <Typography as="h2" fontWeight="semibold" variant="h6">
          {run.scopeFeature.name}
        </Typography>
        <Typography as="span" className="text-fg-secondary" variant="body3">
          as {run.roleName}
        </Typography>
        <RunStatusTag status={run.status} />
      </div>
      <RunSummaryTiles networkLog={run.networkLog} summary={run.summary} />
      <Tabs
        aria-label="Run details"
        onValueChange={(value) => setTab(value as RunDetailTab)}
        value={tab}
      >
        {RUN_DETAIL_TABS.map((item) => (
          <TabItem
            badge={tabBadges[item.value] ? tabBadges[item.value] : undefined}
            key={item.value}
            value={item.value}
          >
            {item.label}
          </TabItem>
        ))}
      </Tabs>
      {tab === 'findings' ? <FindingsList projectId={project.id} runId={run.id} /> : null}
      {tab === 'endpoints' ? <RunEndpointsPanel summary={run.summary} /> : null}
      {tab === 'api-log' ? <RunApiLogPanel networkLog={run.networkLog} /> : null}
      {tab === 'memory' ? (
        <RunMemoryPanel networkLog={run.networkLog} summary={run.summary} />
      ) : null}
      {tab === 'audit' ? <RunAuditPanel entries={run.auditLogEntries} /> : null}
    </>
  );
}
