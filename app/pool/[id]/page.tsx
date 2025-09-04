"use client"

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { usePoolDetails } from "@/hooks/usePoolDetails";
import { calculateTrendPercentage } from "@/utils/chartUtils";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { PoolDetailsCard } from "@/components/PoolDetailsCard";
import { APYChart } from "@/components/APYChart";
import {  ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PoolDetailPage() {
  const params = useParams();
  const poolId = params?.id as string;
  
  const { poolDetails, chartData, loading, error } = usePoolDetails(poolId);

  // Calculate trend percentage with memoization
  const trendPercentage = useMemo(() => {
    return calculateTrendPercentage(chartData);
  }, [chartData]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !poolDetails) {
    return <ErrorState error={error || "Pool not found"} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
      <Link href="/">
        <Button variant="default" size="sm" className="flex items-center">
          <ArrowLeft className="mr-1" />
          Back
        </Button>
      </Link>
    </div>
      <PoolDetailsCard poolDetails={poolDetails} trendPercentage={trendPercentage} />
      <APYChart chartData={chartData} />
    </div>
  );
}