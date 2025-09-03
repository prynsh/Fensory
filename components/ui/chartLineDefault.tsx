"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { useMemo } from "react"

const chartConfig = {
  apy: {
    label: "APY (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface ApiDataPoint {
  timestamp: string
  apy: number
  tvlUsd: number
  apyBase: number
  apyReward: number
}

interface ChartDataPoint {
  month: string
  apy: number
}

export function ChartLineDefault({ data }: { data: ApiDataPoint[] }) {
  // Process data to get first day of each month for last 12 months
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return []

    const byMonth: Record<string, ChartDataPoint> = {}

    // Filter and process data
    const validData = data
      .map((d) => ({
        ...d,
        timestamp: Number(d.timestamp),
        apy: Number(d.apy) || 0,
      }))
      .filter((d) => !isNaN(d.timestamp) && d.timestamp > 0)
      .sort((a, b) => a.timestamp - b.timestamp)

    // Group by month and pick first available day of each month
    for (const d of validData) {
      const date = new Date(d.timestamp * 1000)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`
      
      // Pick the first available data point for each month
      if (!byMonth[monthKey]) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const year = date.getFullYear().toString().slice(-2)
        
        byMonth[monthKey] = {
          month: `${monthNames[date.getMonth()]} ${year}`,
          apy: d.apy,
        }
      }
    }

    // Get last 12 months of data
    return Object.values(byMonth)
      .sort((a, b) => {
        const dateA = new Date(a.month + " 20" + a.month.split(" ")[1])
        const dateB = new Date(b.month + " 20" + b.month.split(" ")[1])
        return dateA.getTime() - dateB.getTime()
      })
      .slice(-12)
  }, [data])

  // Calculate trend
  const firstApy = chartData[0]?.apy || 0
  const lastApy = chartData[chartData.length - 1]?.apy || 0
  const isUpTrend = lastApy > firstApy
  const percentChange = firstApy > 0 ? ((lastApy - firstApy) / firstApy * 100) : 0

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>APY History</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No chart data to display
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>APY History</CardTitle>
        <CardDescription>Annual Percentage Yield over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value
                  const apyValue = typeof value === 'number' ? value : Number(value) || 0
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-sm text-muted-foreground">
                        APY: {apyValue.toFixed(2)}%
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              dataKey="primary"
              type="natural"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {chartData.length > 0 ? (
            isUpTrend ? (
              <>
                Trending up by {Math.abs(percentChange).toFixed(1)}% <TrendingUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Trending down by {Math.abs(percentChange).toFixed(1)}% <TrendingDown className="h-4 w-4" />
              </>
            )
          ) : (
            "No trend data available"
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          {chartData.length > 0 
            ? `Current APY: ${lastApy.toFixed(2)}% • Data from DeFi Llama`
            : "Data from DeFi Llama"
          }
        </div>
      </CardFooter>
    </Card>
  )
}