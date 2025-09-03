import { useEffect, useState } from "react"
import { ALLOWED_POOLS } from "@/constants/constant"

export interface Pool {
  pool: string
  project: string
  category: string
  symbol: string
  tvlUsd: number
  apy: number | null
  prediction?: number | null
  sigma?: number | null
  apyMean30d?: number | null
}

export function usePools() {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const res = await fetch("https://yields.llama.fi/pools")
        const data = await res.json()

        const mapped: Pool[] = data.data
          .filter((p: any) => ALLOWED_POOLS.some(a => a.id === p.pool))
          .map((p: any) => {
            const matched = ALLOWED_POOLS.find(a => a.id === p.pool)
            return {
              pool: p.pool,
              project: p.project,
              category: matched?.category ?? p.category,
              symbol: p.symbol,
              tvlUsd: p.tvlUsd,
              apy: p.apy,
              prediction: p.predictions?.predictedProbability ?? null,
              sigma: p.sigma ?? null,
              apyMean30d: p.apyMean30d ?? null,
            }
          })

        setPools(mapped)
      } catch (err) {
        console.error("Error fetching pools:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPools()
  }, [])

  return { pools, loading }
}
