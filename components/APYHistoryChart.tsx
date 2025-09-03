"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ApyHistoryProps {
  poolId: string
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

export function ApyHistoryChart({ poolId }: ApyHistoryProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trendPercentage, setTrendPercentage] = useState<number>(0)

  useEffect(() => {
    const fetchApyHistory = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`https://yields.llama.fi/chart/${poolId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch APY history')
        }
        
        const data: { status: string; data: ApiDataPoint[] } = await response.json()
        
        if (!data.data || data.data.length === 0) {
          throw new Error('No APY history data available')
        }

        // Extract APY values for 1st day of each month for last 12 months
        const monthlyData = extractMonthlyAPY(data.data)
        setChartData(monthlyData)
        
        // Calculate trend
        if (monthlyData.length >= 2) {
          const firstValue = monthlyData[0].apy
          const lastValue = monthlyData[monthlyData.length - 1].apy
          const trend = ((lastValue - firstValue) / firstValue) * 100
          setTrendPercentage(trend)
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching APY history:', err)
      } finally {
        setLoading(false)
      }
    }

    if (poolId) {
      fetchApyHistory()
    }
  }, [poolId])

  const extractMonthlyAPY = (apiData: ApiDataPoint[]): ChartDataPoint[] => {
    // Sort data by timestamp (oldest first)
    const sortedData = [...apiData].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    const monthlyData: ChartDataPoint[] = []
    const now = new Date()
    
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const targetTimestamp = targetDate.getTime()
      
      // Find the closest APY data point to the 1st of the month
      let closestPoint = sortedData[0]
      let minDiff = Math.abs(new Date(closestPoint.timestamp).getTime() - targetTimestamp)
      
      for (const point of sortedData) {
        const pointTimestamp = new Date(point.timestamp).getTime()
        const diff = Math.abs(pointTimestamp - targetTimestamp)
        
        if (diff < minDiff) {
          minDiff = diff
          closestPoint = point
        }
        
        // If we've passed the target date, break
        if (pointTimestamp > targetTimestamp + 7 * 24 * 60 * 60 * 1000) { // 7 days tolerance
          break
        }
      }
      
      monthlyData.push({
        month: targetDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        apy: Math.round(closestPoint.apy * 100) / 100, // Round to 2 decimal places
        date: targetDate.toLocaleDateString()
      })
    }
    
    return monthlyData
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>APY History</CardTitle>
          <CardDescription>Loading APY data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>APY History</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>APY History</CardTitle>
        <CardDescription>
          Monthly APY trends for the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                hideLabel={false}
                formatter={(value, name) => [
                  `${value}%`,
                  "APY"
                ]}
                labelFormatter={(label) => {
                  const dataPoint = chartData.find(d => d.month === label)
                  return dataPoint ? `${dataPoint.date}` : label
                }}
              />}
            />
            <Line
              dataKey="apy"
              type="monotone"
              stroke="var(--color-apy)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-apy)",
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {trendPercentage >= 0 ? (
            <>
              Trending up by {Math.abs(trendPercentage).toFixed(1)}% over 12 months
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(trendPercentage).toFixed(1)}% over 12 months
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing APY values for the 1st day of each month
        </div>
      </CardFooter>
    </Card>
  )
}