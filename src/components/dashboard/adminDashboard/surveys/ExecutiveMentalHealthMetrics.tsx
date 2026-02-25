import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Heart } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ExecutiveHealthMetricsGallery from "./MentalHealthMetrics/ExecutiveHealthMetricsGallery";

interface MentalHealthMetric {
  domain: string;
  avgRisk: number;
  riskPercent: number;
  surveyCount: number;
  highRiskCount: number;
  nonHighRiskCount: number;
  satisfactionScore: number;
  riskLevel: string;
}

interface IRiskDistributationData {
  name: string;
  value: number;
  color: string;
}

interface IDomainChartData {
  name: string;
  riskPercent: number;
  satisfactionScore: number;
  avgRisk: number;
  highRiskCount: number;
}

interface MentalHealthMetricsProps {
  metrics: MentalHealthMetric[];
  unitName?: string;
  domainChartData: IDomainChartData[];
  riskDistributionData: IRiskDistributationData[];
}

// Colorful palette for charts
const CHART_COLORS = {
  primary: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
  gradient: [
    "from-blue-400 to-cyan-500",
    "from-rose-400 to-red-500",
    "from-emerald-400 to-green-500",
    "from-amber-400 to-orange-500",
    "from-purple-400 to-indigo-500",
  ],
  domainRisk: "#f43f5e",
  domainSatisfaction: "#06d6a0",
  domainAvgRisk: "#8b5cf6",
};

export default function ExecutiveMentalHealthMetrics({
  metrics,
  domainChartData,
  riskDistributionData,
}: MentalHealthMetricsProps) {
  console.log("metrics", metrics);
  return (
    <Card className="w-full border-0 bg-transparent">
      <CardHeader className="rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-black md:text-2xl">
          <Heart className="h-6 w-6" />
          Mental Health Metrics %
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-0 md:pt-6">
        <ExecutiveHealthMetricsGallery metrics={metrics} />

        {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
          <Card className="border-0 shadow-xl">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
                <BarChart className="h-6 w-6" />
                Domain Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={domainChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    angle={0}
                    textAnchor="start"
                    height={40}
                    fontSize={12}
                    tick={{ fill: "#475569" }}
                  />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="riskPercent"
                    name="Risk Percentage"
                    fill={CHART_COLORS.domainRisk}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="satisfactionScore"
                    name="Positive Score"
                    fill={CHART_COLORS.domainSatisfaction}
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div> */}
      </CardContent>
    </Card>
  );
}
