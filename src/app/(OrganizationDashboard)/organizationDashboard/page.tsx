"use client";

import ExecutiveSummaryComponent from "@/components/organization/ExecutiveSummaryComponent";
import ProtectedRoute from "@/components/Wrapper/ProtectedRoute";

export default function OrganizationDashboard() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <ExecutiveSummaryComponent />
      </div>
    </ProtectedRoute>
  );
}
