"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { IconLock, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import Autoplay from "embla-carousel-autoplay"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { PoolCardSkeleton } from "./skeletons/PoolSkeletons"
import { Pool } from "@/types/pool"

interface SectionCardsProps {
  pools: Pool[];
  loading: boolean;
}

export function SectionCards({ pools, loading }: SectionCardsProps) {
  const { connected } = useWallet();

  if (loading) {
    return (
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {Array.from({ length: 4 }).map((_, i) => (
            <CarouselItem key={i} className="basis-full md:basis-1/3 lg:basis-1/4">
              <PoolCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }

  return (
    <Carousel
      plugins={[Autoplay({ delay: 2500, stopOnInteraction: false })]}
      opts={{ loop: true, align: "start" }}
      className="w-full mx-auto"
    >
      <CarouselContent>
        {pools.map(pool => {
          const isYieldAggregator = pool.category === "Yield Aggregator";
          const isLocked = isYieldAggregator && !connected;
          
          return (
            <CarouselItem key={pool.pool} className="basis-full md:basis-1/3 lg:basis-1/4">
              <Card className="h-48 text-black flex flex-col justify-between cursor-pointer bg-[#bfddf8]">
                {isLocked ? (
                  <LockedPoolCard />
                ) : (
                  <PoolCard pool={pool} />
                )}
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

function LockedPoolCard() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <IconLock className="w-10 h-10 text-black mb-2" />
      <p className="text-sm font-medium text-center text-black">
        Please add your wallet to unlock Yield Category
      </p>
    </div>
  );
}

function PoolCard({ pool }: { pool: Pool }) {
  const hasPositiveApy = pool.apy && pool.apy > 0;
  
  return (
    <CardHeader className="text-black">
      <CardDescription className="text-black">{pool.symbol}</CardDescription>
      <CardTitle>{pool.project.toUpperCase()}</CardTitle>
      <CardAction>
        <Badge variant="default" className="flex items-center gap-1">
          {hasPositiveApy ? <IconTrendingUp /> : <IconTrendingDown />}
          {pool.apy ? `${pool.apy.toFixed(2)}%` : "N/A"}
        </Badge>
      </CardAction>
    </CardHeader>
  );
}