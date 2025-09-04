import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartDataPoint } from "@/types/pool";

interface APYChartProps {
  chartData: ChartDataPoint[];
}

const chartConfig = {
  apy: {
    label: "APY %",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function APYChart({ chartData }: APYChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>APY History</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyChartState />
        ) : (
          <ChartContainer config={chartConfig} className="sm:h-[300] xl:max-h-[400] w-full">
            <LineChart 
              data={chartData} 
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-[200px]"
                    hideLabel={false}
                    formatter={(value) => [`${value}%`, "APY"]}
                    labelFormatter={(label) => {
                      const point = chartData.find((d) => d.month === label);
                      return point?.date ?? label;
                    }}
                  />
                }
              />
              <Line
                dataKey="apy"
                type="monotone"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-1)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyChartState() {
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      No chart data available
    </div>
  );
}