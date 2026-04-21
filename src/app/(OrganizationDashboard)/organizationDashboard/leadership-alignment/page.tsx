"use client";

import DashboardFilters, { FilterState, initialFilterState } from "@/components/dashboard/filter/DashboardFilters";
import { BarChartComponent } from "@/components/dashboard/organizationDashboard/BarChart";
import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { ScoreCard } from "@/components/dashboard/organizationDashboard/ScoreCard";
import { Card } from "@/components/ui/card";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

export default function LeadershipAlignmentPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  const [filterKey, setFilterKey] = useState(0);

  const [getSubdomainStats, { data: subdomainData, isLoading: isSubdomainLoading }] =
    useGetSubdomainStatsMutation();

  useEffect(() => {
    getSubdomainStats({
      dashboardDomain: "Leadership & Alignment",
      stream: appliedFilters.stream || undefined,
      fn: appliedFilters.fn || undefined,
      department: appliedFilters.department || undefined,
      age: appliedFilters.age || undefined,
      gender: appliedFilters.gender || undefined,
      location: appliedFilters.location || undefined,
    });
  }, [appliedFilters, getSubdomainStats]);

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

  const hasInsufficientData = (leadershipSubdomainMetrics?.totalParticipants || 0) < 4;

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
                  Analysis of leadership effectiveness and organizational alignment across demographics
                </p>
              </div>
            </div>

            <DashboardFilters
              key={filterKey}
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={resetFilters}
              isLoading={isSubdomainLoading}
              rollUpActive={subdomainData?.data?.rollUp || false}
            />
          </div>

          {isSubdomainLoading ? (
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
                      stream={appliedFilters.stream}
                      fn={appliedFilters.fn}
                      department={appliedFilters.department}
                      age={appliedFilters.age}
                      gender={appliedFilters.gender}
                      location={appliedFilters.location}
                    />
                    <BarChartComponent
                      title="Leadership Score by Department"
                      data={departmentComparisonData}
                      description="Leadership effectiveness ranking across departments"
                      isLoading={isSubdomainLoading}
                      stream={appliedFilters.stream}
                      fn={appliedFilters.fn}
                      department={appliedFilters.department}
                      age={appliedFilters.age}
                      gender={appliedFilters.gender}
                      location={appliedFilters.location}
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
                            <p className="text-foreground font-medium">Engagement & Communication</p>
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