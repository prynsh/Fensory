import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pool } from "@/types/pool";

interface PoolDetailsCardProps {
  poolDetails: Pool;
  trendPercentage: number;
}

interface DetailItem {
  label: string;
  value: string | null;
}

export function PoolDetailsCard({ poolDetails, trendPercentage }: PoolDetailsCardProps) {
  const formatValue = (value: number | null |undefined, suffix: string = ""): string | null => {
    return value !== null ? `${value?.toFixed(2)}${suffix}` : "-";
  };

  const detailItems: DetailItem[] = [
    { label: "Symbol", value: poolDetails.symbol },
    { label: "TVL (USD)", value: `$${poolDetails.tvlUsd.toLocaleString()}` },
    { label: "APY", value: formatValue(poolDetails.apy, "%") },
    { label: "Prediction", value: formatValue(poolDetails.prediction,"%") },
    { label: "Sigma", value: formatValue(poolDetails.sigma, "%") },
    { label: "30d APY Mean", value: formatValue(poolDetails.apyMean30d, "%") },
    { label: "Trend (12m)", value: `${trendPercentage.toFixed(2)}%` },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{poolDetails.project}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-8">
          {detailItems.map(({ label, value }) => (
            <DetailItem key={label} label={label} value={value} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({ label, value }: DetailItem) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value ?? "—"}</span>
    </div>
  );
}