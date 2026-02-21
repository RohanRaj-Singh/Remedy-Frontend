"use client";

import AgeGroupAnalysis from "@/components/dashboard/adminDashboard/surveys/AgeGroupAnalysis";
import DepartmentAnalysis from "@/components/dashboard/adminDashboard/surveys/DepartmentAnalysis";
import HierarchicalFilter from "@/components/dashboard/filter/HierarchicalFilter";
import { Card } from "@/components/ui/card";
import SelectInput from "@/components/ui/SelectInput";
import { ageOptions, departments, genderOptions, locationOptions } from "@/data/survey";
import { useGetAllSurveyStatisticsForOrganizationQuery } from "@/redux/api/apis/surveyApi";
import {
  Flame,
  LineChart,
  PieChart as PieChartIcon,
  Shield,
  Smile,
  TrendingUp,
  Users,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ExecutiveMentalHealthMetrics from "../dashboard/adminDashboard/surveys/ExecutiveMentalHealthMetrics";
import AutoStepLoader from "../ui/AutoStepLoader";

interface DashboardDomainAverage {
  averageRiskScore: number;
  averageRiskStatus: string;
  averageSatisfactionScore: number;
  averageSatisfactionStatus: string;
}

interface MentalHealthMetric {
  domain: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
  highRiskSurveyCount: number;
  nonHighRiskSurveyCount: number;
  dashboardDomainAverage: DashboardDomainAverage;
}

interface ScoreCardType extends MentalHealthMetric {
  icon: ReactNode;
}

interface FilterState {
  stream: string;
  function: string;
  department: string;
  age: string;
  gender: string;
  location: string;
}

// Vibrant color palette for risk levels
const COLORS = {
  noRisk: "#10b981",
  lowRisk: "#3b82f6",
  mediumRisk: "#f59e0b",
  highRisk: "#ef4444",
  completed: "#3b82f6",
  satisfaction: "#8b5cf6",
};

function getIcon(domain: string): ReactNode {
  switch (domain) {
    case "Clinical Risk Index":
      return <Flame className="h-6 w-6 text-red-600" />;
    case "Psychological Safety Index":
      return <Shield className="h-6 w-6 text-blue-600" />;
    case "Workload & Efficiency":
      return <TrendingUp className="h-6 w-6 text-orange-600" />;
    case "Leadership & Alignment":
      return <Users className="h-6 w-6 text-purple-600" />;
    case "Satisfaction & Engagement":
      return <Smile className="h-6 w-6 text-green-600" />;
    default:
      return null;
  }
}

function ScoreCard({
  title,
  score,
  icon,
  participantCount,
}: {
  title: string;
  score: number;
  icon: ReactNode;
  participantCount: number;
}) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold text-blue-600">{score}%</p>
      <p className="text-muted-foreground mt-2 text-xs">{participantCount} responses</p>
    </Card>
  );
}

