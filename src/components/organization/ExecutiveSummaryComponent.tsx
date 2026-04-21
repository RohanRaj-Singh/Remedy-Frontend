"use client";

import DashboardFilters, { FilterState, initialFilterState } from "@/components/dashboard/filter/DashboardFilters";
import AgeGroupAnalysis from "@/components/dashboard/adminDashboard/surveys/AgeGroupAnalysis";
import DepartmentAnalysis from "@/components/dashboard/adminDashboard/surveys/DepartmentAnalysis";
import ExecutiveMentalHealthMetrics from "@/components/dashboard/adminDashboard/surveys/ExecutiveMentalHealthMetrics";
import { Card } from "@/components/ui/card";
import AutoStepLoader from "@/components/ui/AutoStepLoader";
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
import { ReactNode, useCallback, useState } from "react";
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
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  const [filterKey, setFilterKey] = useState(0);

  const { data, isLoading, isFetching, isError } = useGetAllSurveyStatisticsForOrganizationQuery({
    stream: appliedFilters.stream || undefined,
    fn: appliedFilters.fn || undefined,
    department: appliedFilters.department || undefined,
    age: appliedFilters.age || undefined,
    gender: appliedFilters.gender || undefined,
    location: appliedFilters.location || undefined,
  });

  const apiData = data?.data?.data;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "stream") {
        updated.location = "";
        updated.fn = "";
        updated.department = "";
      } else if (key === "location") {
        updated.fn = "";
        updated.department = "";
      } else if (key === "fn") {
        updated.department = "";
      }
      return updated;
    });
  };

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setFilterKey(prev => prev + 1);
  }, [filters]);

  const resetFilters = () => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setFilterKey(prev => prev + 1);
  };

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

  const domainChartData = apiData?.mentalHealthMetrics
    ? apiData.mentalHealthMetrics.map((metric: MentalHealthMetric) => ({
        name: metric.domain,
        riskPercent: metric.dashboardDomainAverage.averageRiskScore,
        satisfactionScore: metric.dashboardDomainAverage.averageSatisfactionScore,
        highRiskCount: metric.highRiskSurveyCount,
        avgRisk: metric.dashboardDomainAverage.averageRiskScore,
      }))
    : [];

  const ageChartData = apiData?.ageStats
    ? apiData.ageStats.map(
        (age: { ageGroup: string; people: number; peoplePercent: number; riskScore: number; satisfactionScore: number }) => ({
          name: age.ageGroup,
          participants: age.people,
          riskScore: age.riskScore,
          satisfaction: age.satisfactionScore,
        }),
      )
    : [];

  const genderChartData = apiData?.genderStats
    ? apiData.genderStats.map(
        (gender: { gender: string; people: number; peoplePercent: number; riskScore: number; satisfactionScore: number }) => ({
          name: gender.gender,
          participants: gender.people,
          riskScore: gender.riskScore,
          satisfaction: gender.satisfactionScore,
          percentage: gender.peoplePercent,
        }),
      )
    : [];

  const streamChartData = apiData?.streamStats
    ? apiData.streamStats.map(
        (dept: { stream: string; totalResponses: number; departmentPercent: number; avgRisk: number; satisfactionScore: number; highRiskCount: number }) => ({
          name: dept.stream,
          satisfaction: dept.satisfactionScore,
          risk: dept.avgRisk,
          responses: dept.totalResponses,
          highRiskCount: dept.highRiskCount,
        }),
      )
    : [];

  const functionChartData = apiData?.functionStats
    ? apiData.functionStats.map(
        (func: { function: string; totalResponses: number; functionPercent: number; avgRisk: number; satisfactionScore: number; highRiskCount: number }) => ({
          name: func.function,
          satisfaction: func.satisfactionScore,
          risk: func.avgRisk,
          responses: func.totalResponses,
          highRiskCount: func.highRiskCount,
        }),
      )
    : [];

  const departmentChartData = apiData?.departmentStats
    ? apiData.departmentStats.map(
        (dept: { department: string; totalResponses: number; departmentPercent: number; avgRisk: number; satisfactionScore: number; highRiskCount: number }) => ({
          name: dept.department,
          satisfaction: dept.satisfactionScore,
          risk: dept.avgRisk,
          responses: dept.totalResponses,
          highRiskCount: dept.highRiskCount,
        }),
      )
    : [];

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

  const isRollUpActiveFlag = data?.data?.data?.rollUp || false;

  return (
    <main className="min-h-screen">
      <div className="mx-auto px-4 py-8 md:px-8">
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-foreground text-xl font-bold md:text-3xl">
                {apiData.organization.name} - Mental Health Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Organization Survey Statistics</p>
            </div>
          </div>

<DashboardFilters
              key={filterKey}
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={resetFilters}
              isLoading={isFetching}
              rollUpActive={isRollUpActiveFlag}
            />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Key Performance Indicators
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              {indices.map((index: ScoreCardType) => (
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

          <ExecutiveMentalHealthMetrics
            metrics={mentalHealthMetricsForComponent}
            domainChartData={domainChartData}
            riskDistributionData={riskDistributionData}
          />

          <AgeGroupAnalysis ageChartData={ageChartData} unitName="All Departments" />

          <section>
            <div className="grid grid-cols-1 gap-6">
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
                    <XAxis dataKey="name" angle={0} textAnchor="end" height={60} fontSize={10} />
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

          <section>
            <Card className="p-6">
              <h3 className="text-foreground mb-4 font-semibold">Location Breakdown</h3>
              <div className="space-y-3">
                {apiData.locationStats.map(
                  (loc: { location: string; totalResponses: number; locationPercent: number; avgRisk: number; satisfactionScore: number }) => (
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
                      <span className="font-semibold">{apiData.totalParticipants} total participants</span>{" "}
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