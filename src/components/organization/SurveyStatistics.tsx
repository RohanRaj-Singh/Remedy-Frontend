"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/ui/StatCards";
import { useGetAllSurveyResultQuery } from "@/redux/api/apis/surveyApi";
import { Activity, BarChart, FileText, PieChart, TrendingUp, Users } from "lucide-react";

const SurveyStatistics = () => {
  const { data } = useGetAllSurveyResultQuery(undefined, { pollingInterval: 10000 });
  
    const survey = data?.data?.data;

  const statisticsData = data?.data?.data?.statistics;

  const totalHighRisk = survey?.surveys?.reduce(
    (acc: number, current: { highRiskCount: number }) => {
      return current.highRiskCount > 0 ? acc + 1 : acc;
    },
    0,
  );
  return (
    <div>
      <h1 className="mb-8 text-lg font-bold text-gray-900 md:text-3xl">Survey Analytics</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <StatCard
          title="Total Surveys"
          value={statisticsData?.totalSurverys}
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Total Completed Survey"
          value={statisticsData?.totalCompletedSurveys}
          changeType="neutral"
          icon={FileText}
        />
        <StatCard
          title="Total Incomplete Surveys"
          value={statisticsData?.totalCompletedSurveys}
          changeType="negative"
          icon={TrendingUp}
        />
        <StatCard
          title="Total High Risk"
          value={totalHighRisk}
          changeType="positive"
          icon={Activity}
        />
      </div>
      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
              <PieChart className="h-6 w-6" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative mx-auto h-32 w-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg md:h-64 md:w-64">
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
                  <div className="text-2xl font-bold text-gray-900">24%</div>
                  <div className="text-sm text-gray-600">High Risk</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-6 w-6" />
              Average Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="text-center text-gray-500">
                <BarChart className="mx-auto mb-4 h-16 w-16 opacity-40" />
                <p>Score trend chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Engineering", "Marketing", "Sales", "HR"].map((dept) => (
                <div key={dept} className="flex items-center justify-between py-2">
                  <span>{dept}</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Stress", "Workload", "Support", "Balance"].map((domain) => (
                <div key={domain} className="flex justify-between py-1">
                  <span className="text-sm">{domain}</span>
                  <div className="h-2 w-20 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                    // style={{ width: `${Math.random() * 30 + 70}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SurveyStatistics;
