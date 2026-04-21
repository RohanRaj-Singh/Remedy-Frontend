"use client";

import DashboardFilters, { FilterState, initialFilterState } from "@/components/dashboard/filter/DashboardFilters";
import { FearBlameChart } from "@/components/dashboard/organizationDashboard/FearBlameChart";
import { RankingTable } from "@/components/dashboard/organizationDashboard/RankingTable";
import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { ScoreCard } from "@/components/dashboard/organizationDashboard/ScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, Shield, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

export default function PsychologicalSafetyPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  const [filterKey, setFilterKey] = useState(0);

  const [getSubdomainStats, { data: subdomainData, isLoading }] = useGetSubdomainStatsMutation();

  useEffect(() => {
    getSubdomainStats({
      dashboardDomain: "Psychological Safety Index",
      stream: appliedFilters.stream || undefined,
      fn: appliedFilters.fn || undefined,
      department: appliedFilters.department || undefined,
      age: appliedFilters.age || undefined,
      gender: appliedFilters.gender || undefined,
      location: appliedFilters.location || undefined,
    });
  }, [appliedFilters, getSubdomainStats]);

  const psychologicalSubdomainData = subdomainData?.data;

  const departmentStats = useMemo(() => {
    if (!psychologicalSubdomainData?.departmentSummary) return [];
    return [...psychologicalSubdomainData.departmentSummary]
      .sort((a, b) => b.satisfiedScore - a.satisfiedScore)
      .map((dept: DepartmentSummary) => ({
        department: dept.department,
        satisfactionScore: dept.satisfiedScore,
        riskScore: dept.riskScore,
      }));
  }, [psychologicalSubdomainData]);

  const fearBlameChartData = useMemo(() => {
    if (!psychologicalSubdomainData?.domainSummary) return [];
    return psychologicalSubdomainData.domainSummary.map((domain: PsychologicalDomain) => ({
      name: domain.domain,
      value: Number(domain.satisfiedScore),
      isSatisfactionScore: true,
    }));
  }, [psychologicalSubdomainData]);

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

  const hasInsufficientData = (psychologicalSubdomainData?.totalParticipants || 0) < 4;

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
            </div>

            <DashboardFilters
              key={filterKey}
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={resetFilters}
              isLoading={isLoading}
              rollUpActive={subdomainData?.data?.rollUp || false}
            />
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
                          data={fearBlameChartData || []}
                          isLoading={isLoading}
                          stream={filters.stream || undefined}
                          fn={filters.fn || undefined}
                          department={filters.department || undefined}
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