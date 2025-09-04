import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton, PoolDetailsSkeleton } from "@/components/skeletons/PoolSkeletons";

export function LoadingState() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
      <PoolDetailsSkeleton />
      <ChartSkeleton />
    </div>
  );
}