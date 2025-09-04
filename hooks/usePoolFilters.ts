import { useMemo, useState } from 'react';
import { Pool, FilterState, FILTER_OPTIONS } from '@/types/pool';

const DEFAULT_FILTERS: FilterState = {
  category: "Category",
  tvlFilter: "TVL",
  apyFilter: "APY",
  predictionFilter: "Prediction",
  sigmaFilter: "Sigma",
};

export function usePoolFilters(pools: Pool[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredPools = useMemo(() => {
    return pools.filter((pool) => {
      // Category filter
      if (filters.category !== "Category" && pool.category !== filters.category) {
        return false;
      }

      // TVL filter
      if (filters.tvlFilter !== "TVL") {
        const tvlOption = FILTER_OPTIONS.TVL[filters.tvlFilter as keyof typeof FILTER_OPTIONS.TVL];
        if (tvlOption) {
          if ('min' in tvlOption && pool.tvlUsd <= tvlOption.min) return false;
          if ('max' in tvlOption && pool.tvlUsd >= tvlOption.max) return false;
        }
      }

      // APY filter
      if (filters.apyFilter !== "APY") {
        const apy = pool.apy ?? 0;
        const apyOption = FILTER_OPTIONS.APY[filters.apyFilter as keyof typeof FILTER_OPTIONS.APY];
        if (apyOption) {
          if ('min' in apyOption && apy <= apyOption.min) return false;
          if ('max' in apyOption && apy >= apyOption.max) return false;
        }
      }

      // Prediction filter
      if (filters.predictionFilter !== "Prediction") {
        const prediction = pool.prediction ?? 0;
        const predOption = FILTER_OPTIONS.PREDICTION[filters.predictionFilter as keyof typeof FILTER_OPTIONS.PREDICTION];
        if (predOption) {
          if ('min' in predOption && prediction < predOption.min) return false;
          if ('max' in predOption && prediction > predOption.max) return false;
        }
      }

      // Sigma filter
      if (filters.sigmaFilter !== "Sigma") {
        const sigma = pool.sigma ?? 0;
        const sigmaOption = FILTER_OPTIONS.SIGMA[filters.sigmaFilter as keyof typeof FILTER_OPTIONS.SIGMA];
        if (sigmaOption) {
          if ('min' in sigmaOption && sigma <= sigmaOption.min) return false;
          if ('max' in sigmaOption && sigma >= sigmaOption.max) return false;
        }
      }

      return true;
    });
  }, [pools, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    filters,
    filteredPools,
    updateFilter,
    resetFilters,
  };
}