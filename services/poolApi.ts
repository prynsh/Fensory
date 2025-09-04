import { 
  Pool, 
  ApiPoolResponse, 
  ApiChartResponse, 
  ChartDataPoint 
} from '@/types/pool';
import { extractMonthlyAPY } from '@/utils/chartUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches pool details and chart data for a specific pool
 */
export async function fetchPoolData(poolId: string): Promise<{
  poolDetails: Pool;
  chartData: ChartDataPoint[];
}> {
  try {
    // Fetch both details and historical data in parallel
    const [poolResponse, chartResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/pools`),
      fetch(`${API_BASE_URL}/chart/${poolId}`),
    ]);

    if (!poolResponse.ok) {
      throw new Error(`Failed to fetch pool data: ${poolResponse.status}`);
    }
    
    if (!chartResponse.ok) {
      throw new Error(`Failed to fetch chart data: ${chartResponse.status}`);
    }

    const poolJson = await poolResponse.json();
    const chartJson: ApiChartResponse = await chartResponse.json();

    // Find the specific pool
    const pool = poolJson.data?.find((p: ApiPoolResponse) => p.pool === poolId);
    if (!pool) {
      throw new Error('Pool not found');
    }

    // Transform pool data
    const poolDetails = transformPoolData(pool);

    // Process chart data
    if (!chartJson.data?.length) {
      throw new Error('No APY history available');
    }

    const chartData = extractMonthlyAPY(chartJson.data);

    return { poolDetails, chartData };
    
  } catch (error) {
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}

/**
 * Transforms API response to our internal PoolDetails format
 */
function transformPoolData(pool: ApiPoolResponse): Pool {
  return {
    pool: pool.pool,
    project: pool.project,
    symbol: pool.symbol,
    tvlUsd: pool.tvlUsd,
    apy: pool.apy,
    prediction: pool.predictions?.predictedProbability ?? null,
    sigma: pool.sigma ?? null,
    apyMean30d: pool.apyMean30d ?? null,
  };
}