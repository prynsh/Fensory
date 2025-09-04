export interface Pool {
  pool: string
  project: string
  category?: string
  symbol: string
  tvlUsd: number
  apy: number | null
  prediction?: number | null
  sigma?: number | null
  apyMean30d?: number | null
}

export interface ChartDataPoint {
  month: string
  apy: number
  date: string
}

export interface ApiDataPoint {
  timestamp: string
  tvlUsd: number
  apy: number
}

export interface ApiPoolResponse {
  pool: string
  project: string
  symbol: string
  tvlUsd: number
  apy: number
  predictions?: {
    predictedProbability: number
  }
  sigma?: number
  apyMean30d?: number
}

export interface ApiChartResponse {
  status: string
  data: ApiDataPoint[]
}

export interface FilterState {
  category: string
  tvlFilter: string
  apyFilter: string
  predictionFilter: string
  sigmaFilter: string
}

export const FILTER_OPTIONS = {
  TVL: {
    HIGH: { label: "High (> $1B)", min: 1_000_000_000 },
    MEDIUM: { label: "Medium ($100M – $1B)", min: 100_000_000, max: 1_000_000_000 },
    LOW: { label: "Low (< $100M)", max: 100_000_000 }
  },
  APY: {
    HIGH: { label: "High Yield (> 10%)", min: 10 },
    MODERATE: { label: "Moderate (2–10%)", min: 2, max: 10 },
    LOW: { label: "Low (< 2%)", max: 2 }
  },
  PREDICTION: {
    LOW: { label: "0 – 50", min: 0, max: 50 },
    MEDIUM: { label: "50 – 75", min: 50, max: 75 },
    HIGH: { label: "75 – 100", min: 75 }
  },
  SIGMA: {
    LOW: { label: "Low (< 0.05)", max: 0.05 },
    MEDIUM: { label: "Medium (0.05 – 0.15)", min: 0.05, max: 0.15 },
    HIGH: { label: "High (> 0.15)", min: 0.15 }
  }
} as const;

export const CATEGORIES = ["Lending", "Liquid Staking", "Yield Aggregator"] as const;