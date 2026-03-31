import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Building,
  Minus,
  PieChart as PieChartIcon,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DepartmentData {
  name: string;
  satisfaction: number;
  risk: number;
  responses: number;
  highRiskCount: number;
  percentage?: number;
}

interface DepartmentAnalysisProps {
  departmentChartData: DepartmentData[];
  unitName?: string;
  title?: string;
  comparison?: string;
}

// Add a helper component for empty state
const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <Card className="border-0 shadow-xl">
    <CardHeader className="rounded-t-lg">
      <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
        <Building className="h-6 w-6" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Users className="h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">{message}</p>
      </div>
    </CardContent>
  </Card>
);

// Colorful palette for charts
const CHART_COLORS = {
  primary: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16"],
  gradient: [
    "from-blue-400 to-cyan-500",
    "from-rose-400 to-red-500",
    "from-emerald-400 to-green-500",
    "from-amber-400 to-orange-500",
    "from-purple-400 to-indigo-500",
    "from-cyan-400 to-blue-500",
    "from-lime-400 to-green-500",
  ],
  risk: "#ef4444",
  satisfaction: "#10b981",
};

const getTrendConfig = (value: number, baseline: number = 50) => {
  if (value > baseline + 10) {
    return {
      color: "text-red-600 bg-red-50 border-red-200",
      icon: TrendingUp,
      label: "High",
      trend: "up",
    };
  } else if (value < baseline - 10) {
    return {
      color: "text-green-600 bg-green-50 border-green-200",
      icon: TrendingDown,
      label: "Low",
      trend: "down",
    };
  } else {
    return {
      color: "text-amber-600 bg-amber-50 border-amber-200",
      icon: TrendingUp,
      label: "Moderate",
      trend: "stable",
    };
  }
};

const getSatisfactionConfig = (score: number) => {
  // Determine risk level based on percentage according to new criteria
  const riskLevel =
    score >= 85 ? "noRisk" : score >= 70 ? "lowRisk" : score >= 50 ? "mediumRisk" : "highRisk";

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
    default:
      return {
        color: "text-gray-600 bg-gray-50 border-gray-200",
        icon: Minus,
        label: "unknown risk",
        chartColor: "#94a3b8",
      };
  }
};

export default function DepartmentAnalysis({
  departmentChartData,
  unitName = "Organization",
  title = "Department Analysis",
  comparison = "Department Comparison",
}: DepartmentAnalysisProps) {
  // Check if there's no data to display
  const hasData = departmentChartData && departmentChartData.length > 0;

  // Calculate summary statistics
  const totalParticipants = departmentChartData.reduce((sum, dept) => sum + dept.responses, 0);

  // Prepare data for pie chart (participants distribution)
  const participantsDistribution = departmentChartData.map((dept, index) => ({
    name: dept.name,
    value: dept.responses,
    color: CHART_COLORS.primary[index % CHART_COLORS.primary.length],
    percentage: Math.round((dept.responses / totalParticipants) * 100),
  }));

  if (!hasData) {
    return (
      <EmptyState
        title="Department Analysis"
        message="No department data available with sufficient participant count to maintain privacy."
      />
    );
  }

  return (
    <Card className="w-full border-0 bg-transparent">
      <CardHeader className="rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-black md:text-2xl">
          <Building className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-0 md:pt-6">
        <div className="grid grid-cols-1 gap-8">
          {/* <Card className="border-0 shadow-xl">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
                <BarChart className="h-6 w-6" />
                {comparison}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={12} tick={{ fill: "#475569" }} />
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
                    dataKey="risk"
                    name="Negative Score"
                    fill={CHART_COLORS.risk}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="satisfaction"
                    name="Positive Score"
                    fill={CHART_COLORS.satisfaction}
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}

          <Card className="border-0 shadow-xl">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
                <PieChartIcon className="h-6 w-6" />
                Participants Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-5 md:p-6">
              <div className="relative mx-auto h-100 ">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participantsDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={120}
                      outerRadius={135}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="#fff"
                      strokeWidth={2}
                      // label={({ name, percentage }) => `${name.split('_')[0]}: ${percentage}%`}
                      labelLine={false}
                    >
                      {participantsDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} participants`,
                        props.payload.name,
                      ]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                {participantsDistribution.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm"
                  >
                    <div
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-700">
                      {item.name}: <span className="font-bold">{item.percentage}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
