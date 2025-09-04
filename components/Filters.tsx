"use client"

import * as React from "react"
import { Box } from "@mui/material"
import { PoolTable } from "./DataTable"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Stack } from "@mui/material"
import { Button } from "./ui/button"

interface Pool {
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

interface Props {
  categories: string[]
  pools: Pool[]
  loading: boolean
}

export default function Filters({ categories, pools, loading }: Props) {
  const [category, setCategory] = React.useState("Category")
  const [tvlFilter, setTvlFilter] = React.useState("TVL")
  const [apyFilter, setApyFilter] = React.useState("APY")
  const [predictionFilter, setPredictionFilter] = React.useState("Prediction")
  const [sigmaFilter, setSigmaFilter] = React.useState("Sigma")

  const handleReset = () => {
    setCategory("Category")
    setTvlFilter("TVL")
    setApyFilter("APY")
    setPredictionFilter("Prediction")
    setSigmaFilter("Sigma")
  }

  const filteredPools = pools.filter((p) => {
    const inCategory = category === "Category" || p.category === category

    const inTVL =
      tvlFilter === "TVL" ||
      (tvlFilter === "High" && p.tvlUsd > 1_000_000_000) ||
      (tvlFilter === "Medium" && p.tvlUsd >= 100_000_000 && p.tvlUsd <= 1_000_000_000) ||
      (tvlFilter === "Low" && p.tvlUsd < 100_000_000)

    const inAPY =
      apyFilter === "APY" ||
      (apyFilter === "High" && (p.apy ?? 0) > 10) ||
      (apyFilter === "Moderate" && (p.apy ?? 0) >= 2 && (p.apy ?? 0) <= 10) ||
      (apyFilter === "Low" && (p.apy ?? 0) < 2)

    const inPrediction =
      predictionFilter === "Prediction" ||
      (predictionFilter === "Low" && (p.prediction ?? 0) >= 0 && (p.prediction ?? 0) <= 50) ||
      (predictionFilter === "Medium" && (p.prediction ?? 0) > 50 && (p.prediction ?? 0) <= 75) ||
      (predictionFilter === "High" && (p.prediction ?? 0) > 75)

    const inSigma =
      sigmaFilter === "Sigma" ||
      (sigmaFilter === "Low" && (p.sigma ?? 0) < 0.05) ||
      (sigmaFilter === "Medium" && (p.sigma ?? 0) >= 0.05 && (p.sigma ?? 0) <= 0.15) ||
      (sigmaFilter === "High" && (p.sigma ?? 0) > 0.15)

    return inCategory && inTVL && inAPY && inPrediction && inSigma
  })

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" mb={3} flexWrap="wrap">
        {/* Category */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Category">Category</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* TVL */}
        <Select value={tvlFilter} onValueChange={setTvlFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="TVL" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TVL">TVL</SelectItem>
            <SelectItem value="High">High (&gt; $1B)</SelectItem>
            <SelectItem value="Medium">Medium ($100M – $1B)</SelectItem>
            <SelectItem value="Low">Low (&lt; $100M)</SelectItem>
          </SelectContent>
        </Select>

        {/* APY */}
        <Select value={apyFilter} onValueChange={setApyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="APY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APY">APY</SelectItem>
            <SelectItem value="High">High Yield (&gt; 10%)</SelectItem>
            <SelectItem value="Moderate">Moderate (2–10%)</SelectItem>
            <SelectItem value="Low">Low (&lt; 2%)</SelectItem>
          </SelectContent>
        </Select>

        {/* Prediction */}
        <Select value={predictionFilter} onValueChange={setPredictionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Prediction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Prediction">Prediction</SelectItem>
            <SelectItem value="Low">0 – 50</SelectItem>
            <SelectItem value="Medium">50 – 75</SelectItem>
            <SelectItem value="High">75 – 100</SelectItem>
          </SelectContent>
        </Select>

        {/* Sigma */}
        <Select value={sigmaFilter} onValueChange={setSigmaFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sigma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sigma">Sigma</SelectItem>
            <SelectItem value="Low">Low (&lt; 0.05)</SelectItem>
            <SelectItem value="Medium">Medium (0.05 – 0.15)</SelectItem>
            <SelectItem value="High">High (&gt; 0.15)</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button (kept MUI, but can switch to Shadcn if you want) */}
        <Button variant="default" onClick={handleReset}>
          Reset
        </Button>
      </Stack>

      <PoolTable pools={filteredPools} loading={loading} />
    </Box>
  )
}
