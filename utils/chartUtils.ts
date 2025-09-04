import { ApiDataPoint, ChartDataPoint } from '@/types/pool';

const DAYS_IN_MS = 24 * 60 * 60 * 1000;
const MAX_ACCEPTABLE_DAYS_DIFF = 7;

 // Extracts one APY value for each of the past 12 months,
 // picking the closest APY value to the 1st day of each month.
export const extractMonthlyAPY = (apiData: ApiDataPoint[]): ChartDataPoint[] => {
  if (!apiData?.length) return [];

  const sortedData = [...apiData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const monthlyData: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const targetTimestamp = targetDate.getTime();

    const closestPoint = findClosestDataPoint(sortedData, targetTimestamp);
    
    if (closestPoint) {
      monthlyData.push({
        month: formatMonthLabel(targetDate),
        apy: roundToDecimals(closestPoint.apy, 2),
        date: targetDate.toLocaleDateString(),
      });
    }
  }

  return monthlyData;
};

 // Finding the data point closest to target timestamp
function findClosestDataPoint(
  sortedData: ApiDataPoint[], 
  targetTimestamp: number
): ApiDataPoint | null {
  if (!sortedData.length) return null;

  let closestPoint = sortedData[0];
  let minDiff = Math.abs(new Date(closestPoint.timestamp).getTime() - targetTimestamp);

  for (const point of sortedData) {
    const pointTimestamp = new Date(point.timestamp).getTime();
    const diff = Math.abs(pointTimestamp - targetTimestamp);

    if (diff < minDiff) {
      minDiff = diff;
      closestPoint = point;
    }

    // Stop looking if we're too far ahead (>7 days past target)
    if (pointTimestamp > targetTimestamp + MAX_ACCEPTABLE_DAYS_DIFF * DAYS_IN_MS) {
      break;
    }
  }

  return closestPoint;
}

/**
 * Formats date to month abbreviation and 2-digit year
 */
function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    year: "2-digit" 
  });
}

/**
 * Rounds number to specified decimal places
 */
function roundToDecimals(num: number, decimals: number): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculates APY trend percentage over time period
 */
export const calculateTrendPercentage = (chartData: ChartDataPoint[]): number => {
  if (chartData.length < 2) return 0;
  
  const first = chartData[0].apy;
  const last = chartData[chartData.length - 1].apy;
  
  if (first === 0) return 0;
  
  return ((last - first) / first) * 100;
};