"use client";

import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { ScoreCard } from "@/components/dashboard/organizationDashboard/ScoreCard";
import { SubdomainCard } from "@/components/dashboard/organizationDashboard/SubDomainCard";
import { Card } from "@/components/ui/card";
import SelectInput from "@/components/ui/SelectInput";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import FunctionSummeryCard from "./FunctionSummeryCard";
import StreamSummeryCard from "./StreamSummeryCard";

import HierarchicalFilter from "@/components/dashboard/filter/HierarchicalFilter";
import { ageOptions, departments, genderOptions, locationOptions } from "@/data/survey";

interface DomainSummaryItem {
  domain: string;
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

type StreamReport = {
  stream: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
};

type FunctionReport = {
  function: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
};

export default function SatisfactionEngagementPage() {
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
      dashboardDomain: "Satisfaction & Engagement",
      stream: stream || undefined,
      fn: fn || undefined,
      department: department || undefined,
      age: filters.age || undefined,
      gender: filters.gender || undefined,
      location: filters.location || undefined,
    });
  }, [filters, getSubdomainStats]);

  const satisfactionSubdomainMetrics = subdomainData?.data;
  const streamData = subdomainData?.data?.streamSummary;
  const functionData = subdomainData?.data?.functionSummary;

  console.log(functionData);

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

  const isLoading = isSubdomainLoading;

  // Check anonymity rule
  const hasInsufficientData = (satisfactionSubdomainMetrics?.totalParticipants || 0) < 4;

  return (
    <div className="flex">
      <main className="min-h-screen flex-1">
        <div className="mx-auto px-4 py-8 md:px-8">
          {/* Header with filter controls */}
          <div className="mb-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-foreground text-xl font-bold md:text-3xl">Workplace Morale</h1>
                <p className="text-muted-foreground mt-2">
                  Measure of employee satisfaction with colleagues, personal fulfillment, and
                  workplace environment
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

            {/* Filter Section */}
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

              {/* Stream Selection */}
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

              {/* Age Selection */}
              <SelectInput
                value={filters.age}
                onChange={(value) => handleFilterChange("age", value)}
                options={[...ageOptions]}
                placeholder="Filter by Age"
              />

              {/* Gender Selection */}
              <SelectInput
                value={filters.gender}
                onChange={(value) => handleFilterChange("gender", value)}
                options={[...genderOptions]}
                placeholder="Filter by Gender"
              />
            </div>

            {/* Additional Department Hierarchy Filters - shown in a new row */}
            {(filters.stream || filters.function || filters.department) && (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
                {/* Function Selection - only show when stream is selected */}
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

                {/* Department Selection - only show when stream and function are selected */}
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

            {/* Active Filters Display */}
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

                {/* Roll Up / Actual Badge */}
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
              {/* Anonymity Protection Check */}
              {hasInsufficientData && (
                <Card className="border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    Insufficient data to display results due to anonymity protection.
                  </p>
                </Card>
              )}

              {!hasInsufficientData && (
                <>
                  {/* Main Score */}
                  <div>
                    <ScoreCard
                      title="Overall Workplace Morale"
                      score={
                        satisfactionSubdomainMetrics?.dashboardDomainAverage
                          ?.averageSatisfactionScore || 0
                      }
                      icon={<Smile className="h-6 w-6 text-green-600" />}
                      participantCount={satisfactionSubdomainMetrics?.totalParticipants || 0}
                      trend={3}
                    />
                  </div>

                  {/* Subdomain Cards */}
                  <div>
                    <h2 className="text-foreground mb-4 text-lg font-semibold">
                      Workplace Morale Subdomains
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {subdomainData?.data?.domainSummary?.map((subdomain: DomainSummaryItem) => (
                        <SubdomainCard
                          key={subdomain.domain}
                          name={subdomain.domain}
                          score={subdomain.satisfiedScore}
                          participantCount={subdomain.participants}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-foreground mb-4 text-lg font-semibold">
                      Stream summary (3 Or More Participants)
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {/* {streamData?.map((data: StreamReport) => (
                        <StreamSummeryCard key={data?.stream} data={data} />
                      ))} */}
                      {streamData?.map((data: StreamReport) =>
                        data?.participants > 2 ? (
                          <StreamSummeryCard key={data?.stream} data={data} />
                        ) : null,
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-foreground mb-4 text-lg font-semibold">
                      Function summary (3 Or More Participants)
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {functionData?.map((data: FunctionReport) =>
                        data?.participants > 2 ? (
                          <FunctionSummeryCard key={data.function} data={data} />
                        ) : null,
                      )}
                    </div>
                  </div>

                  {/* Supporting Information */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <RiskLegend />
                    <Card className="p-6">
                      <h3 className="text-foreground mb-4 font-semibold">About This Index</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-foreground font-medium">What We Measure</p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            The Satisfaction & Engagement Index reflects employee satisfaction
                            across key dimensions: relationships with colleagues, personal
                            fulfillment, and workplace environment satisfaction.
                          </p>
                        </div>
                        <div>
                          <p className="text-foreground font-medium">Why It Matters</p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            High satisfaction correlates with better retention, productivity, and
                            mental health outcomes. This metric helps identify engagement gaps and
                            opportunities for improvement.
                          </p>
                        </div>
                      </div>
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