export default function ExecutiveSummaryComponent() {
  const [filters, setFilters] = useState<FilterState>({
    stream: "",
    function: "",
    department: "",
    age: "",
    gender: "",
    location: "",
  });

  // State to hold parsed stream, function, and department values
  const [parsedFilters, setParsedFilters] = useState({
    stream: "",
    fn: "",
    department: "",
  });

  useEffect(() => {
    // Extract stream, function, and department from the hierarchical department filter
    let stream = "";
    let fn = "";
    let department = "";

    if (filters.department) {
      const parts = filters.department.split(" > ");
      // Only set values if they exist in the split parts
      if (parts.length >= 1) stream = parts[0];
      if (parts.length >= 2) fn = parts[1];
      if (parts.length >= 3) department = parts[2];
    }

    // Update the parsed filters state
    setParsedFilters({ stream, fn, department });
  }, [filters]);

  // Use the same API hook as the surveys page
  const { data, isLoading, isFetching, isError } = useGetAllSurveyStatisticsForOrganizationQuery({
    stream: parsedFilters.stream || undefined,
    fn: parsedFilters.fn || undefined,
    department: parsedFilters.department || undefined,
    age: filters.age || undefined,
    gender: filters.gender || undefined,
    location: filters.location || undefined,
  });

  const apiData = data?.data?.data;

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    // When stream changes, reset function and department
    if (key === "stream") {
      setFilters((prev) => ({
        ...prev,
        stream: value,
        function: "",
        department: "",
      }));
    }
    // When function changes, reset department
    else if (key === "function") {
      setFilters((prev) => ({
        ...prev,
        function: value,
        department: "",
      }));
    }
    // For all other filters, just update the specific value
    else {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      stream: "",
      function: "",
      department: "",
      age: "",
      gender: "",
      location: "",
    });
  };

  // Check if any filter is applied
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  // Check if rollUp is active (matching clinical risk index page)

  // Mental health metrics data for the MentalHealthMetrics component
  const mentalHealthMetricsForComponent = apiData?.mentalHealthMetrics
    ? apiData.mentalHealthMetrics.map((metric: MentalHealthMetric) => ({
        domain: metric.domain,
        avgRisk: metric.dashboardDomainAverage.averageRiskScore,
        riskPercent: metric.dashboardDomainAverage.averageRiskScore,
        surveyCount: metric.participants,
        highRiskCount: metric.highRiskSurveyCount,
        nonHighRiskCount: metric.nonHighRiskSurveyCount,
        satisfactionScore: metric.dashboardDomainAverage.averageSatisfactionScore,
        riskLevel: metric.dashboardDomainAverage.averageSatisfactionStatus,
      }))
    : [];

  // Domain data for charts
  const domainChartData = apiData?.mentalHealthMetrics
    ? apiData.mentalHealthMetrics.map((metric: MentalHealthMetric) => ({
        name: metric.domain,
        riskPercent: metric.dashboardDomainAverage.averageRiskScore,
        satisfactionScore: metric.dashboardDomainAverage.averageSatisfactionScore,
        highRiskCount: metric.highRiskSurveyCount,
        avgRisk: metric.dashboardDomainAverage.averageRiskScore,
      }))
    : [];

  // Age distribution data
  const ageChartData = apiData?.ageStats
    ? apiData.ageStats.map(
        (age: {
          ageGroup: string;
          people: number;
          peoplePercent: number;
          riskScore: number;
          satisfactionScore: number;
        }) => ({
          name: age.ageGroup,
          participants: age.people,
          riskScore: age.riskScore,
          satisfaction: age.satisfactionScore,
        }),
      )
    : [];

  // Gender distribution data
  const genderChartData = apiData?.genderStats
    ? apiData.genderStats.map(
        (gender: {
          gender: string;
          people: number;
          peoplePercent: number;
          riskScore: number;
          satisfactionScore: number;
        }) => ({
          name: gender.gender,
          participants: gender.people,
          riskScore: gender.riskScore,
          satisfaction: gender.satisfactionScore,
          percentage: gender.peoplePercent,
        }),
      )
    : [];

  // Stream performance data
  const streamChartData = apiData?.streamStats
    ? apiData.streamStats.map(
        (dept: {
          stream: string;
          totalResponses: number;
          departmentPercent: number;
          avgRisk: number;
          satisfactionScore: number;
          highRiskCount: number;
        }) => ({
          name: dept.stream,
          satisfaction: dept.satisfactionScore,
          risk: dept.avgRisk,
          responses: dept.totalResponses,
          highRiskCount: dept.highRiskCount,
        }),
      )
    : [];

  // Function performance data
  const functionChartData = apiData?.functionStats
    ? apiData.functionStats.map(
        (func: {
          function: string;
          totalResponses: number;
          functionPercent: number;
          avgRisk: number;
          satisfactionScore: number;
          highRiskCount: number;
        }) => ({
          name: func.function,
          satisfaction: func.satisfactionScore,
          risk: func.avgRisk,
          responses: func.totalResponses,
          highRiskCount: func.highRiskCount,
        }),
      )
    : [];

  // Department performance data
  const departmentChartData = apiData?.departmentStats
    ? apiData.departmentStats.map(
        (dept: {
          department: string;
          totalResponses: number;
          departmentPercent: number;
          avgRisk: number;
          satisfactionScore: number;
          highRiskCount: number;
        }) => ({
          name: dept.department,
          satisfaction: dept.satisfactionScore,
          risk: dept.avgRisk,
          responses: dept.totalResponses,
          highRiskCount: dept.highRiskCount,
        }),
      )
    : [];

  // Risk distribution pie data
  let noRiskCount = 0;
  let lowRiskCount = 0;
  let mediumRiskCount = 0;
  let highRiskCount = 0;

  if (apiData?.mentalHealthMetrics) {
    apiData.mentalHealthMetrics.forEach((metric: MentalHealthMetric) => {
      if (metric.dashboardDomainAverage.averageSatisfactionScore >= 85) {
        noRiskCount += metric.participants;
      } else if (metric.dashboardDomainAverage.averageSatisfactionScore >= 70) {
        lowRiskCount += metric.participants;
      } else if (metric.dashboardDomainAverage.averageSatisfactionScore >= 50) {
        mediumRiskCount += metric.participants;
      } else {
        highRiskCount += metric.participants;
      }
    });
  }

  const riskDistributionData = [
    { name: "No Risk", value: noRiskCount, color: COLORS.noRisk },
    { name: "Low Risk", value: lowRiskCount, color: COLORS.lowRisk },
    { name: "Medium Risk", value: mediumRiskCount, color: COLORS.mediumRisk },
    { name: "High Risk", value: highRiskCount, color: COLORS.highRisk },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AutoStepLoader />
      </div>
    );
  }

  if (isError || !apiData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-600">Failed to load data. Please try again.</div>
      </div>
    );
  }

  const mentalHealthMetrics = apiData.mentalHealthMetrics || [];
  const indices = mentalHealthMetrics.map((metric: MentalHealthMetric) => {
    if (metric.domain === "Clinical Risk Index") {
      return {
        ...metric,
        satisfiedScore: metric.dashboardDomainAverage.averageRiskScore,
        icon: getIcon(metric.domain),
      };
    } else {
      return {
        ...metric,
        icon: getIcon(metric.domain),
      };
    }
  });

  const overallSatisfaction =
    mentalHealthMetrics.reduce(
      (acc: number, current: MentalHealthMetric) => acc + current.satisfiedScore,
      0,
    ) / mentalHealthMetrics.length;

  const isRollUpActiveFlag = data?.data?.data?.rollUp || false;

  return (
    <main className="min-h-screen">
      <div className="mx-auto px-4 py-8 md:px-8">
        {/* Organization Header */}
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-foreground text-xl font-bold md:text-3xl">
                {apiData.organization.name} - Mental Health Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Organization Survey Statistics</p>
            </div>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-4">
              <HierarchicalFilter
                value={filters.department || ""}
                onChange={(value: string) => handleFilterChange("department", value)}
                departments={departments}
                placeholder="Bulk Filter by Stream, Function, Department"
              />
            </div>

            <SelectInput
              value={filters.location}
              onChange={(value) => handleFilterChange("location", value)}
              options={locationOptions}
              placeholder="All Locations"
            />

            {/* Age Selection */}
            <SelectInput
              value={filters.age}
              onChange={(value) => handleFilterChange("age", value)}
              options={ageOptions}
              placeholder="All Ages"
            />

            {/* Gender Selection */}
            <SelectInput
              value={filters.gender}
              onChange={(value) => handleFilterChange("gender", value)}
              options={genderOptions}
              placeholder="All Genders"
            />
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.stream && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  Stream: {filters.stream}
                </span>
              )}
              {filters.function && (
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                  Function: {filters.function}
                </span>
              )}
              {filters.department && apiData?.appliedFilters?.includes("unitDepartment") && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                  Department: {filters.department}
                </span>
              )}
              {filters.age && apiData?.appliedFilters?.includes("age") && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  Age: {filters.age}
                </span>
              )}
              {filters.gender && apiData?.appliedFilters?.includes("gender") && (
                <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-800">
                  Gender: {filters.gender}
                </span>
              )}
              {filters.location && apiData?.appliedFilters?.includes("location") && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                  Location: {filters.location}
                </span>
              )}

              {/* Roll Up / Actual Badge */}
              <span
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                  isRollUpActiveFlag
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {isRollUpActiveFlag ? "Roll Up" : "Actual"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <section>
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Key Performance Indicators
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              {indices
                // .filter(
                //   (item: ScoreCardType) =>
                //     !["Psychological Safety Index", "Satisfaction & Engagement"].includes(
                //       item.domain,
                //     ),
                // )
                .map((index: ScoreCardType) => (
                  <ScoreCard
                    key={index.domain}
                    title={index.domain}
                    score={
                      index.domain == "Clinical Risk Index"
                        ? index?.dashboardDomainAverage?.averageRiskScore
                        : index?.dashboardDomainAverage?.averageSatisfactionScore
                    }
                    icon={index.icon}
                    participantCount={apiData.totalParticipants}
                  />
                ))}
            </div>
          </section>

          {/* Summary Statistics */}
          <section>
            <h2 className="text-foreground mb-4 text-lg font-semibold">Summary Statistics</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              <Card className="bg-blue-50 p-6 dark:bg-blue-950">
                <div className="mb-2 flex items-center gap-3">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  <h3 className="text-foreground text-sm font-semibold md:text-lg">
                    Total Participants
                  </h3>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {apiData.totalParticipants}
                </p>
              </Card>
            </div>
          </section>

          {/* Mental Health Metrics Component with Circular Charts */}
          <ExecutiveMentalHealthMetrics
            metrics={mentalHealthMetricsForComponent}
            // unitName={filters.department || "All Departments"}
            domainChartData={domainChartData}
            riskDistributionData={riskDistributionData}
          />

          {/* Age Group Analysis */}
          <AgeGroupAnalysis ageChartData={ageChartData} unitName="All Departments" />

          {/* Participants Distribution */}
          <section>
            <div className="grid grid-cols-1 gap-6">
              {/* Gender Analysis */}
              <Card className="shadow-xl">
                <div className="p-6">
                  <h2 className="text-foreground mb-6 text-lg font-semibold">
                    <PieChartIcon className="mr-2 inline h-5 w-5 text-amber-600" />
                    Gender Analysis
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={genderChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="participants"
                        name="Participants"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="riskScore"
                        name="Risk Score"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="satisfaction"
                        name="Satisfaction"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>

          {/* Department Analysis */}
          <DepartmentAnalysis
            departmentChartData={streamChartData}
            unitName="All Streams"
            title="Stream Analysis"
            comparison="Stream Comparison"
          />
          <DepartmentAnalysis
            departmentChartData={functionChartData}
            unitName="All Functions"
            title="Function Analysis"
            comparison="Function Comparison"
          />
          <DepartmentAnalysis
            departmentChartData={departmentChartData}
            unitName="All Departments"
            title="Department Analysis"
            comparison="Department Comparison"
          />

          {/* Satisfaction Score Trend by Domain */}
          <section>
            <Card className="shadow-xl">
              <div className="p-6">
                <h2 className="text-foreground mb-6 text-lg font-semibold">
                  <TrendingUp className="mr-2 inline h-5 w-5 text-purple-600" />
                  Satisfaction Score Trend by Domain
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={domainChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="satisfactionScore"
                      name="Satisfaction Score"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          {/* Location Breakdown */}
          <section>
            <Card className="p-6">
              <h3 className="text-foreground mb-4 font-semibold">Location Breakdown</h3>
              <div className="space-y-3">
                {apiData.locationStats.map(
                  (loc: {
                    location: string;
                    totalResponses: number;
                    locationPercent: number;
                    avgRisk: number;
                    satisfactionScore: number;
                  }) => (
                    <div
                      key={loc.location}
                      className="flex items-center justify-between border-b pb-3 last:border-b-0"
                    >
                      <div>
                        <p className="text-foreground font-medium capitalize">{loc.location}</p>
                        <p className="text-muted-foreground text-sm">
                          {loc.totalResponses} responses ({loc.locationPercent}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground font-semibold">
                          {loc.satisfactionScore.toFixed(1)}%
                        </p>
                        <p className="text-muted-foreground text-xs">Satisfaction</p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>
          </section>

          {/* Privacy Notice */}
          <Card className="border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
            <div className="flex items-start gap-3">
              <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="text-foreground mb-2 font-semibold">
                  Data Privacy & Anonymity Commitment
                </h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  We are committed to protecting employee privacy. All survey responses are
                  anonymized and aggregated to ensure individual identities cannot be determined.
                  Data points with fewer than 4 participants are automatically combined with broader
                  categories to maintain anonymity.
                </p>
                <div className="rounded-lg bg-blue-100 p-3 text-xs text-blue-900 dark:bg-blue-900 dark:text-blue-100">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span>
                      <span className="font-semibold">
                        {apiData.totalParticipants} total participants
                      </span>{" "}
                      across all departments and locations
                    </span>
                    <span className="hidden sm:block">•</span>
                    <span>All data meets minimum anonymity threshold requirements</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
