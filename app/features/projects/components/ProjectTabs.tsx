import { useLocation, useNavigate } from 'react-router';

import { TabItem, Tabs } from '@/shared/ui/tabs';

import { PROJECT_TABS, projectPath, type ProjectTabValue } from '../constants';
import { useOpenIssueCount } from '../hooks/useOpenIssueCount';

function activeTab(pathname: string, projectId: string): ProjectTabValue {
  const rest = pathname.replace(projectPath(projectId), '').replace(/^\//, '');
  const match = PROJECT_TABS.find(
    (tab) => tab.path && (rest === tab.path || rest.startsWith(`${tab.path}/`)),
  );

  return match?.value ?? 'overview';
}

export function ProjectTabs({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const openIssues = useOpenIssueCount(projectId);

  return (
    <Tabs
      aria-label="Project sections"
      onValueChange={(value) => {
        const tab = PROJECT_TABS.find((item) => item.value === value);
        if (tab) {
          navigate(projectPath(projectId, tab.path));
        }
      }}
      value={activeTab(pathname, projectId)}
    >
      {PROJECT_TABS.map((tab) => (
        <TabItem
          badge={tab.value === 'issues' && openIssues > 0 ? openIssues : undefined}
          key={tab.value}
          value={tab.value}
        >
          {tab.label}
        </TabItem>
      ))}
    </Tabs>
  );
}
