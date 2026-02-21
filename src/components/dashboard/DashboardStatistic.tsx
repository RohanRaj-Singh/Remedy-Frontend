"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllSurveyResultQuery } from "@/redux/api/apis/surveyApi";
import {
  AlertCircle,
  CheckCircle,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Vibrant color palette
const PIE_COLORS = {
  completed: "#10b981",
  inProgress: "#f59e0b",
  highRisk: "#ef4444",
  lowRisk: "#3b82f6",
};

interface User {
  department: string;
  gender: string;
  age: string;
  seniorityLevel: string;
  location: string;
  _id: string;
  organizationId: string;
}

interface Survey {
  _id: string;
  user: User;
  highRiskCount: number;
  status: string;
  organizationId?: string;
}

interface DomainStat {
  _id: string;
  totalRiskCount: number;
}

interface Statistics {
  totalSurverys: number;
  totalCompletedSurveys: number;
  totalIncompletedSurveys: number;
  avgHighRiskCount: number;
  domainStats: DomainStat[];
  riskySurveysCount: number;
}

interface SurveyDataResponse {
  surveys: Survey[];
  statistics: Statistics;
}

export default function DashboardStatistic() {
  const [selectedDepartment] = useState<string>("all");
  const { data, isLoading, isError } = useGetAllSurveyResultQuery(undefined, {
    pollingInterval: 10000,
  });

  const surveyData: SurveyDataResponse | undefined = data?.data?.data;
  const statistics: Statistics = data?.data?.data?.statistics;

  const filteredSurveys = useMemo(() => {
    if (!surveyData?.surveys) return [];
    if (selectedDepartment === "all") return surveyData.surveys;
    return surveyData.surveys.filter(
      (s) => s.user.department.toLowerCase() === selectedDepartment.toLowerCase(),
    );
  }, [surveyData, selectedDepartment]);

  const departmentsDataApi = useMemo(() => {
    if (!surveyData?.surveys) return [];
    return Array.from(new Set(surveyData.surveys.map((s) => s.user.department))).sort();
  }, [surveyData]);

  const departmentStats = useMemo(() => {
    if (!surveyData?.surveys) return [];
    const stats: Record<string, { department: string; totalRisk: number; count: number }> = {};

    surveyData.surveys.forEach((survey) => {
      const dept = survey.user.department;
      if (!stats[dept]) {
        stats[dept] = { department: dept, totalRisk: 0, count: 0 };
      }
      stats[dept].totalRisk += survey.highRiskCount;
      stats[dept].count += 1;
    });

    return Object.values(stats).map((stat) => ({
      ...stat,
      percentage: stat.count > 0 ? Math.round((stat.totalRisk / (stat.count * 20)) * 100) : 0,
    }));
  }, [surveyData]);

  const domainData = useMemo(() => {
    if (!surveyData?.statistics?.domainStats) return [];
    const totalRisks = surveyData.statistics.domainStats.reduce(
      (sum, d) => sum + d.totalRiskCount,
      0,
    );
    return surveyData.statistics.domainStats.map((domain) => ({
      name: domain._id,
      riskCount: domain.totalRiskCount,
      percentage: totalRisks > 0 ? Math.round((domain.totalRiskCount / totalRisks) * 100) : 0,
    }));
  }, [surveyData]);

  const statusData = useMemo(() => {
    return [
      { name: "Completed", value: statistics?.totalCompletedSurveys, color: PIE_COLORS.completed },
      {
        name: "In Progress",
        value: statistics?.totalSurverys - statistics?.totalCompletedSurveys,
        color: PIE_COLORS.inProgress,
      },
    ];
  }, [statistics?.totalCompletedSurveys, statistics?.totalSurverys]);

  const riskDistribution = useMemo(() => {
    const highRisk = filteredSurveys.filter((s) => s.highRiskCount > 0).length;
    const lowRisk = filteredSurveys.length - highRisk;
    const total = filteredSurveys.length;
    const highRiskPercent = total > 0 ? Math.round((highRisk / total) * 100) : 0;

    return { highRisk, lowRisk, highRiskPercent };
  }, [filteredSurveys]);

  const totalRiskCount = filteredSurveys.reduce((sum, s) => sum + s.highRiskCount, 0);
  const avgRisk =
    filteredSurveys.length > 0 ? Math.round(totalRiskCount / filteredSurveys.length) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center p-4">
        <div className="text-sm font-medium text-gray-600 sm:text-base">Loading analytics...</div>
      </div>
    );
  }

  if (isError || !surveyData) {
    return (
      <div className="flex min-h-[200px] items-center justify-center p-4">
        <div className="text-sm text-red-600 sm:text-base">
          Failed to load data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Survey Analytics
          </h1>
          <p className="mt-1 text-xs text-gray-600 sm:text-sm md:text-base">
            Real-time employee insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-gray-600 sm:gap-2 sm:text-sm">
              <Users className="h-4 w-4 flex-shrink-0 text-blue-600 sm:h-5 sm:w-5" />
              <span className="truncate">Total Surveys</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              {statistics.totalSurverys}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-gray-600 sm:gap-2 sm:text-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-600 sm:h-5 sm:w-5" />
              <span className="truncate">Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              {statistics.totalCompletedSurveys}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-gray-600 sm:gap-2 sm:text-sm">
              <TrendingUp className="h-4 w-4 flex-shrink-0 text-amber-600 sm:h-5 sm:w-5" />
              <span className="truncate">Avg Risk Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              {statistics.avgHighRiskCount.toFixed(1)} %{" "}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-gray-600 sm:gap-2 sm:text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 sm:h-5 sm:w-5" />
              <span className="truncate">High Risk</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              {statistics.riskySurveysCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl">
              <PieChartIcon className="h-5 w-5 flex-shrink-0 text-emerald-600 sm:h-6 sm:w-6" />
              <span>Survey Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[280px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  className="sm:!innerRadius-[70] sm:!outerRadius-[100]"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs sm:mt-4 sm:gap-6 sm:text-sm">
              {statusData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="whitespace-nowrap">
                    {d.name}: {d.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
            <TrendingUp className="h-5 w-5 flex-shrink-0 text-purple-600 sm:h-6 sm:w-6" />
            <span>Individual Survey Risk Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250} className="sm:!h-[320px]">
            <LineChart
              data={filteredSurveys.map((s, i) => ({
                name: `S${i + 1}`,
                risk: s.highRiskCount,
              }))}
            >
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} className="sm:!tick-[fontSize:12]" />
              <YAxis tick={{ fontSize: 11 }} className="sm:!tick-[fontSize:12]" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", r: 4 }}
                activeDot={{ r: 6 }}
                className="sm:!strokeWidth-[3] sm:!dot-[r:5] sm:!activeDot-[r:7]"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
