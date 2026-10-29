import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Skeleton } from '@/shared/ui/skeleton';

export function SkeletonSection() {
  return (
    <ComponentSection
      description="Placeholder pulse blocks for loading states."
      id="skeleton"
      title="Skeleton"
    >
      <Example title="Shapes">
        <Skeleton className="size-[48px] rounded-full" />
        <Skeleton className="h-[20px] w-[180px]" />
        <Skeleton className="h-[96px] w-full max-w-[280px]" />
      </Example>
    </ComponentSection>
  );
}
