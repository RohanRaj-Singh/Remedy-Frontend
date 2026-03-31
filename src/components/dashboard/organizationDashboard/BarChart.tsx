import { Card } from "@/components/ui/card";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { getRiskColor } from "@/utils/colors";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";

interface BarChartProps {
  title: string;
  stream?: string;
  fn?: string;
  department?: string;
  age?: string;
  gender?: string;
  location?: string;
  description?: string;
  data?: { name: string; value: number; isSatisfactionScore?: boolean }[];
  isLoading?: boolean;
}

interface DomainSummaryItem {
  domain: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
}

export function BarChartComponent({
  title,
  description,
  data,
  isLoading,
  stream,
  fn,
  department,
  age,
  gender,
  location,
}: BarChartProps) {
  const [subdomainStats] = useGetSubdomainStatsMutation();
  const [chartData, setChartData] = useState<
    { name: string; value: number; isSatisfactionScore?: boolean }[]
  >([]);

  useEffect(() => {
    if (data) {
      setChartData(data);
      return;
    }

    const fetchStats = async () => {
      const res = await subdomainStats({
        dashboardDomain: title,
        stream,
        function: fn,
        department,
        age,
        gender,
        location,
      }).unwrap();

      setChartData(
        res.data.domainSummary.map((item: DomainSummaryItem) => ({
          name: item.domain,
          value: Number(item.satisfiedScore),
          isSatisfactionScore: true,
        })),
      );
    };

    fetchStats();
  }, [title, data, stream, fn, department, age, gender, location, subdomainStats]);

  const chartWidth = Math.max(chartData.length * 150, 600);

  const getSatisfactionRiskColor = (score: number) => {
    if (score >= 85) return "#22c55e";
    if (score >= 70) return "#84cc16";
    if (score >= 50) return "#eab308";
    return "#ef4444";
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex h-80 items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-foreground mb-2 font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mb-4 text-sm">{description}</p>}

      <div className="w-full overflow-x-auto">
        <div style={{ width: chartWidth }}>
          <BarChart
            width={chartWidth}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />

            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />

            <YAxis
              domain={[0, 100]}
              label={{
                value: "Percentage (%)",
                angle: -90,
                position: "insideLeft",
              }}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) => [`${value}%`, "Score"]}
              contentStyle={{
                backgroundColor: "var(--color-background)",
                border: `1px solid var(--color-border)`,
              }}
            />

            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.isSatisfactionScore
                      ? getSatisfactionRiskColor(entry.value)
                      : getRiskColor(entry.value)
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </Card>
  );
}
