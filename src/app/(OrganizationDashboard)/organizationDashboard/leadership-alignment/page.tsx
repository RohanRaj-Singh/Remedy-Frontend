"use client";

import { BarChartComponent } from "@/components/dashboard/organizationDashboard/BarChart";
import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { ScoreCard } from "@/components/dashboard/organizationDashboard/ScoreCard";
import { Card } from "@/components/ui/card";
import SelectInput from "@/components/ui/SelectInput";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import HierarchicalFilter from "@/components/dashboard/filter/HierarchicalFilter";
import { ageOptions, departments, genderOptions, locationOptions } from "@/data/survey";

interface DepartmentSummary {
  department: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
}

interface GenderSummary {
  gender: string;
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

export default function LeadershipAlignmentPage() {
  const [filters, setFilters] = useState<FilterState>({
    stream: "",
    function: "",
    department: "",
    age: "",
    gender: "",
    location: "",
  });

  const availableFunctions = departments.find((d) => d.stream === filters.stream)?.functions || [];

  const availableDepartments =
    availableFunctions.find((f) => f.function === filters.function)?.departments || [];

  const [getSubdomainStats, { data: subdomainData, isLoading: isSubdomainLoading }] =
    useGetSubdomainStatsMutation();

  useEffect(() => {
    let stream = "";
    let fn = "";
    let department = "";

    if (filters.department) {
      const parts = filters.department.split(" > ");
      if (parts.length >= 1) stream = parts[0];
      if (parts.length >= 2) fn = parts[1];
      if (parts.length >= 3) department = parts[2];
    }

    getSubdomainStats({
      dashboardDomain: "Leadership & Alignment",
      stream: stream || undefined,
      fn: fn || undefined,
      department: department || undefined,
      age: filters.age || undefined,
      gender: filters.gender || undefined,
      location: filters.location || undefined,
    });
  }, [filters, getSubdomainStats]);

  const leadershipMetric = useMemo(() => {
    return subdomainData?.data?.domainSummary[0] || {};
  }, [subdomainData]);

  const genderComparisonData = useMemo(() => {
    if (!subdomainData?.data?.genderSummary) return [];

    return subdomainData.data.genderSummary.map((gender: GenderSummary) => ({
      name: gender.gender,
      value: gender.satisfiedScore,
      isSatisfactionScore: true,
    }));
  }, [subdomainData]);

  const departmentComparisonData = useMemo(() => {
    if (!subdomainData?.data?.departmentSummary) return [];

    return subdomainData.data.departmentSummary.map((dept: DepartmentSummary) => ({
      name: dept.department,
      value: dept.satisfiedScore,
      isSatisfactionScore: true,
    }));
  }, [subdomainData]);

  const leadershipSubdomainMetrics = subdomainData?.data;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    if (key === "stream") {
      setFilters((prev) => ({
        ...prev,
        stream: value,
        function: "",
        department: "",
      }));
    } else if (key === "function") {
      setFilters((prev) => ({
        ...prev,
        function: value,
        department: "",
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

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

  const isFilterActive =
    filters.stream !== "" ||
    filters.function !== "" ||
    filters.department !== "" ||
    filters.age !== "" ||
    filters.gender !== "" ||
    filters.location !== "";

  const isLoading = isSubdomainLoading;
  const hasInsufficientData = (leadershipSubdomainMetrics?.totalParticipants || 0) < 4;
  console.log(...departments);

  return (
    <div className="flex">
      <main className="min-h-screen flex-1">
        <div className="mx-auto px-4 py-8 md:px-8">
          <div className="mb-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-foreground text-xl font-bold md:text-3xl">
                  Leadership & Alignment
                </h1>
                <p className="text-muted-foreground mt-2">
                  Analysis of leadership effectiveness and organizational alignment across
                  demographics
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
                options={[...locationOptions]}
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
                  .slice()}
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
                      .slice()}
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
                      .slice()}
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
                      title="Leadership & Alignment Score"
                      score={leadershipMetric.satisfiedScore || 0}
                      icon={<Users className="h-6 w-6 text-purple-600" />}
                      participantCount={leadershipMetric.participants || 0}
                      trend={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <BarChartComponent
                      title="Leadership Score by Gender"
                      data={genderComparisonData}
                      description="Leadership perception comparison across gender groups"
                      isLoading={isSubdomainLoading}
                      stream={(() => {
                        if (filters.department && filters.department.includes(" > ")) {
                          const parts = filters.department.split(" > ");
                          return parts[0] || "";
                        }
                        return filters.department || "";
                      })()}
                      fn={(() => {
                        if (filters.department && filters.department.includes(" > ")) {
                          const parts = filters.department.split(" > ");
                          return parts[1] || "";
                        }
                        return "";
                      })()}
                      department={(() => {
                        if (filters.department && filters.department.includes(" > ")) {
                          const parts = filters.department.split(" > ");
                          return parts[2] || "";
                        }
                        return "";
                      })()}
                      age={filters.age}
                      gender={filters.gender}
                      location={filters.location}
                    />
                    <BarChartComponent
                      title="Leadership Score by Department"
                      data={departmentComparisonData}
                      description="Leadership effectiveness ranking across departments"
                      isLoading={isSubdomainLoading}
                      stream={(() => {
                        if (filters.department && filters.department.includes(" > ")) {
                          const parts = filters.department.split(" > ");
                          return parts[0] || "";
                        }
                        return filters.department || "";
                      })()}
                      fn={(() => {
                        if (filters.department && filters.department.includes(" > ")) {
                          const parts = filters.department.split(" > ");
                          return parts[1] || "";
                        }
                        return "";
                      })()}
                      department={(() => {
                        if (filters.department && filters.department.includes(" > ")) {
                          const parts = filters.department.split(" > ");
                          return parts[2] || "";
                        }
                        return "";
                      })()}
                      age={filters.age}
                      gender={filters.gender}
                      location={filters.location}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <RiskLegend />
                    <Card className="p-6">
                      <h3 className="text-foreground mb-4 font-semibold">Leadership Dimensions</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-purple-600">•</span>
                          <div>
                            <p className="text-foreground font-medium">Vision & Strategy</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              Clear organizational direction and strategic alignment
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-indigo-600">•</span>
                          <div>
                            <p className="text-foreground font-medium">Trust & Credibility</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              Employee confidence in leadership decisions and integrity
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="font-bold text-cyan-600">•</span>
                          <div>
                            <p className="text-foreground font-medium">
                              Engagement & Communication
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              Transparent and frequent organizational communication
                            </p>
                          </div>
                        </li>
                      </ul>
                    </Card>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
