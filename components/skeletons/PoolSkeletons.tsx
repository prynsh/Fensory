import { Skeleton } from "@/components/ui/skeleton"
import { TableRow, TableCell } from "@/components/ui/table"
import { Card, CardHeader, CardContent } from "@mui/material"

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

export function PoolDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" /> 
      <div className="flex flex-wrap gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" /> 
            <Skeleton className="h-5 w-28" /> 
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" /> 
      <Skeleton className="h-[300px] w-full rounded-md" />
    </div>
  )
}