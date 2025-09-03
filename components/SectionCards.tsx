// "use client"

// import { useEffect, useState } from "react"
// import { IconLock, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
// import Autoplay from "embla-carousel-autoplay"

// import { Badge } from "@/components/ui/badge"
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useWallet } from "@solana/wallet-adapter-react"

// const selectedPools = [
//   { id: "db678df9-3281-4bc2-a8bb-01160ffd6d48", category: "Lending" },
//   { id: "c1ca08e4-d618-415e-ad63-fcec58705469", category: "Lending" },
//   { id: "8edfdf02-cdbb-43f7-bca6-954e5fe56813", category: "Lending" },
//   { id: "747c1d2a-c668-4682-b9f9-296708a3dd90", category: "Liquid Staking" },
//   { id: "80b8bf92-b953-4c20-98ea-c9653ef2bb98", category: "Liquid Staking" },
//   { id: "90bfb3c2-5d35-4959-a275-ba5085b08aa3", category: "Liquid Staking" },
//   { id: "107fb915-ab29-475b-b526-d0ed0d3e6110", category: "Yield Aggregator" },
//   { id: "05a3d186-2d42-4e21-b1f0-68c079d22677", category: "Yield Aggregator" },
//   { id: "1977885c-d5ae-4c9e-b4df-863b7e1578e6", category: "Yield Aggregator" },
// ]


// export function SectionCards() {
//   const [pools, setPools] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//     const { connected } = useWallet()

//   useEffect(() => {
//     async function fetchPools() {
//       try {
//         const res = await fetch("https://yields.llama.fi/pools")
//         const data = await res.json()

//         const filtered = data.data
//   .filter((pool: any) => selectedPools.some(p => p.id === pool.pool))
//   .map((pool: any) => {
//     const meta = selectedPools.find(p => p.id === pool.pool)
//     return { ...pool, category: meta?.category }
//   })


//         setPools(filtered)
//       } catch (error) {
//         console.error("Error fetching pools:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPools()
//   }, [])

//   return (
//     <Carousel
//       plugins={[
//         Autoplay({
//           delay: 2500,
//           stopOnInteraction: false,
//         }),
//       ]}
//       opts={{ loop: true, align: "start" }}
//       className="w-full mx-auto"
//     >
//       <CarouselContent>
//         {loading
//           ? //These are the skeletons for when the data is loading
//             Array.from({ length: 4 }).map((_, i) => (
//               <CarouselItem
//                 key={i}
//                 className="basis-full md:basis-1/3 lg:basis-1/4"
//               >
//                 <Card className="h-48 flex flex-col justify-between cursor-pointer border p-4">
//                   <div className="space-y-3">
//                     <Skeleton className="h-4 w-12" />
//                     <Skeleton className="h-6 w-24" />
//                     <Skeleton className="h-5 w-16" />
//                   </div>
//                 </Card>
//               </CarouselItem>
//             ))
//           : // Data after loading
//             pools.map((pool) => {
//               const isYieldAggregator = pool.category === "Yield Aggregator"
//               return(
//               <CarouselItem
//                 key={pool.pool}
//                 className="basis-full md:basis-1/3 lg:basis-1/4"
//               >
//                 <Card className="h-48 flex flex-col justify-between cursor-pointe">
//                   {isYieldAggregator && !connected ? (
//                       // Locked view
//                       <div className="flex flex-col items-center justify-center">
//                         <IconLock className="w-10 h-10 text-muted-foreground mb-2" />
//                         <p className="text-sm font-medium text-muted-foreground text-center">
//                           Please add your wallet to unlock Yield Category 
//                         </p>
//                       </div>
//                     ) : (
//                       //Unlocked View when the users adds the wallet
//                   <CardHeader>
//                     <CardDescription>{pool.symbol}</CardDescription>
//                     <CardTitle className="text-xl font-semibold">
//                       {pool.project.toUpperCase()}
//                     </CardTitle>
//                     <CardAction>
//                       <Badge variant="default" className="flex items-center gap-1 text-white">
//                         {pool.apy > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
//                         {pool.apy ? `${pool.apy.toFixed(2)}%` : "N/A"}
//                       </Badge>
//                     </CardAction>
//                   </CardHeader>
//                     )}
//                 </Card>
//               </CarouselItem>
//             )
//           })}
//       </CarouselContent>
//     </Carousel>
//   )
// }


"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { IconLock, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import Autoplay from "embla-carousel-autoplay"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { PoolCardSkeleton } from "./skeletons/PoolSkeletons"
import { usePools } from "@/hooks/usePool"

export function SectionCards() {
  const { pools, loading } = usePools()
  const { connected } = useWallet()

  return (
    <Carousel
      plugins={[Autoplay({ delay: 2500, stopOnInteraction: false })]}
      opts={{ loop: true, align: "start" }}
      className="w-full mx-auto"
    >
      <CarouselContent>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem key={i} className="basis-full md:basis-1/3 lg:basis-1/4">
                <PoolCardSkeleton />
              </CarouselItem>
            ))
          : pools.map(pool => {
              const isLocked = pool.category === "Yield Aggregator" && !connected
              return (
                <CarouselItem key={pool.pool} className="basis-full md:basis-1/3 lg:basis-1/4">
                  <Card className="h-48 flex flex-col justify-between cursor-pointer">
                    {isLocked ? (
                      <div className="flex flex-col items-center justify-center p-4">
                        <IconLock className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground text-center">
                          Please add your wallet to unlock Yield Category
                        </p>
                      </div>
                    ) : (
                      <CardHeader>
                        <CardDescription>{pool.symbol}</CardDescription>
                        <CardTitle>{pool.project.toUpperCase()}</CardTitle>
                        <CardAction>
                          <Badge variant="default" className="flex items-center gap-1 text-white">
                            {pool.apy && pool.apy > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                            {pool.apy ? `${pool.apy.toFixed(2)}%` : "N/A"}
                          </Badge>
                        </CardAction>
                      </CardHeader>
                    )}
                  </Card>
                </CarouselItem>
              )
            })}
      </CarouselContent>
    </Carousel>
  )
}
