"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ComparisonChartProps {
  title: string;
  data: Array<{
    name: string;
    value1: number;
    value2: number;
  }>;
  series1Name: string;
  series2Name: string;
  description?: string;
}

export function ComparisonChart({
  title,
  data,
  series1Name,
  series2Name,
  description,
}: ComparisonChartProps) {
  // width grows with number of bars
  const chartWidth = Math.max(data.length * 180, 600);

  return (
    <Card className="p-6">
      <h3 className="text-foreground mb-2 font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mb-4 text-sm">{description}</p>}

      {/* Horizontal scroll container */}
      <div className="w-full overflow-x-auto">
        <div style={{ width: chartWidth }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />

              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />

              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{
                  value: "Percentage (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  border: `1px solid var(--color-border)`,
                }}
              />

              <Legend />

              <Bar dataKey="value1" fill="var(--color-chart-1)" name={series1Name} barSize={40} />
              <Bar dataKey="value2" fill="var(--color-chart-2)" name={series2Name} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
