"use client";

import DashboardFilters, { FilterState, initialFilterState } from "@/components/dashboard/filter/DashboardFilters";
import { ComparisonChart } from "@/components/dashboard/organizationDashboard/ComparisonChart";
import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { ScoreCard } from "@/components/dashboard/organizationDashboard/ScoreCard";
import { Card } from "@/components/ui/card";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

export default function WorkloadEfficiencyPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  const [filterKey, setFilterKey] = useState(0);

  const [getSubdomainStats, { data: subdomainData, isLoading: isSubdomainLoading }] =
    useGetSubdomainStatsMutation();

  const [
    getSatisfactionSubdomainStats,
    { data: satisfactionSubdomainData, isLoading: isSatisfactionSubdomainLoading },
  ] = useGetSubdomainStatsMutation();

  useEffect(() => {
    getSubdomainStats({
      dashboardDomain: "Workload & Efficiency",
      stream: appliedFilters.stream || undefined,
      fn: appliedFilters.fn || undefined,
      department: appliedFilters.department || undefined,
      age: appliedFilters.age || undefined,
      gender: appliedFilters.gender || undefined,
      location: appliedFilters.location || undefined,
    });
  }, [appliedFilters, getSubdomainStats]);

  useEffect(() => {
    getSatisfactionSubdomainStats({
      dashboardDomain: "Satisfaction & Engagement",
      stream: appliedFilters.stream || undefined,
      fn: appliedFilters.fn || undefined,
      department: appliedFilters.department || undefined,
      age: appliedFilters.age || undefined,
      gender: appliedFilters.gender || undefined,
      location: appliedFilters.location || undefined,
    });
  }, [appliedFilters, getSatisfactionSubdomainStats]);

  const workloadSubdomainMetrics = subdomainData?.data;

  const workloadVsSatisfactionData = useMemo(() => {
    if (
      !subdomainData?.data?.departmentSummary ||
      !satisfactionSubdomainData?.data?.departmentSummary
    )
      return [];

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

  const isLoading = isSubdomainLoading || isSatisfactionSubdomainLoading;
  const hasInsufficientData = (workloadSubdomainMetrics?.totalParticipants || 0) < 4;

  return (
    <div className="flex">
      <main className="min-h-screen flex-1">
        <div className="mx-auto px-4 py-8 md:px-8">
          <div className="mb-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-foreground text-xl font-bold md:text-3xl">
                  Workload & Efficiency
                </h1>
                <p className="text-muted-foreground mt-2">
                  Analysis of employee workload management and satisfaction across the organization
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
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                    <ScoreCard
                      title="Workload & Efficiency"
                      score={workloadSubdomainMetrics?.dashboardDomainAverage?.averageSatisfactionScore || 0}
                      icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
                      participantCount={workloadSubdomainMetrics?.totalParticipants || 0}
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}