import { CrudScreenDemo } from '@/features/design-system/components/sections/crud';
import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';

export function CrudPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
      >
        <CrudScreenDemo />
      </div>
    </div>
  );
}
