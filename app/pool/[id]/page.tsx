"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

interface PoolDetails {
  pool: string
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apy: number | null
  prediction: number | null
  sigma: number | null
  apyMean30d: number | null
}

interface ChartDataPoint {
  month: string
  apy: number
  date: string
}

interface ApiDataPoint {
  timestamp: string
  tvlUsd: number
  apy: number
}

const chartConfig = {
  apy: {
    label: "APY %",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function PoolDetailPage() {
  const params = useParams()
  const poolId = params?.id as string

//States for all the details
  const [poolDetails, setPoolDetails] = useState<PoolDetails | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!poolId) return

    const fetchPoolData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch both details + historical APY in parallel using Promise.all instead of one after the other
        const [poolRes, chartRes] = await Promise.all([
          fetch("https://yields.llama.fi/pools"),
          fetch(`https://yields.llama.fi/chart/${poolId}`),
        ])

        if (!poolRes.ok || !chartRes.ok) {
          throw new Error("Failed to fetch pool data")
        }

        const poolJson = await poolRes.json()
        const chartJson: { status: string; data: ApiDataPoint[] } = await chartRes.json()

        // Find the pool with matching ID with the pool fetched from API
        const pool = poolJson.data.find((p: any) => p.pool === poolId)
        if (!pool) throw new Error("Pool not found")

        // Store pool details in state
        setPoolDetails({
          pool: pool.pool,
          chain: pool.chain,
          project: pool.project,
          symbol: pool.symbol,
          tvlUsd: pool.tvlUsd,
          apy: pool.apy,
          prediction: pool.predictions?.predictedProbability ?? null,
          sigma: pool.sigma ?? null,
          apyMean30d: pool.apyMean30d ?? null,
        })

        // Extracting APY history for the last 12 months
        if (!chartJson.data?.length) throw new Error("No APY history available")
        setChartData(extractMonthlyAPY(chartJson.data))
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPoolData()
  }, [poolId])


// Extracts one APY value for each of the past 12 months and picking the closest APY value to the 1st day of month.
  const extractMonthlyAPY = (apiData: ApiDataPoint[]): ChartDataPoint[] => {
    const sortedData = [...apiData].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    const monthlyData: ChartDataPoint[] = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const targetTimestamp = targetDate.getTime()

      // Find the data point closest to the 1st of the month
      let closestPoint = sortedData[0]
      let minDiff = Math.abs(new Date(closestPoint.timestamp).getTime() - targetTimestamp)

      for (const point of sortedData) {
        const pointTimestamp = new Date(point.timestamp).getTime()
        const diff = Math.abs(pointTimestamp - targetTimestamp)

        if (diff < minDiff) {
          minDiff = diff
          closestPoint = point
        }

        // Stop looking if we're too far ahead (>7 days past)
        if (pointTimestamp > targetTimestamp + 7 * 24 * 60 * 60 * 1000) break
      }

      // Push formatted result
      monthlyData.push({
        month: targetDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        apy: Math.round(closestPoint.apy * 100) / 100, // rounding of here to 2 decimals
        date: targetDate.toLocaleDateString(),
      })
    }

    return monthlyData
  }


// Calculate APY trend over the last 12 months Positive = growth, Negative = decline
  const trendPercentage = useMemo(() => {
    if (chartData.length < 2) return 0
    const first = chartData[0].apy
    const last = chartData[chartData.length - 1].apy
    return ((last - first) / first) * 100
  }, [chartData])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading pool details...
        </div>
      </div>
    )
  }

  if (error || !poolDetails) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64 text-center">
          <div className="text-red-500 mb-4">{error || "Pool not found"}</div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pools
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="default" size="sm" className="items-center text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Pool Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poolDetails.project}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-8">
            {[
              { label: "Symbol", value: poolDetails.symbol },
              { label: "TVL (USD)", value: `$${poolDetails.tvlUsd.toLocaleString()}` },
              { label: "APY", value: poolDetails.apy?.toFixed(2) + "%" },
              { label: "Prediction", value: poolDetails.prediction?.toFixed(2) + "%" },
              { label: "Sigma", value: poolDetails.sigma?.toFixed(2) + "%" },
              { label: "30d APY Mean", value: poolDetails.apyMean30d?.toFixed(2) + "%" },
              { label: "Trend (12m)", value: `${trendPercentage.toFixed(2)}%` },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-lg font-semibold">{value ?? "—"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* APY History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>APY History</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No chart data
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="w-[200px]"
                      hideLabel={false}
                      formatter={(value) => [`${value}%`, "APY"]}
                      labelFormatter={(label) => {
                        const point = chartData.find((d) => d.month === label)
                        return point?.date ?? label
                      }}
                    />
                  }
                />
                <Line
                  dataKey="apy"
                  type="monotone"
                  stroke="var(--color-apy)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-apy)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
