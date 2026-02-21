"use client";

import HierarchicalFilter from "@/components/dashboard/filter/HierarchicalFilter";
import { ComparisonChart } from "@/components/dashboard/organizationDashboard/ComparisonChart";
import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { ScoreCard } from "@/components/dashboard/organizationDashboard/ScoreCard";
import { Card } from "@/components/ui/card";
import SelectInput from "@/components/ui/SelectInput";
import { ageOptions, departments, genderOptions, locationOptions } from "@/data/survey";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface DomainSummaryItem {
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

export default function WorkloadEfficiencyPage() {
  const [filters, setFilters] = useState<FilterState>({
    stream: "",
    function: "",
    department: "",
    age: "",
    gender: "",
    location: "",
  });

  // Get available functions based on selected stream
  const availableFunctions = departments.find((d) => d.stream === filters.stream)?.functions || [];

  // Get available departments based on selected stream and function
  const availableDepartments =
    availableFunctions.find((f) => f.function === filters.function)?.departments || [];

  const [getSubdomainStats, { data: subdomainData, isLoading: isSubdomainLoading }] =
    useGetSubdomainStatsMutation();

  // Update the API call to send the correct filter parameters
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
      dashboardDomain: "Workload & Efficiency",
      stream: stream || undefined,
      fn: fn || undefined,
      department: department || undefined,
      age: filters.age || undefined,
      gender: filters.gender || undefined,
      location: filters.location || undefined,
    });
  }, [filters, getSubdomainStats]);

  const [
    getSatisfactionSubdomainStats,
    { data: satisfactionSubdomainData, isLoading: isSatisfactionSubdomainLoading },
  ] = useGetSubdomainStatsMutation();

  // Fetch satisfaction subdomain data
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

    getSatisfactionSubdomainStats({
      dashboardDomain: "Satisfaction & Engagement",
      stream: stream || undefined,
      fn: fn || undefined,
      department: department || undefined,
      age: filters.age || undefined,
      gender: filters.gender || undefined,
      location: filters.location || undefined,
    });
  }, [filters, getSatisfactionSubdomainStats]);

  const workloadSubdomainMetrics = subdomainData?.data;

  // Find workload and satisfaction metrics
  // ;
  const workloadMetric = subdomainData?.data;
  const satisfactionMetric = satisfactionSubdomainData?.data;

  // Prepare workload vs satisfaction by department data
  const workloadVsSatisfactionData = useMemo(() => {
    if (
      !subdomainData?.data?.departmentSummary ||
      !satisfactionSubdomainData?.data?.departmentSummary
    )
      return [];

    // Combine workload and satisfaction data by department
    const workloadDepartments = subdomainData.data.departmentSummary;
    const satisfactionDepartments = satisfactionSubdomainData.data.departmentSummary;

    return workloadDepartments.map((workloadDept: DepartmentSummary) => {
      const satisfactionDept = satisfactionDepartments.find(
        (dept: DepartmentSummary) => dept.department === workloadDept.department,
      );

      return {
        name: workloadDept.department,
        value1: workloadDept.satisfiedScore,
        value2: satisfactionDept ? satisfactionDept.satisfiedScore : 0,
      };
    });
  }, [subdomainData, satisfactionSubdomainData]);

  // Prepare satisfaction breakdown data (sub-scores)
  const satisfactionBreakdownData = useMemo(() => {
    if (!satisfactionSubdomainData?.data?.domainSummary) return [];

    // Map the domain summary to the required format
    return satisfactionSubdomainData.data.domainSummary.map((domain: DomainSummaryItem) => ({
      name: domain.domain,
      value1: domain.satisfiedScore,
      value2: 85, // Target value - could be made dynamic if needed
    }));
  }, [satisfactionSubdomainData]);

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

  const isLoading = isSubdomainLoading || isSatisfactionSubdomainLoading;
  // Check anonymity rule
  const hasInsufficientData = (workloadSubdomainMetrics?.totalParticipants || 0) < 4;

  return (
    <div className="flex">
      <main className="min-h-screen flex-1">
        <div className="mx-auto px-4 py-8 md:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="mb-8">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <h1 className="text-foreground text-xl font-bold md:text-3xl">
                      Workload & Efficiency
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Analysis of employee workload management and satisfaction across the
                      organization
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

              <section className="space-y-8">
                {hasInsufficientData && (
                  <Card className="border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      Insufficient data to display results due to anonymity protection.
                    </p>
                  </Card>
                )}
                {!hasInsufficientData && (
                  <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                      <ScoreCard
                        title="Workload & Efficiency"
                        score={
                          workloadMetric?.dashboardDomainAverage?.averageSatisfactionScore || 0
                        }
                        icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
                        participantCount={workloadMetric?.totalParticipants || 0}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <ComparisonChart
                        title="Workload vs Satisfaction by Department"
                        data={workloadVsSatisfactionData}
                        series1Name="Workload & Efficiency"
                        series2Name="Satisfaction & Engagement"
                        description="Comparison showing the relationship between workload management and satisfaction levels across departments"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <RiskLegend />
                      <Card className="p-6">
                        <h3 className="text-foreground mb-4 font-semibold">
                          Satisfaction Dimensions
                        </h3>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-3">
                            <span className="font-bold text-green-600">•</span>
                            <div>
                              <p className="text-foreground font-medium">Coworker Satisfaction</p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                Quality of relationships and team dynamics
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="font-bold text-green-600">•</span>
                            <div>
                              <p className="text-foreground font-medium">Personal Satisfaction</p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                Career development and personal fulfillment
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="font-bold text-green-600">•</span>
                            <div>
                              <p className="text-foreground font-medium">Workplace Satisfaction</p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                Work environment quality and resources
                              </p>
                            </div>
                          </li>
                        </ul>
                      </Card>
                    </div>
                  </>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
