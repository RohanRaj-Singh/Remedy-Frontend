import { Card } from "@/components/ui/card";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { getRiskColor } from "@/utils/colors";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarChartProps {
  title: string;
  stream: string;
  fn: string;
  department: string;
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

interface SubdomainStatsResponse {
  dashboardDomain: string;
  domainSummary: DomainSummaryItem[];
  departmentSummary: { department: string; participants: number }[];
  locationSummary: { location: string; participants: number }[];
}

export function ClinicalRiskBarChart({
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
    // If data is passed directly, use it
    if (data) {
      setChartData(data);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await subdomainStats({
          dashboardDomain: title,
          stream: stream || undefined,
          function: fn || undefined,
          department: department || undefined,
          age: age || undefined,
          gender: gender || undefined,
          location: location || undefined,
        }).unwrap();

        // Build Bar Chart data from domainSummary → riskScore %
        // For Clinical Risk Index, we want to show satisfaction scores with proper risk colors
        const formatted = res.data.domainSummary.map((item: DomainSummaryItem) => ({
          name: item.domain,
          value: Number(item.riskScore),
          isSatisfactionScore: true,
        }));

        setChartData(formatted);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    // Only fetch if no data was passed directly
    if (!data) {
      fetchStats();
    }
  }, [title, data, stream, fn, department, age, gender, location]);

  // Function to get risk color based on satisfaction score
  const getSatisfactionRiskColor = (satisfactionScore: number): string => {
    if (satisfactionScore >= 85) return "#22c55e"; // Green - No Risk
    if (satisfactionScore >= 70) return "#84cc16"; // Light Green - Low Risk
    if (satisfactionScore >= 50) return "#eab308"; // Yellow/Orange - Medium Risk
    return "#ef4444"; // Red - High Risk
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex h-80 items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-foreground mb-2 font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mb-4 text-sm">{description}</p>}

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            domain={[0, 100]}
            label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Score"]}
            contentStyle={{
              backgroundColor: "var(--color-background)",
              border: `1px solid var(--color-border)`,
            }}
          />

          <Bar dataKey="value" fill="var(--color-chart-1)">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.isSatisfactionScore
                    ? getSatisfactionRiskColor(entry.value)
                    : getRiskColor(entry.value)
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
