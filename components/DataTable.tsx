// "use client"
// import React, { useEffect, useState } from "react"
// import Link from "next/link"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
// import {
//     Tabs,
//     TabsContent,
//     TabsList,
//     TabsTrigger,
// } from "@/components/ui/tabs"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useWallet } from "@solana/wallet-adapter-react" //
// import { IconLock } from "@tabler/icons-react"
// import { useRouter } from "next/navigation"

// interface Pool {
//     pool: string
//     project: string
//     category: string
//     symbol: string
//     tvlUsd: number
//     apy: number | null
//     prediction?: number | null
//     sigma?: number | null
//     apyMean30d?: number | null
//     url?: string
// }

// const ALLOWED_POOLS: { id: string; category: string }[] = [
//     { id: "db678df9-3281-4bc2-a8bb-01160ffd6d48", category: "Lending" },
//     { id: "c1ca08e4-d618-415e-ad63-fcec58705469", category: "Lending" },
//     { id: "8edfdf02-cdbb-43f7-bca6-954e5fe56813", category: "Lending" },
//     { id: "747c1d2a-c668-4682-b9f9-296708a3dd90", category: "Liquid Staking" },
//     { id: "80b8bf92-b953-4c20-98ea-c9653ef2bb98", category: "Liquid Staking" },
//     { id: "90bfb3c2-5d35-4959-a275-ba5085b08aa3", category: "Liquid Staking" },
//     { id: "107fb915-ab29-475b-b526-d0ed0d3e6110", category: "Yield Aggregator" },
//     { id: "05a3d186-2d42-4e21-b1f0-68c079d22677", category: "Yield Aggregator" },
//     { id: "1977885c-d5ae-4c9e-b4df-863b7e1578e6", category: "Yield Aggregator" },
// ]

// export function TableDemo() {
//     const [pools, setPools] = useState<Pool[]>([])
//     const [filteredPools, setFilteredPools] = useState<Pool[]>([])
//     const [loading, setLoading] = useState(true)
//     const { connected } = useWallet()
    

//     useEffect(() => {
//         const fetchPools = async () => {
//             try {
//                 const res = await fetch("https://yields.llama.fi/pools")
//                 const data = await res.json()

//                 let mappedData: Pool[] = data.data
//                     .filter((poolData: any) =>
//                         ALLOWED_POOLS.some((allowed) => allowed.id === poolData.pool)
//                     )
//                     .map((poolData: any) => {
//                         const matched = ALLOWED_POOLS.find((p) => p.id === poolData.pool)
//                         return {
//                             pool: poolData.pool,
//                             project: poolData.project,
//                             category: matched?.category ?? poolData.category,
//                             symbol: poolData.symbol,
//                             tvlUsd: poolData.tvlUsd,
//                             apy: poolData.apy,
//                             prediction: poolData.predictions?.predictedProbability ?? null,
//                             sigma: poolData.sigma ?? null,
//                             apyMean30d: poolData.apyMean30d ?? null,
//                         }
//                     })

//                 setPools(mappedData)
//                 setFilteredPools(mappedData)
//             } catch (error) {
//                 console.error("Error fetching pools:", error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchPools()
//     }, [connected])

//     const handleCategoryChange = (category: string) => {
//         if (category === "all") {
//             setFilteredPools(pools)
//         } else {
//             setFilteredPools(pools.filter((p) => p.category === category))
//         }
//     }

//     return (
//         <div className="space-y-4">
//             <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
//                 <TabsList>
//                     <TabsTrigger value="all">All</TabsTrigger>
//                     <TabsTrigger value="Lending">Lending</TabsTrigger>
//                     <TabsTrigger value="Liquid Staking">Liquid Staking</TabsTrigger>
//                     <TabsTrigger value="Yield Aggregator">
//                         Yield Aggregator
//                     </TabsTrigger>

//                 </TabsList>

//                 <TabsContent value="all">
//                     <PoolTable pools={filteredPools} loading={loading} />
//                 </TabsContent>
//                 <TabsContent value="Lending">
//                     <PoolTable pools={filteredPools} loading={loading} />
//                 </TabsContent>
//                 <TabsContent value="Liquid Staking">
//                     <PoolTable pools={filteredPools} loading={loading} />
//                 </TabsContent>
//                 <TabsContent value="Yield Aggregator">
//                     {connected ? (
//                         <PoolTable
//                             pools={pools.filter((p) => p.category === "Yield Aggregator")}
//                             loading={loading}
//                         />
//                     ) : (
//                         <div className="flex flex-col items-center justify-center p-10 border rounded-2xl bg-muted/40">
//                             <IconLock className="w-10 h-10 text-muted-foreground mb-4" />
//                             <p className="text-lg font-medium text-muted-foreground">
//                                 Add your wallet to view Yield Aggregator pools
//                             </p>
//                         </div>
//                     )}
//                 </TabsContent>
//             </Tabs>
//         </div>
//     )
// }

// function PoolTable({ pools, loading }: { pools: Pool[]; loading: boolean }) {
//     const { connected } = useWallet()
//     const router = useRouter() 

