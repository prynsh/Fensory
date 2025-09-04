import { useState, useEffect } from 'react';
import { Pool, ChartDataPoint } from '@/types/pool';
import { fetchPoolData } from '@/services/poolApi';

interface UsePoolDetailsReturn {
  poolDetails: Pool | null;
  chartData: ChartDataPoint[];
  loading: boolean;
  error: string | null;
}

export function usePoolDetails(poolId: string): UsePoolDetailsReturn {
  const [poolDetails, setPoolDetails] = useState<Pool | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poolId) {
      setError('Pool ID is required');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadPoolData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPoolData(poolId);

        if (isMounted) {
          setPoolDetails(data.poolDetails);
          setChartData(data.chartData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPoolData();

    return () => {
      isMounted = false;
    };
  }, [poolId]);

  return {
    poolDetails,
    chartData,
    loading,
    error,
  };
}