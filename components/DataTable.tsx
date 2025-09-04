"use client"
import { useWallet } from "@solana/wallet-adapter-react"
import { IconLock } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table"
import { Pool, usePools } from "@/hooks/usePool"
import { PoolTableSkeletonRow } from "./skeletons/PoolSkeletons"
import Chips from "./Filters"

export function DataTable() {
  const { pools, loading } = usePools()
  const categories = ["Lending", "Liquid Staking", "Yield Aggregator"]

  return (
    <>
    <Chips categories={categories} pools={pools} loading={loading}/>
  </>
  )
}

export function PoolTable({ pools, loading }: { pools: Pool[]; loading: boolean }) {
  const { connected } = useWallet()
  const router = useRouter()
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">TVL (USD)</TableHead>
          <TableHead className="text-right">APY %</TableHead>
          <TableHead className="text-right">Prediction</TableHead>
          <TableHead className="text-right">Sigma</TableHead>
          <TableHead className="text-right">APYMean (30d)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading &&
          Array.from({ length: 8 }).map((_, i) => <PoolTableSkeletonRow key={i} />)}

        {!loading &&
          pools.map(pool => {
            const isLocked = pool.category === "Yield Aggregator" && !connected
            return (
              <TableRow
                key={pool.pool}
                className={`cursor-pointer hover:bg-muted/50 ${isLocked ? "opacity-70" : ""}`}
                onClick={() => !isLocked && router.push(`/pool/${pool.pool}`)}
              >
                {isLocked ? (
                  <TableCell colSpan={8} className="text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <IconLock className="w-4 h-4" />
                      <span>Please add your wallet to unlock Yield Aggregator Pools</span>
                    </div>
                  </TableCell>
                ) : (
                  <>
                    <TableCell className="font-medium py-5">
                      <Link href={`/pool/${pool.pool}`}>{pool.project}</Link>
                    </TableCell>
                    <TableCell>{pool.category}</TableCell>
                    <TableCell>{pool.symbol}</TableCell>
                    <TableCell className="text-right">${pool.tvlUsd.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{pool.apy ?? "—"}%</TableCell>
                    <TableCell className="text-right">{pool.prediction ?? "—"}</TableCell>
                    <TableCell className="text-right">{pool.sigma ?? "—"}</TableCell>
                    <TableCell className="text-right">{pool.apyMean30d ?? "—"}%</TableCell>
                  </>
                )}
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
