import { useCanManage, useProject } from '@/features/projects';
import { Pagination } from '@/shared/ui/pagination';

import { ScopeFeaturesTable } from './components/ScopeFeaturesTable';
import { useApproveScopeFeature } from './hooks/useApproveScopeFeature';
import { useScopeFeatures } from './hooks/useScopeFeatures';

export function ScopeFeaturesPage() {
  const project = useProject();
  const canManage = useCanManage(project);
  const features = useScopeFeatures(project.id);
  const { approve, approvingId } = useApproveScopeFeature();

  if (features.error) {
    return (
      <p className="text-error">{features.error.message || 'Unable to load scope features.'}</p>
    );
  }

  return (
    <>
      <ScopeFeaturesTable
        approvingId={approvingId}
        canApprove={canManage}
        features={features.features}
        loading={features.loading}
        onApprove={(id) => void approve(id)}
      />
      <Pagination
        itemLabel="features"
        onPageChange={(next) => void features.setPage(next)}
        page={features.page}
        pageCount={features.totalPages}
        showingFrom={features.showingFrom}
        showingTo={features.showingTo}
        total={features.count}
      />
    </>
  );
}
