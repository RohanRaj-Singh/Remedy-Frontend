"use client";

import DashboardFilters, { FilterState, checkHasActiveFilters, initialFilterState } from "@/components/dashboard/filter/DashboardFilters";
import { RiskLegend } from "@/components/dashboard/organizationDashboard/RiskLegend";
import { ScoreCard } from "@/components/dashboard/organizationDashboard/ScoreCard";
import { SubdomainCard } from "@/components/dashboard/organizationDashboard/SubDomainCard";
import { Card } from "@/components/ui/card";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { Loader2, Smile } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FunctionSummeryCard from "./FunctionSummeryCard";
import StreamSummeryCard from "./StreamSummeryCard";

interface DomainSummaryItem {
  domain: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
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
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  const [filterKey, setFilterKey] = useState(0);

  const [getSubdomainStats, { data: subdomainData, isLoading: isSubdomainLoading }] =
    useGetSubdomainStatsMutation();

  useEffect(() => {
    getSubdomainStats({
      dashboardDomain: "Satisfaction & Engagement",
      stream: appliedFilters.stream || undefined,
      fn: appliedFilters.fn || undefined,
      department: appliedFilters.department || undefined,
      age: appliedFilters.age || undefined,
      gender: appliedFilters.gender || undefined,
      location: appliedFilters.location || undefined,
    });
  }, [appliedFilters, getSubdomainStats]);

  const satisfactionSubdomainMetrics = subdomainData?.data;
  const streamData = subdomainData?.data?.streamSummary;
  const functionData = subdomainData?.data?.functionSummary;

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

  const isFilterActive = checkHasActiveFilters(filters);
  const isLoading = isSubdomainLoading;
  const hasInsufficientData = (satisfactionSubdomainMetrics?.totalParticipants || 0) < 4;

  return (
    <div className="flex">
      <main className="min-h-screen flex-1">
        <div className="mx-auto px-4 py-8 md:px-8">
          <div className="mb-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-foreground text-xl font-bold md:text-3xl">
                  Satisfaction & Engagement
                </h1>
                <p className="text-muted-foreground mt-2">
                  Measure of employee satisfaction with colleagues, personal fulfillment, and
                  workplace environment
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
                  <div>
                    <ScoreCard
                      title="Overall Satisfaction & Engagement"
                      score={
                        satisfactionSubdomainMetrics?.dashboardDomainAverage
                          ?.averageSatisfactionScore || 0
                      }
                      icon={<Smile className="h-6 w-6 text-green-600" />}
                      participantCount={satisfactionSubdomainMetrics?.totalParticipants || 0}
                      trend={3}
                    />
                  </div>

                  <div>
                    <h2 className="text-foreground mb-4 text-lg font-semibold">
                      Satisfaction Subdomains
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