"use client";

import AgeGroupAnalysis from "@/components/dashboard/adminDashboard/surveys/AgeGroupAnalysis";
import DepartmentAnalysis from "@/components/dashboard/adminDashboard/surveys/DepartmentAnalysis";
import GenderAnalysis from "@/components/dashboard/adminDashboard/surveys/GenderAnalysis";
import MentalHealthMetrics from "@/components/dashboard/adminDashboard/surveys/MentalHealthMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectInput from "@/components/ui/SelectInput";
import streamLocationMapping from "@/data/streamLocationMapping.json";
import { ageOptions, departments, genderOptions, locationOptions } from "@/data/survey";
import { useGetAllSurveyStatisticsForOrganizationQuery } from "@/redux/api/apis/surveyApi";
import { DashboardData } from "@/typesAndIntefaces/AdminSurveyTypes";
import { AlertCircle, Smile, Target, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Vibrant color palette for risk levels
const COLORS = {
  noRisk: "#10b981", // Green
  lowRisk: "#3b82f6", // Blue
  mediumRisk: "#f59e0b", // Yellow/Orange
  highRisk: "#ef4444", // Red
  completed: "#3b82f6",
  satisfaction: "#8b5cf6",
};

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

interface FilterState {
  stream: string;
  function: string;
  department: string;
  age: string;
  gender: string;
  location: string;
}

export default function OrganizationAllSurveyResult() {
  const mapping = streamLocationMapping as Record<string, Record<string, Record<string, string[]>>>;

  const locationDisplayMap: Record<string, string> = {
    block60: "B60",
    msusundam: "Musandam",
    headOffice: "Muscat",
  };

  const [filters, setFilters] = useState<FilterState>({
    stream: "",
    function: "",
    department: "",
    age: "",
    gender: "",
    location: "",
  });

  const availableStreams = Array.from(
    new Set([...departments.map((s) => s.stream), ...Object.keys(mapping)]),
  );

  const availableLocations = filters.stream ? Object.keys(mapping[filters.stream] || {}) : [];

  const availableFunctions =
    filters.stream && filters.location
      ? Object.keys(mapping[filters.stream]?.[filters.location] || {})
      : [];

  const availableDepartments =
    filters.stream && filters.location && filters.function
      ? mapping[filters.stream]?.[filters.location]?.[filters.function] || []
      : [];

  // Use the query hook with filters as parameters - backend will handle filtering
  const { data, isLoading, isError } = useGetAllSurveyStatisticsForOrganizationQuery(
    {
      stream: filters.stream || undefined,
      fn: filters.function || undefined,
      department: filters.department || undefined,
      age: filters.age,
      gender: filters.gender,
      location: filters.location,
    },
    {
      pollingInterval: 10000,
    },
  );

  const dashboardData: DashboardData | undefined = data?.data?.data;

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    // When stream changes, reset location/function/department
    if (key === "stream") {
      setFilters((prev) => ({
        ...prev,
        stream: value,
        location: "",
        function: "",
        department: "",
      }));
    }
    // When location changes, reset function and department
    else if (key === "location") {
      setFilters((prev) => ({
        ...prev,
        location: value,
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

  // Key metrics calculations - using data directly from backend
  const keyMetrics = useMemo(() => {
    if (!dashboardData) return null;

    const totalHighRisk = dashboardData.totalHighRiskSurveys;
    const avgSatisfaction =
      dashboardData.mentalHealthMetrics.reduce((sum, metric) => sum + metric.satisfiedScore, 0) /
      dashboardData.mentalHealthMetrics.length;

    const highestRiskDomain = dashboardData.mentalHealthMetrics.reduce(
      (highest, metric) => (metric.riskScore > highest.riskScore ? metric : highest),
      dashboardData.mentalHealthMetrics[0],
    );

    return {
      totalParticipants: dashboardData?.totalParticipants,
      totalHighRisk,
      avgSatisfaction,
      highestRiskDomain: highestRiskDomain?.domain,
      highestRiskPercent: highestRiskDomain?.riskScore,
    };
  }, [dashboardData]);

  const mentalHealthMetricsData = useMemo((): MentalHealthMetric[] => {
    if (!dashboardData?.mentalHealthMetrics) return [];

    return dashboardData.mentalHealthMetrics.map((metric) => ({
      domain: metric.domain,
      avgRisk: metric.riskScore,
      riskPercent: metric.riskScore,
      surveyCount: metric.participants,
      highRiskCount: metric.highRiskSurveyCount,
      nonHighRiskCount: metric.nonHighRiskSurveyCount,
      satisfactionScore: metric.satisfiedScore,
      riskLevel: metric.riskStatus,
    }));
  }, [dashboardData]);

  // Domain data for charts - using data directly from backend
  const domainChartData = useMemo(() => {
    if (!dashboardData?.mentalHealthMetrics) return [];
    return dashboardData.mentalHealthMetrics.map((metric) => ({
      name: metric.domain,
      riskPercent: metric.riskScore,
      satisfactionScore: metric.satisfiedScore,
      highRiskCount: metric.highRiskSurveyCount,
      avgRisk: metric.riskScore,
    }));
  }, [dashboardData]);

  // Age distribution data - using data directly from backend
  const ageChartData = useMemo(() => {
    if (!dashboardData?.ageStats) return [];
    return dashboardData.ageStats.map((age) => ({
      name: age.ageGroup,
      participants: age.people,
      riskScore: age.riskScore,
      satisfaction: age.satisfactionScore,
    }));
  }, [dashboardData]);

  // Gender distribution data - using data directly from backend
  const genderChartData = useMemo(() => {
    if (!dashboardData?.genderStats) return [];
    return dashboardData.genderStats.map((gender) => ({
      name: gender.gender,
      participants: gender.people,
      riskScore: gender.riskScore,
      satisfaction: gender.satisfactionScore,
      percentage: gender.peoplePercent,
    }));
  }, [dashboardData]);

  // Department performance data - using data directly from backend
  const departmentChartData = useMemo(() => {
    if (!dashboardData?.departmentStats) return [];
    return dashboardData.departmentStats.map((dept) => ({
      name: dept.department,
      satisfaction: dept.satisfactionScore,
      risk: dept.avgRisk,
      responses: dept.totalResponses,
      highRiskCount: dept.highRiskCount,
    }));
  }, [dashboardData]);

  // Risk distribution pie data - using data directly from backend
  const riskDistributionData = useMemo(() => {
    if (!dashboardData?.mentalHealthMetrics) return [];

    // Calculate counts for each risk level based on new criteria
    let noRiskCount = 0;
    let lowRiskCount = 0;
    let mediumRiskCount = 0;
    let highRiskCount = 0;

    dashboardData.mentalHealthMetrics.forEach((metric) => {
      if (metric.satisfiedScore >= 85) {
        noRiskCount += metric.participants;
      } else if (metric.satisfiedScore >= 70) {
        lowRiskCount += metric.participants;
      } else if (metric.satisfiedScore >= 50) {
        mediumRiskCount += metric.participants;
      } else {
        highRiskCount += metric.participants;
      }
    });

    return [
      { name: "No Risk", value: noRiskCount, color: COLORS.noRisk },
      { name: "Low Risk", value: lowRiskCount, color: COLORS.lowRisk },
      { name: "Medium Risk", value: mediumRiskCount, color: COLORS.mediumRisk },
      { name: "High Risk", value: highRiskCount, color: COLORS.highRisk },
    ];
  }, [dashboardData]);

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

  // Check if any filter is active
  const isFilterActive =
    filters.stream !== "" ||
    filters.function !== "" ||
    filters.department !== "" ||
    filters.age !== "" ||
    filters.gender !== "" ||
    filters.location !== "";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 md:p-8">
        <div className="text-lg font-medium text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 md:p-8">
        <div className="text-red-600">Failed to load data. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden p-0 md:p-8">
      <div className="mx-auto space-y-8">
        <div className="mb-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-900 md:text-2xl lg:text-3xl">
                Mental Health & Wellbeing
              </h1>
              <p className="text-md mt-2 text-gray-600 md:text-lg">
                Comprehensive analysis of employee mental health metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isFilterActive && (
                <button
                  onClick={resetFilters}
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
            <SelectInput
              value={filters.stream}
              onChange={(value) => handleFilterChange("stream", value)}
              options={availableStreams
                .map((stream) => ({
                  label: stream,
                  value: stream,
                }))
                .slice()}
              placeholder="Filter by Stream"
            />

            <SelectInput
              value={filters.age}
              onChange={(value) => handleFilterChange("age", value)}
              options={[...ageOptions.map((age) => ({ label: age.label, value: age.value }))]}
              placeholder="Filter by Age"
            />

            <SelectInput
              value={filters.gender}
              onChange={(value) => handleFilterChange("gender", value)}
              options={[
                ...genderOptions.map((gender) => ({ label: gender.label, value: gender.value })),
              ]}
              placeholder="Filter by Gender"
            />

            <SelectInput
              value={filters.location}
              onChange={(value) => handleFilterChange("location", value)}
              options={
                filters.stream
                  ? availableLocations.map((loc) => ({
                      label: locationDisplayMap[loc] || loc,
                      value: loc,
                    }))
                  : [...locationOptions.map((location) => ({ label: location.label, value: location.value }))]
              }
              placeholder="Filter by Location"
            />
          </div>

          {(filters.stream || filters.function || filters.department) && (
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
              {filters.stream && filters.location && (
                <SelectInput
                  value={filters.function}
                  onChange={(value) => handleFilterChange("function", value)}
                  options={availableFunctions
                    .map((func) => ({
                      label: func,
                      value: func,
                    }))
                    .slice()}
                  placeholder="Filter by Function"
                />
              )}

              {filters.stream && filters.location && filters.function && (
                <SelectInput
                  value={filters.department}
                  onChange={(value) => handleFilterChange("department", value)}
                  options={availableDepartments
                    .map((dept) => ({
                      label: dept,
                      value: dept,
                    }))
                    .slice()} // Convert readonly array to mutable array
                  placeholder="Filter by Department"
                />
              )}
            </div>
          )}

          {isFilterActive && (
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
              {filters.department && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  Department: {filters.department}
                </span>
              )}
              {filters.age && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  Age: {filters.age}
                </span>
              )}
              {filters.gender && (
                <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
                  Gender: {filters.gender}
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                  Location: {filters.location}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Users className="h-5 w-5 text-blue-600" />
                Total Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {keyMetrics?.totalParticipants || 0}
              </div>
              <p className="mt-1 text-sm text-gray-500">Active surveys completed</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Smile className="h-5 w-5 text-green-600" />
                Avg Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {(keyMetrics?.avgSatisfaction && keyMetrics?.avgSatisfaction?.toFixed(1)) || 0}%
              </div>
              <p className="mt-1 text-sm text-gray-500">Overall wellbeing score</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <AlertCircle className="h-5 w-5 text-red-600" />
                High Risk Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {keyMetrics?.totalHighRisk || 0}
              </div>
              <p className="mt-1 text-sm text-gray-500">Requiring attention</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Target className="h-5 w-5 text-amber-600" />
                Highest Risk Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="truncate text-2xl font-bold text-gray-900">
                {keyMetrics?.highestRiskPercent || 0}%
              </div>
              <p className="mt-1 text-sm text-gray-500">{keyMetrics?.highestRiskDomain || "N/A"}</p>
            </CardContent>
          </Card>
        </div>

        <MentalHealthMetrics
          metrics={mentalHealthMetricsData}
          unitName={
            filters.stream && filters.function && filters.department
              ? `${filters.stream} > ${filters.function} > ${filters.department}`
              : filters.stream && filters.function
                ? `${filters.stream} > ${filters.function}`
                : filters.stream
                  ? filters.stream
                  : filters.department || "All Departments"
          }
          domainChartData={domainChartData}
          riskDistributionData={riskDistributionData}
        />

        <AgeGroupAnalysis
          ageChartData={ageChartData}
          unitName={
            filters.stream && filters.function && filters.department
              ? `${filters.stream} > ${filters.function} > ${filters.department}`
              : filters.stream && filters.function
                ? `${filters.stream} > ${filters.function}`
                : filters.stream
                  ? filters.stream
                  : filters.department || "All Departments"
          }
        />

        <GenderAnalysis
          genderChartData={genderChartData}
          unitName={
            filters.stream && filters.function && filters.department
              ? `${filters.stream} > ${filters.function} > ${filters.department}`
              : filters.stream && filters.function
                ? `${filters.stream} > ${filters.function}`
                : filters.stream
                  ? filters.stream
                  : filters.department || "All Departments"
          }
        />

        <DepartmentAnalysis
          departmentChartData={departmentChartData}
          unitName={
            filters.stream && filters.function && filters.department
              ? `${filters.stream} > ${filters.function} > ${filters.department}`
              : filters.stream && filters.function
                ? `${filters.stream} > ${filters.function}`
                : filters.stream
                  ? filters.stream
                  : filters.department || "All Departments"
          }
        />

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              Satisfaction Score Trend by Domain
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={domainChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={0} textAnchor="end" height={40} fontSize={12} />
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
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