//     return (
//         <Table>
//             <TableHeader>
//                 <TableRow>
//                     <TableHead>Project</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Symbol</TableHead>
//                     <TableHead className="text-right">TVL (USD)</TableHead>
//                     <TableHead className="text-right">APY %</TableHead>
//                     <TableHead className="text-right">Prediction</TableHead>
//                     <TableHead className="text-right">Sigma</TableHead>
//                     <TableHead className="text-right">APYMean (30d)</TableHead>
//                 </TableRow>
//             </TableHeader>
//             <TableBody>
//                 {/* 🔹 Skeleton Rows */}
//                 {loading &&
//                     Array.from({ length: 8 }).map((_, i) => (
//                         <TableRow key={i}>
//                             <TableCell>
//                                 <Skeleton className="h-4 w-24" />
//                             </TableCell>
//                             <TableCell>
//                                 <Skeleton className="h-4 w-20" />
//                             </TableCell>
//                             <TableCell>
//                                 <Skeleton className="h-4 w-16" />
//                             </TableCell>
//                             <TableCell className="text-right">
//                                 <Skeleton className="h-4 w-20 ml-auto" />
//                             </TableCell>
//                             <TableCell className="text-right">
//                                 <Skeleton className="h-4 w-16 ml-auto" />
//                             </TableCell>
//                             <TableCell className="text-right">
//                                 <Skeleton className="h-4 w-16 ml-auto" />
//                             </TableCell>
//                             <TableCell className="text-right">
//                                 <Skeleton className="h-4 w-12 ml-auto" />
//                             </TableCell>
//                             <TableCell className="text-right">
//                                 <Skeleton className="h-4 w-16 ml-auto" />
//                             </TableCell>
//                         </TableRow>
//                     ))}

//                 {/* 🔹 Real / Locked Rows */}
//                 {!loading &&
//                     pools.map((pool) => {
//                         const isLocked = pool.category === "Yield Aggregator" && !connected

//                         return (
//                             <TableRow
//                                 key={pool.pool}
//                                 className={`cursor-pointer hover:bg-muted/50 ${isLocked ? "opacity-70" : ""
//                                     }`}
//                                     onClick={() => {
//                   if (!isLocked) router.push(`/pool/${pool.pool}`)
//                 }}
//                             >
//                                 {/* Project column */}
//                                 <TableCell className="font-medium">
//                                     {isLocked ? (
//                                         <div className="flex items-center gap-2 text-muted-foreground">
//                                             <IconLock className="w-4 h-4" />
//                                         </div>
//                                     ) : (
//                                         <Link href={`/pool/${pool.pool}`}>{pool.project}</Link>
//                                     )}
//                                 </TableCell>

//                                 {/* All other columns */}
//                                 {isLocked ? (
//                                     <>
//                                         <TableCell colSpan={7} className="text-center">
//                                             <div className="flex items-center justify-center gap-2 text-muted-foreground">
//                                                 <IconLock className="w-4 h-4" />
//                                                 <span>Please add your wallet to unlock Yield Aggregator Pools</span>
//                                             </div>
//                                         </TableCell>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <TableCell>{pool.category}</TableCell>
//                                         <TableCell>{pool.symbol}</TableCell>
//                                         <TableCell className="text-right">
//                                             ${pool.tvlUsd.toLocaleString()}
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             {pool.apy !== null ? `${pool.apy}%` : "—"}
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             {pool.prediction !== null ? `${pool.prediction}%` : "—"}
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             {pool.sigma !== null ? pool.sigma : "—"}
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             {pool.apyMean30d !== null ? `${pool.apyMean30d}%` : "—"}
//                                         </TableCell>
//                                     </>
//                                 )}
//                             </TableRow>
//                         )
//                     })}
//             </TableBody>
//         </Table>
//     )
// }


"use client"
import { useWallet } from "@solana/wallet-adapter-react"
import { IconLock } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table"
import { Pool, usePools } from "@/hooks/usePool"
import { PoolTableSkeletonRow } from "./skeletons/PoolSkeletons"

export function DataTable() {
  const { pools, loading } = usePools()
  const { connected } = useWallet()
  const categories = ["all", "Lending", "Liquid Staking", "Yield Aggregator"]

  return (
    <Tabs defaultValue="all">
      <TabsList>
        {categories.map(c => (
          <TabsTrigger key={c} value={c}>
            {c}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map(c => (
        <TabsContent key={c} value={c}>
          {c === "Yield Aggregator" && !connected ? (
            <div className="flex flex-col items-center justify-center p-10 border rounded-2xl bg-muted/40">
              <IconLock className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Add your wallet to view Yield Aggregator pools
              </p>
            </div>
          ) : (
            <PoolTable
              pools={c === "all" ? pools : pools.filter(p => p.category === c)}
              loading={loading}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

function PoolTable({ pools, loading }: { pools: Pool[]; loading: boolean }) {
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
                    <TableCell className="font-medium">
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
