'use client'
import React from 'react';
import { SectionCards } from "@/components/SectionCards"
import { usePools } from "@/hooks/usePool";
import { CATEGORIES } from '@/types/pool';
import { PoolsTable } from '@/components/PoolTable';

export default function Dashboard() {
  // Single data fetch
  const { pools, loading } = usePools();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-5 py-4 md:gap-6 md:py-6">
          <SectionCards pools={pools} loading={loading} />
          <PoolsTable 
            pools={pools} 
            loading={loading} 
            categories={CATEGORIES} 
          />
        </div>
      </div>
    </div>
  );
}