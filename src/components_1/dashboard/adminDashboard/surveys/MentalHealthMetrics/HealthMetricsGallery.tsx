import { Badge } from "@/components/ui/badge";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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
  domainChartData?: IDomainChartData[];
  riskDistributionData?: IRiskDistributationData[];
}

const getRiskLevelConfig = (riskLevel: string) => {
  switch (riskLevel) {
    case "noRisk":
      return {
        color: "text-green-600 bg-green-50 border-green-200",
        icon: TrendingDown,
        label: "no risk",
        chartColor: "#10b981",
      };
    case "lowRisk":
      return {
        color: "text-blue-600 bg-blue-50 border-blue-200",
        icon: TrendingDown,
        label: "low risk",
        chartColor: "#3b82f6",
      };
    case "mediumRisk":
      return {
        color: "text-amber-600 bg-amber-50 border-amber-200",
        icon: Minus,
        label: "medium risk",
        chartColor: "#f59e0b",
      };
    case "highRisk":
      return {
        color: "text-red-600 bg-red-50 border-red-200",
        icon: TrendingUp,
        label: "high risk",
        chartColor: "#ef4444",
      };
    case "noRisk":
      return {
        color: "text-green-600 bg-green-50 border-green-200",
        icon: TrendingDown,
        label: "no risk",
        chartColor: "#10b981",
      };
    case "Healthy":
      return {
        color: "text-blue-600 bg-blue-50 border-blue-200",
        icon: TrendingDown,
        label: "low risk",
        chartColor: "#3b82f6",
      };
    case "Moderate Healthy":
      return {
        color: "text-amber-600 bg-amber-50 border-amber-200",
        icon: Minus,
        label: "medium risk",
        chartColor: "#f59e0b",
      };
    case "Not Healthy":
      return {
        color: "text-red-600 bg-red-50 border-red-200",
        icon: TrendingUp,
        label: "high risk",
        chartColor: "#ef4444",
      };
    default:
      return {
        color: "text-gray-600 bg-gray-50 border-gray-200",
        icon: Minus,
        label: "unknown risk",
        chartColor: "#94a3b8",
      };
  }
};

export default function HealthMetricsGallery({ metrics }: MentalHealthMetricsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => {
        // Determine risk level based on percentage according to new criteria
        let riskLevel;

        if (
          ["Workload & Efficiency", "Leadership & Alignment", "Satisfaction & Engagement"].includes(
            metric.domain,
          )
        ) {
          riskLevel =
            metric.satisfactionScore >= 85
              ? "Healthy"
              : metric.satisfactionScore >= 70
                ? "Healthy"
                : metric.satisfactionScore >= 50
                  ? "Moderate Healthy"
                  : "Not Healthy";
        } else if (["Clinical Risk Index"].includes(metric.domain)) {
          // Convert satisfactionScore to percentage
          const percentage = metric.satisfactionScore;

          if (percentage <= 3) {
            riskLevel = "noRisk";
          } else if (percentage <= 6) {
            riskLevel = "lowRisk";
          } else if (percentage <= 10) {
            riskLevel = "mediumRisk";
          } else {
            riskLevel = "highRisk";
          }
        } else {
          riskLevel =
            metric.satisfactionScore >= 85
              ? "noRisk"
              : metric.satisfactionScore >= 70
                ? "lowRisk"
                : metric.satisfactionScore >= 50
                  ? "mediumRisk"
                  : "highRisk";
        }

        const config = getRiskLevelConfig(riskLevel);
        const Icon = config.icon;

        // Chart data and color based on same logic
        const chartData = [
          { name: "Metric", value: metric.satisfactionScore, fill: config.chartColor },
          { name: "Remaining", value: 100 - metric.satisfactionScore, fill: "#e2e8f0" },
        ];

        return (
          <div
            key={metric.domain}
            className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative mx-auto mb-4 h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    cornerRadius={8}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-gray-900">{metric.satisfactionScore}</div>
              </div>
            </div>

            <div className="mb-2 flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className={`${config.color} border-2 font-normal capitalize`}
              >
                <Icon className="mr-1 h-3 w-3" />
                {riskLevel}
              </Badge>
            </div>

            <div className="text-lg font-semibold text-gray-700 capitalize">{metric.domain}</div>
          </div>
        );
      })}
    </div>
  );
}
