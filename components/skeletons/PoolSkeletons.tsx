import { Skeleton } from "@/components/ui/skeleton"
import { TableRow, TableCell } from "@/components/ui/table"

export function PoolCardSkeleton() {
  return (
    <div className="h-48 flex flex-col justify-between border p-4 rounded-xl">
      <div className="space-y-3">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  )
}

export function PoolTableSkeletonRow() {
  return (
    <TableRow>
      {[24, 20, 16, 20, 16, 16, 12, 16].map((w, i) => (
        <TableCell key={i} className="text-right">
          <Skeleton className={`h-4 w-${w} ml-auto`} />
        </TableCell>
      ))}
    </TableRow>
  )
}
