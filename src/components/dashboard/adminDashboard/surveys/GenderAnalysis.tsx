import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Heart,
  Mars,
  Minus,
  PieChart as PieChartIcon,
  TrendingDown,
  TrendingUp,
  Users,
  Venus,
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

interface GenderData {
  name: string;
  participants: number;
  riskScore: number;
  satisfaction: number;
  percentage: number;
}

interface GenderAnalysisProps {
  genderChartData: GenderData[];
  unitName?: string;
}

// Add a helper component for empty state
const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <Card className="w-full border-0 bg-transparent">
    <CardHeader className="rounded-t-lg pb-4">
      <CardTitle className="flex items-center gap-2 text-xl font-bold text-black md:text-2xl">
        <Heart className="h-6 w-6" />
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
  primary: ["#3b82f6", "#ec4899", "#8b5cf6", "#06b6d4", "#84cc16"],
  gender: {
    male: "#3b82f6", // blue
    female: "#ec4899", // pink
    other: "#8b5cf6", // purple
  },
  riskScore: "#ef4444",
  satisfaction: "#10b981",
};

const getGenderColor = (gender: string) => {
  switch (gender.toLowerCase()) {
    case "male":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "female":
      return "text-pink-600 bg-pink-50 border-pink-200";
    default:
      return "text-purple-600 bg-purple-50 border-purple-200";
  }
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

export default function GenderAnalysis({
  genderChartData,
  unitName = "Organization",
}: GenderAnalysisProps) {
  // Check if there's no data to display
  const hasData = genderChartData && genderChartData.length > 0;

  // Calculate summary statistics
  const totalParticipants = genderChartData.reduce((sum, gender) => sum + gender.participants, 0);

  // Prepare data for pie chart (participants distribution)
  const participantsDistribution = genderChartData.map((gender, index) => ({
    name: gender.name,
    value: gender.participants,
    color:
      CHART_COLORS.gender[gender.name.toLowerCase() as keyof typeof CHART_COLORS.gender] ||
      CHART_COLORS.primary[index],
    percentage: Math.round((gender.participants / totalParticipants) * 100),
  }));

  if (!hasData) {
    return (
      <EmptyState
        title="Gender Analysis"
        message="No gender data available with sufficient participant count to maintain privacy."
      />
    );
  }

  return (
    <Card className="w-full border-0 bg-transparent">
      <CardHeader className="rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-black md:text-2xl">
          <Heart className="h-6 w-6" />
          Gender Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-0 md:pt-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border-0 shadow-xl">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
                <BarChart className="h-6 w-6" />
                Gender Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={genderChartData}>
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
                    dataKey="riskScore"
                    name="Risk Score"
                    fill={CHART_COLORS.riskScore}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="satisfaction"
                    name="Satisfaction %"
                    fill={CHART_COLORS.satisfaction}
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
                <PieChartIcon className="h-6 w-6" />
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-5 md:p-6">
              <div className="relative mx-auto h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participantsDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="#fff"
                      strokeWidth={2}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
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
                {participantsDistribution.map((item, index) => {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm"
                    >
                      {item.name.toLowerCase() === "male" ? (
                        <Mars className="h-4 w-4" style={{ color: item.color }} />
                      ) : (
                        <Venus className="h-4 w-4" style={{ color: item.color }} />
                      )}
                      <span className="font-medium text-gray-700 capitalize">
                        {item.name}: <span className="font-bold">{item.percentage}%</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {genderChartData.map((gender, index) => {
            const satisfactionConfig = getSatisfactionConfig(gender.satisfaction);
            const Icon = satisfactionConfig.icon;

            // Chart data and color based on same logic
            const chartData = [
              {
                name: "Satisfaction",
                value: gender.satisfaction,
                fill: satisfactionConfig.chartColor,
              },
              { name: "Remaining", value: 100 - gender.satisfaction, fill: "#e2e8f0" },
            ];

            return (
              <div
                key={gender.name}
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
                    <div className="text-xl font-bold text-gray-900">
                      {gender.satisfaction.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="mb-2 flex items-center justify-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${satisfactionConfig.color} border-2 font-normal capitalize`}
                  >
                    <Icon className="mr-1 h-3 w-3" />
                    {satisfactionConfig.label}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700">
                  {gender.name.toLowerCase() === "male" ? (
                    <Mars className="h-5 w-5" />
                  ) : (
                    <Venus className="h-5 w-5" />
                  )}
                  {gender.name}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border-t border-pink-200 bg-white p-6 pt-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5" />
            Detailed Gender Analysis: {unitName}
          </div>

          <div className="space-y-4">
            {genderChartData.map((gender, index) => {
              const riskConfig = getTrendConfig(gender.riskScore);
              const satisfactionConfig = getSatisfactionConfig(gender.satisfaction);
              const RiskIcon = riskConfig.icon;

              return (
                <div
                  key={gender.name}
                  className="space-y-4 rounded-lg border border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50 p-4"
                >
                  <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                    <span className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      {gender.name.toLowerCase() === "male" ? (
                        <Mars className="h-4 w-4" />
                      ) : (
                        <Venus className="h-4 w-4" />
                      )}
                      {gender.name} Participants
                    </span>
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <Badge
                        variant="outline"
                        className={`${riskConfig.color} border-2 font-semibold`}
                      >
                        <RiskIcon className="mr-1 h-3 w-3" />
                        Risk: {riskConfig.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${satisfactionConfig.color} border-2 font-semibold`}
                      >
                        Satisfaction: {satisfactionConfig.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div className="rounded-lg border bg-white p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{gender.participants}</div>
                      <div className="text-gray-600">Participants ({gender.percentage}%)</div>
                    </div>

                    <div className="rounded-lg border bg-white p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">{gender.riskScore}</div>
                      <div className="text-gray-600">Risk Score</div>
                    </div>

                    <div className="rounded-lg border bg-white p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {gender.satisfaction}%
                      </div>
                      <div className="text-gray-600">Satisfaction</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Risk Level</span>
                        <span className="font-bold">{gender.riskScore}/100</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-gray-100 shadow-inner">
                        <div
                          className="h-3 rounded-full shadow-md transition-all duration-500"
                          style={{
                            width: `${gender.riskScore}%`,
                            backgroundColor: CHART_COLORS.riskScore,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Satisfaction</span>
                        <span className="font-bold">{gender.satisfaction}%</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-gray-100 shadow-inner">
                        <div
                          className="h-3 rounded-full shadow-md transition-all duration-500"
                          style={{
                            width: `${gender.satisfaction}%`,
                            backgroundColor: CHART_COLORS.satisfaction,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
