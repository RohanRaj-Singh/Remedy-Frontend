"use client";

import HierarchicalFilter from "@/components/dashboard/filter/HierarchicalFilter";
import { ClinicalRiskBarChart } from "@/components/dashboard/organizationDashboard/ClinicalRiskBarChart";
import { GaugeChart } from "@/components/dashboard/organizationDashboard/GaugeChart";
import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectInput from "@/components/ui/SelectInput";
import { ageOptions, departments, genderOptions, locationOptions } from "@/data/survey";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, Smile, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface DomainSummary {
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

const getRiskLevel = (riskScore: number) => {
  if (riskScore < 3) return { level: "No Risk", color: "text-green-600", bg: "bg-green-100" };
  if (riskScore < 6) return { level: "Low Risk", color: "text-blue-600", bg: "bg-blue-100" };
  if (riskScore < 10)
    return { level: "Medium Risk", color: "text-yellow-600", bg: "bg-yellow-100" };
  return { level: "High Risk", color: "text-red-600", bg: "bg-red-100" };
};

const getSatisfactionColor = (score: number) => {
  if (score >= 97) return "#10b981";
  if (score >= 94) return "#3b82f6";
  if (score >= 90) return "#f59e0b";
  return "#ef4444";
};

export default function ClinicalRiskPage() {
  const [filters, setFilters] = useState<FilterState>({
    stream: "",
    function: "",
    department: "",
    age: "",
    gender: "",
    location: "",
  });

  const [getSubdomainStats, { data: subdomainData, isLoading }] = useGetSubdomainStatsMutation();

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
      dashboardDomain: "Clinical Risk Index",
      stream: stream || undefined,
      fn: fn || undefined,
      department: department || undefined,
      age: filters.age || undefined,
      gender: filters.gender || undefined,
      location: filters.location || undefined,
    });
  }, [filters, getSubdomainStats]);

  const responseData = subdomainData?.data;
  const domainSummary = responseData?.domainSummary || [];
  const totalParticipants = responseData?.totalParticipants || 0;
  const dashboardDomainAverage = responseData?.dashboardDomainAverage;

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
      setFilters((prev) => ({ ...prev, [key]: value }));
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

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const hasInsufficientData = (responseData?.totalParticipants || 0) < 4;

  return (
    <main className="min-h-screen">
      <div className="mx-auto px-4 py-8 md:px-8 md:py-6 lg:py-8">
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              {" "}
              <h1 className="text-xl font-bold text-gray-900 md:text-3xl xl:text-3xl">
                Clinical Risk Index
              </h1>{" "}
              <p className="mt-2 text-lg text-gray-600">
                Breakdown of burnout, anxiety, and depression indicators across your
                organization{" "}
              </p>{" "}
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

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-3">
              <HierarchicalFilter
                value={filters.department || ""}
                onChange={(value: string) => handleFilterChange("department", value)}
                departments={departments}
                placeholder="Bulk Filter by Stream, Function, Department"
              />
            </div>

            <SelectInput
              value={filters.location}
              onChange={(v) => handleFilterChange("location", v)}
              options={locationOptions}
              placeholder="All Locations"
            />

            <SelectInput
              value={filters.age}
              onChange={(v) => handleFilterChange("age", v)}
              options={ageOptions}
              placeholder="All Ages"
            />

            <SelectInput
              value={filters.gender}
              onChange={(v) => handleFilterChange("gender", v)}
              options={genderOptions}
              placeholder="All Genders"
            />
          </div>

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
                  hasActiveFilters
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="space-y-10">
            {hasInsufficientData && (
              <Card className="border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  Insufficient data to display results due to anonymity protection.
                </p>
              </Card>
            )}

            {!hasInsufficientData && (
              <section>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        Overall Index
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {dashboardDomainAverage
                          ? `${dashboardDomainAverage?.averageRiskScore}%`
                          : "N/A"}
                      </div>
                      {dashboardDomainAverage && (
                        <div
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            getRiskLevel(dashboardDomainAverage?.averageRiskScore).bg
                          } ${getRiskLevel(dashboardDomainAverage?.averageRiskScore).color}`}
                        >
                          {getRiskLevel(dashboardDomainAverage?.averageRiskScore).level}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {domainSummary.slice(0, 3).map((domain: DomainSummary) => {
                    const risk = getRiskLevel(domain.riskScore);
                    return (
                      <Card key={domain.domain} className="shadow-xl">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-600">
                            {domain.domain.split(' ')[0]}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{domain.riskScore.toFixed(1)}%</div>
                          <div
                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${risk.bg} ${risk.color}`}
                          >
                            {risk.level}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <section className="mb-4">
                  <h2 className="mt-2 mb-4 text-lg font-semibold">Summary Statistics</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                    <Card className="bg-emerald-50 p-6 dark:bg-emerald-950">
                      <div className="mb-2 flex items-center gap-3">
                        <Smile className="h-6 w-6 text-emerald-600" />
                        <h3 className="text-lg font-semibold">Total Participants</h3>
                      </div>
                      <p className="text-3xl font-bold text-emerald-600">{totalParticipants}</p>
                    </Card>
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-6 ">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Domain Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClinicalRiskBarChart
                        title="Clinical Risk Index"
                        description="Higher score = Lower clinical risk (better mental health)"
                        stream={(() => {
                          if (filters.department && filters.department.includes(" > ")) {
                            const parts = filters.department.split(" > ");
                            return parts[0] || "";
                          }
                          return filters.department || filters.stream || "";
                        })()}
                        fn={(() => {
                          if (filters.department && filters.department.includes(" > ")) {
                            const parts = filters.department.split(" > ");
                            return parts[1] || "";
                          }
                          return filters.function || "";
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
                    </CardContent>
                  </Card>

                  {/* <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Overall Index Gauge</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pt-6">
                      <GaugeChart
                        title=""
                        value={dashboardDomainAverage?.averageSatisfactionScore || 0}
                        participantCount={totalParticipants}
                      />
                    </CardContent>
                  </Card> */}
                </div>

                {/* {domainSummary.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {domainSummary.map((domain: DomainSummary, idx: number) => {
                      const pieData = [
                        { name: "At Risk", value: domain.riskScore },
                        { name: "Satisfied", value: 100 - domain.riskScore },
                      ];
                      const riskLevel = getRiskLevel(domain.riskScore);

                      return (
                        <Card key={domain.domain} className="shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium">{domain.domain}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center">
                            <div
                              className={`mb-3 rounded-full px-3 py-1 text-xs font-medium ${riskLevel.bg} ${riskLevel.color}`}
                            >
                              {riskLevel.level}
                            </div>

                            <ResponsiveContainer width="100%" height={180}>
                              <PieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={70}
                                  dataKey="value"
                                  paddingAngle={3}
                                >
                                  {pieData.map((_, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        index === 0
                                          ? getSatisfactionColor(domain.satisfiedScore)
                                          : "#e5e7eb"
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                              </PieChart>
                            </ResponsiveContainer>

                            <div className="mt-3 text-center">
                              <p className="text-2xl font-bold">{domain.riskScore.toFixed(1)}%</p>
                              <p className="text-xs text-gray-600">
                                {domain.participants} responses
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )} */}

                <div className="grid grid-cols-1 gap-6 space-y-10 lg:grid-cols-2 pt-12">
                  <div className="mb-20">
                    <RiskLegend isClinical={true} />
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4 text-sm">
                        <li className="flex gap-3">
                          <span className="font-bold text-green-600">•</span>
                          <div>
                            <p className="font-medium">Psychological Safety</p>
                            <p className="text-gray-600">Freedom to speak up without fear</p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-blue-600">•</span>
                          <div>
                            <p className="font-medium">Trust Refinement</p>
                            <p className="text-gray-600">
                              Building interpersonal trust and reliability
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-amber-600">•</span>
                          <div>
                            <p className="font-medium">Fear/Blame Intensity</p>
                            <p className="text-gray-600">Absence of punitive culture</p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
