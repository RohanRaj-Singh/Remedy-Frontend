/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllSurveyResultQuery } from "@/redux/api/apis/surveyApi";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CommonButton from "../ui/CommonButton";

const ITEMS_PER_PAGE = 10;

export default function RecentSurveysTable() {
  const { data, isLoading } = useGetAllSurveyResultQuery(undefined, {
    pollingInterval: 20000,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const surveys = data?.data?.data?.surveys?.filter((s: any) => s.status !== "in-progress");

  const totalItems = surveys?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedSurveys = surveys?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
          <CardTitle className="text-base sm:text-lg">Recent Surveys</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Overview of your latest wellbeing surveys
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="text-muted-foreground py-8 text-center text-sm">Loading surveys...</div>
        </CardContent>
      </Card>
    );
  }

  if (!paginatedSurveys || paginatedSurveys.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
          <CardTitle className="text-base sm:text-lg">Recent Surveys</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Overview of your latest wellbeing surveys
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="text-muted-foreground py-8 text-center text-sm">
            No completed surveys found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
        <CardTitle className="text-base sm:text-lg">Recent Surveys</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Overview of your latest wellbeing surveys
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="block space-y-3 sm:hidden">
          {paginatedSurveys.map((survey: any) => (
            <div
              key={survey._id}
              className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Department</p>
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {survey?.user?.department || "N/A"}
                    </p>
                  </div>
                  <Button
                    disabled={survey.status !== "completed"}
                    variant="secondary"
                    size="sm"
                    className="ml-2 h-8 w-8 flex-shrink-0 p-0"
                  >
                    <Link href={`/adminDashboard/surveys/${survey._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-2">
                  <div>
                    <p className="text-xs text-gray-500">Seniority</p>
                    <p className="truncate text-sm text-gray-900">
                      {survey?.user?.seniorityLevel || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">High Risk</p>
                    <p className="text-sm font-semibold text-red-600">
                      {survey?.highRiskCount ?? 0}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      survey.status === "completed"
                        ? "bg-primary/10 text-primary"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {survey.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Department Name</TableHead>
                <TableHead className="whitespace-nowrap">Seniority Level</TableHead>
                <TableHead className="whitespace-nowrap">High Risk</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSurveys.map((survey: any) => (
                <TableRow key={survey._id}>
                  <TableCell className="py-4 font-medium">
                    {survey?.user?.department || "N/A"}
                  </TableCell>
                  <TableCell className="py-4">{survey?.user?.seniorityLevel || "N/A"}</TableCell>
                  <TableCell className="py-4">{survey?.highRiskCount ?? 0}</TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        survey.status === "completed"
                          ? "bg-primary/10 text-primary"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {survey.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Button disabled={survey.status !== "completed"} variant="secondary" size="sm">
                      <Link href={`/adminDashboard/surveys/${survey._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-4">
            <div className="text-muted-foreground text-sm">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="flex gap-2 md:gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="hidden gap-2 md:flex md:gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="hidden w-9 cursor-pointer md:block"
                    variant="common"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <CommonButton text="Next" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
