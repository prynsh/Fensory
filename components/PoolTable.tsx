"use client"

import React from "react";
import { Box } from "@mui/material";
import { Filters } from "./Filters";
import { usePoolFilters } from "@/hooks/usePoolFilters";
import { Pool } from "@/types/pool";
import { DataTable } from "./DataTable";

interface PoolsTableProps {
  pools: Pool[];
  loading: boolean;
  categories: readonly string[];
}

export function PoolsTable({ pools, loading, categories }: PoolsTableProps) {
  const { filters, filteredPools, updateFilter, resetFilters } = usePoolFilters(pools);

  return (
    <Box>
      <Filters
        filters={filters}
        categories={categories}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />
      <DataTable pools={filteredPools} loading={loading} />
    </Box>
  );
}