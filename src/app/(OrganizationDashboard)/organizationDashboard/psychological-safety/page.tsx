"use client";

import { FearBlameChart } from "@/components/dashboard/organizationDashboard/FearBlameChart";
import { RankingTable } from "@/components/dashboard/organizationDashboard/RankingTable";
import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectInput from "@/components/ui/SelectInput";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, Shield, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import HierarchicalFilter from "@/components/dashboard/filter/HierarchicalFilter";
import { ageOptions, departments, genderOptions, locationOptions } from "@/data/survey";
import { ScoreCard } from "./../../../../components/dashboard/organizationDashboard/ScoreCard";

interface PsychologicalDomain {
  domain: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
}

interface DepartmentSummary {
  department: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
}

interface FilterState {
  stream: string;
  function: string;
  department: string;
  age: string;
  gender: string;
  location: string;
}

export default function PsychologicalSafetyPage() {
  const [filters, setFilters] = useState<FilterState>({
    stream: "",
    function: "",
    department: "",
    age: "",
    gender: "",
    location: "",
  });

  const [getSubdomainStats, { data: subdomainData, isLoading }] = useGetSubdomainStatsMutation();

  // Get available functions based on selected stream
  const availableFunctions = departments.find((d) => d.stream === filters.stream)?.functions || [];

  // Get available departments based on selected stream and function
  const availableDepartments =
    availableFunctions.find((f) => f.function === filters.function)?.departments || [];

  // Fetch subdomain data whenever filters change
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

    getSubdomainStats({
      dashboardDomain: "Psychological Safety Index",
      stream: stream || undefined,
      fn: fn || undefined,
      department: department || undefined,
      age: filters.age || undefined,
      gender: filters.gender || undefined,
      location: filters.location || undefined,
    });
  }, [filters, getSubdomainStats]);

  const psychologicalSubdomainData = subdomainData?.data;

  // Create department stats from subdomain data instead of raw data
  const departmentStats = useMemo(() => {
    if (!psychologicalSubdomainData?.departmentSummary) return [];

    // Sort by satisfaction score (highest to lowest)
    return [...psychologicalSubdomainData.departmentSummary]
      .sort((a, b) => b.satisfiedScore - a.satisfiedScore)
      .map((dept: DepartmentSummary) => ({
        department: dept.department,
        satisfactionScore: dept.satisfiedScore,
        riskScore: dept.riskScore,
      }));
  }, [psychologicalSubdomainData]);

  // Prepare data for the fear/blame chart
  const fearBlameChartData = useMemo(() => {
    if (!psychologicalSubdomainData?.domainSummary) return [];

    return psychologicalSubdomainData.domainSummary.map((domain: PsychologicalDomain) => ({
      name: domain.domain,
      value: Number(domain.satisfiedScore),
      isSatisfactionScore: true,
    }));
  }, [psychologicalSubdomainData]);

  // Ensure the variable is always defined
  const safeFearBlameChartData = fearBlameChartData || [];

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

  // Check if any filter is active
  const isFilterActive =
    filters.stream !== "" ||
    filters.function !== "" ||
    filters.department !== "" ||
    filters.age !== "" ||
    filters.gender !== "" ||
    filters.location !== "";

  // Check anonymity rule
  const hasInsufficientData = (psychologicalSubdomainData?.totalParticipants || 0) < 4;

  // Extract stream, function, and department from the hierarchical department filter for the FearBlameChart
  const chartStream = useMemo(() => {
    if (filters.department && filters.department.includes(" > ")) {
      const parts = filters.department.split(" > ");
      return parts[0] || undefined;
    }
    return filters.department || undefined;
  }, [filters.department]);

  const chartFunction = useMemo(() => {
    if (filters.department && filters.department.includes(" > ")) {
      const parts = filters.department.split(" > ");
      return parts[1] || undefined;
    }
    return undefined;
  }, [filters.department]);

  const chartDepartment = useMemo(() => {
    if (filters.department && filters.department.includes(" > ")) {
      const parts = filters.department.split(" > ");
      return parts[2] || undefined;
    }
    return undefined;
  }, [filters.department]);

  return (
    <div className="flex">
      <main className="min-h-screen flex-1">
        <div className="mx-auto px-4 py-8 md:px-8">
          <div className="mb-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-foreground text-xl font-bold md:text-3xl">
                  Psychological Safety Index
                </h1>
                <p className="text-muted-foreground mt-2">
                  Assessment of employee trust, open communication, and interpersonal safety
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
                options={[{ label: "All Locations", value: "" }, ...locationOptions]}
                placeholder="Filter by Location"
              />

              <SelectInput
                value={filters.stream}
                onChange={(value) => handleFilterChange("stream", value)}
                options={departments
                  .map((stream) => ({
                    label: stream.stream,
                    value: stream.stream,
                  }))
                  .slice()} // Convert readonly array to mutable array
                placeholder="Filter by Stream"
              />

              <SelectInput
                value={filters.age}
                onChange={(value) => handleFilterChange("age", value)}
                options={[...ageOptions]}
                placeholder="Filter by Age"
              />

              <SelectInput
                value={filters.gender}
                onChange={(value) => handleFilterChange("gender", value)}
                options={[...genderOptions]}
                placeholder="Filter by Gender"
              />
            </div>

            {(filters.stream || filters.function || filters.department) && (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
                {filters.stream && (
                  <SelectInput
                    value={filters.function}
                    onChange={(value) => handleFilterChange("function", value)}
                    options={availableFunctions
                      .map((func) => ({
                        label: func.function,
                        value: func.function,
                      }))
                      .slice()} // Convert readonly array to mutable array
                    placeholder="Filter by Function"
                  />
                )}

                {filters.stream && filters.function && (
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
                {filters.department && (
                  <>
                    {filters.department.includes(" > ") ? (
                      (() => {
                        const parts = filters.department.split(" > ");
                        return (
                          <>
                            {parts[0] && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                Stream: {parts[0]}
                              </span>
                            )}
                            {parts[1] && (
                              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                                Function: {parts[1]}
                              </span>
                            )}
                            {parts[2] && (
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                                Department: {parts[2]}
                              </span>
                            )}
                          </>
                        );
                      })()
                    ) : (
                      // If there's a department value but no " > ", it's just a stream
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        Stream: {filters.department}
                      </span>
                    )}
                  </>
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

                <span
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                    isFilterActive
                      ? subdomainData?.data?.rollUp
                        ? "bg-red-200 text-red-800"
                        : "bg-emerald-100 text-emerald-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {subdomainData?.data?.rollUp ? "Roll Up" : "Actual"}
                </span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-8">
              {hasInsufficientData && (
                <Card className="border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    Insufficient data to display results due to anonymity protection.
                  </p>
                </Card>
              )}

              {!hasInsufficientData && (
                <>
                  <div className="grid grid-cols-1">
                    <ScoreCard
                      title="Overall Psychological Safety"
                      score={
                        psychologicalSubdomainData?.dashboardDomainAverage?.averageSatisfactionScore
                      }
                      icon={<Shield className="h-6 w-6 text-blue-600" />}
                      participantCount={psychologicalSubdomainData?.totalParticipants || 0}
                    />
                  </div>

                  <section>
                    <h2 className="text-foreground mb-4 text-lg font-semibold">
                      Summary Statistics
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      <Card className="bg-blue-50 p-6 dark:bg-blue-950">
                        <div className="mb-2 flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <h3 className="text-foreground text-sm font-semibold md:text-lg">
                            Total Participants
                          </h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {psychologicalSubdomainData?.totalParticipants || 0}
                        </p>
                        <p className="text-muted-foreground mt-2 text-xs">Across all departments</p>
                      </Card>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <RankingTable
                      title="Department Rankings"
                      items={departmentStats}
                      description="Psychological Safety scores ranked from highest to lowest"
                    />
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-base font-semibold text-gray-900">
                          Fear/Blame Intensity Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FearBlameChart
                          title="Psychological Safety Domains"
                          description="Percentage of employees showing indicators for each psychological safety domain"
                          data={safeFearBlameChartData}
                          isLoading={isLoading}
                          stream={chartStream}
                          fn={chartFunction}
                          department={chartDepartment}
                          age={filters.age || undefined}
                          gender={filters.gender || undefined}
                          location={filters.location || undefined}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <RiskLegend />
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
