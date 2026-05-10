"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetInviteStatusQuery,
  useSendInvitationsMutation,
  useUploadEmployeeExcelMutation,
} from "@/redux/api/apis/surveyApi";
import {
  CheckCircle,
  Clock,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  MailCheck,
  RefreshCw,
  Send,
  ShieldCheck,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import type { RootState } from "@/redux/store/store";

type Tab = "upload" | "send" | "monitor";
const EMAIL_INVITATIONS_TOKEN_KEY = "emailInvitationsAccessToken";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

const getOrganizationIdFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded));

    return decoded?._id ?? null;
  } catch {
    return null;
  }
};

export default function EmailInvitationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [monitorRefreshKey, setMonitorRefreshKey] = useState(0);
  const [emailInvitationsToken, setEmailInvitationsToken] = useState<string | null>(null);
  const [accessUserName, setAccessUserName] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [isAccessLoading, setIsAccessLoading] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [usernameForPasswordChange, setUsernameForPasswordChange] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token as string | null);
  const organizationId = useMemo(() => getOrganizationIdFromToken(token), [token]);

  const triggerMonitorRefresh = () => {
    setActiveTab("monitor");
    setMonitorRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem(EMAIL_INVITATIONS_TOKEN_KEY);
    setEmailInvitationsToken(storedToken);
  }, []);

  if (!organizationId) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Organization session is invalid. Please logout and login again.
      </div>
    );
  }

  const handleAccessLogin = async () => {
    if (!accessUserName || !accessPassword) {
      setAccessError("Please enter username and password.");
      return;
    }

    try {
      setAccessError(null);
      setIsAccessLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/organization/email-invitations/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username: accessUserName, password: accessPassword }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Login failed");
      }

      const scopedToken = payload?.data?.token as string | undefined;

      if (!scopedToken) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem(EMAIL_INVITATIONS_TOKEN_KEY, scopedToken);
      setEmailInvitationsToken(scopedToken);
      setAccessPassword("");
      Swal.fire({ icon: "success", title: "Access Granted", timer: 1200, showConfirmButton: false });
    } catch (error: any) {
      setAccessError(error?.message || "Invalid credentials");
    } finally {
      setIsAccessLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!usernameForPasswordChange || !newPassword) {
      Swal.fire({ icon: "warning", title: "Missing fields", text: "Please fill all required fields." });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({ icon: "warning", title: "Weak password", text: "New password must be at least 8 characters." });
      return;
    }

    try {
      setIsPasswordChanging(true);

      const response = await fetch(`${API_BASE_URL}/api/organization/email-invitations/change-password`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `${emailInvitationsToken}`,
        },
        body: JSON.stringify({
          username: usernameForPasswordChange,
          newPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Password change failed");
      }

      setNewPassword("");
      setUsernameForPasswordChange("");
      setShowPasswordPanel(false);
      Swal.fire({ icon: "success", title: "Password Updated", timer: 1500, showConfirmButton: false });
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Update Failed", text: error?.message || "Please try again." });
    } finally {
      setIsPasswordChanging(false);
    }
  };

  const handleLockSection = () => {
    localStorage.removeItem(EMAIL_INVITATIONS_TOKEN_KEY);
    setEmailInvitationsToken(null);
    setShowPasswordPanel(false);
  };

  if (!emailInvitationsToken) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="border-orange-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <ShieldCheck className="h-5 w-5 text-[#f58220]" /> Email Invitations Access Login
            </CardTitle>
            <p className="text-sm text-gray-500">
              This section has an additional access layer. Only authorized members can proceed.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Username</label>
              <input
                value={accessUserName}
                onChange={(e) => setAccessUserName(e.target.value)}
                placeholder="Enter organization username"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#f58220] focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
              <input
                type="password"
                value={accessPassword}
                onChange={(e) => setAccessPassword(e.target.value)}
                placeholder="Enter email invitations password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#f58220] focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {accessError && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{accessError}</p>
            )}

            <Button
              onClick={handleAccessLogin}
              disabled={isAccessLoading}
              className="w-full bg-[#f58220] text-white hover:bg-[#e0731a]"
            >
              {isAccessLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Login to Email Invitations
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Email Invitations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload employee list, send survey invitations, and monitor completion status.
        </p>
      </div>

      <Card className="border-orange-100 bg-orange-50/60">
        <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Section Access Control Enabled</p>
            <p className="text-xs text-gray-500">
              Use password controls below to manage who can open this Email Invitations section.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPasswordPanel((prev) => !prev)}
              className="border-orange-300 text-gray-700 hover:bg-orange-100"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              {showPasswordPanel ? "Hide Password Panel" : "Change Access Password"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLockSection}
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <Lock className="mr-2 h-4 w-4" /> Lock Section
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPasswordPanel && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-700">Change Email Invitations Password</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="New username"
              value={usernameForPasswordChange}
              onChange={(e) => setUsernameForPasswordChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#f58220] focus:ring-2 focus:ring-orange-100"
            />
            <input
              type="text"
              placeholder="New password (min 8 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#f58220] focus:ring-2 focus:ring-orange-100"
            />
            <div className="md:col-span-3">
              <Button
                onClick={handleChangePassword}
                disabled={isPasswordChanging}
                className="bg-[#f58220] text-white hover:bg-[#e0731a]"
              >
                {isPasswordChanging ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {(
          [
            { key: "upload", label: "Upload Excel", icon: Upload },
            { key: "send", label: "Send Invitations", icon: Send },
            { key: "monitor", label: "Monitor Status", icon: MailCheck },
          ] as { key: Tab; label: string; icon: React.ElementType }[]
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-white text-[#f58220] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "upload" && <UploadExcelTab organizationId={organizationId} />}
      {activeTab === "send" && (
        <SendInvitationsTab
          organizationId={organizationId}
          onRefreshMonitor={triggerMonitorRefresh}
        />
      )}
      {activeTab === "monitor" && (
        <MonitorStatusTab
          organizationId={organizationId}
          refreshKey={monitorRefreshKey}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab 1: Upload Excel
───────────────────────────────────────────── */
function UploadExcelTab({ organizationId }: { organizationId: string }) {
  const [uploadExcel, { isLoading }] = useUploadEmployeeExcelMutation();
  const [result, setResult] = useState<null | {
    totalRows: number;
    inserted: number;
    updated: number;
    failed: number;
    errors?: { row: number; reason: string }[];
  }>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
    setResult(null);
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      Swal.fire({ icon: "warning", title: "No file selected", text: "Please select an Excel file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("organizationId", organizationId);

    try {
      const res = await uploadExcel(formData).unwrap();
      setResult(res?.data ?? null);
      if (fileRef.current) fileRef.current.value = "";
      setFileName(null);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-700">Upload Employee Excel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Upload an <strong>.xlsx</strong> file containing employee emails and their
            stream / function / department / location / age / gender columns.
          </p>

          {/* Drop zone */}
          <label
            htmlFor="excel-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-10 transition hover:border-[#f58220] hover:bg-orange-50"
          >
            <Upload className="mb-3 h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              {fileName ? fileName : "Click to choose Excel file"}
            </span>
            <span className="mt-1 text-xs text-gray-400">.xlsx files only</span>
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              ref={fileRef}
              onChange={handleFileChange}
            />
          </label>

          <Button
            onClick={handleUpload}
            disabled={isLoading || !fileName}
            className="w-full bg-[#f58220] text-white hover:bg-[#e0731a] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> Upload & Import
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result card */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-green-700">
              <CheckCircle className="h-5 w-5" /> Import Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-2xl font-bold text-gray-800">{result.totalRows}</p>
                <p className="text-xs text-gray-500">Total Rows</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-2xl font-bold text-green-600">{result.inserted}</p>
                <p className="text-xs text-gray-500">Inserted</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-2xl font-bold text-yellow-600">{result.failed}</p>
                <p className="text-xs text-gray-500">Failed</p>
              </div>
            </div>
            {result.errors && result.errors.length > 0 && (
              <div className="rounded-lg bg-red-50 p-3">
                <p className="mb-1 text-xs font-semibold text-red-700">Skipped rows:</p>
                <ul className="max-h-32 overflow-y-auto space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-600">• Row {e.row}: {e.reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab 2: Send Invitations
───────────────────────────────────────────── */
function SendInvitationsTab({
  organizationId,
  onRefreshMonitor,
}: {
  organizationId: string;
  onRefreshMonitor: () => void;
}) {
  const [sendInvitations, { isLoading }] = useSendInvitationsMutation();
  const [onlyPending, setOnlyPending] = useState(true);
  const [result, setResult] = useState<null | {
    sent: number;
    failed: number;
    skipped: number;
    total: number;
  }>(null);

  const handleSend = async () => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Send Invitations?",
      text: onlyPending
        ? "This will send emails to all employees who have not yet received an invitation."
        : "This will resend emails to ALL employees (including those already invited).",
      showCancelButton: true,
      confirmButtonText: "Yes, Send",
      confirmButtonColor: "#f58220",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await sendInvitations({ organizationId, onlyPending }).unwrap();
      setResult(res?.data ?? null);
      Swal.fire({
        icon: "success",
        title: "Invitations Processing",
        text: "Emails are being sent. The status will refresh automatically in a few moments.",
        timer: 2500,
        showConfirmButton: false,
      });
      onRefreshMonitor();
    } catch (err: any) {
      Swal.fire({
        icon: "info",
        title: "Request Still Processing",
        text: err?.data?.message || "This can take a few minutes for large batches. Please check Monitor Status shortly.",
      });
      onRefreshMonitor();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-700">Send Survey Invitations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-gray-500">
            Sends a unique survey link to each employee via email. Each link is pre-filled
            with the employee's details so no manual entry is required.
          </p>
          <p className="text-xs text-gray-400">
            Large batches can take a few minutes. Use Monitor Status to track progress.
          </p>

          {/* Mode toggle */}
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <input
              type="checkbox"
              id="only-pending"
              checked={onlyPending}
              onChange={(e) => setOnlyPending(e.target.checked)}
              className="h-4 w-4 accent-[#f58220]"
            />
            <label htmlFor="only-pending" className="text-sm text-gray-700 cursor-pointer">
              <span className="font-medium">Only pending employees</span>
              <span className="block text-xs text-gray-400">
                Skip employees who already received an invitation email
              </span>
            </label>
          </div>

          <Button
            onClick={handleSend}
            disabled={isLoading}
            className="w-full bg-[#f58220] text-white hover:bg-[#e0731a] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Send Invitations
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result card */}
      {result && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-700">
              <Mail className="h-5 w-5" /> Email Job Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-2xl font-bold text-green-600">{result.sent}</p>
                <p className="text-xs text-gray-500">Sent</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-2xl font-bold text-yellow-600">{result.skipped}</p>
                <p className="text-xs text-gray-500">Skipped</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                <p className="text-xs text-gray-500">Failed</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-2xl font-bold text-gray-700">{result.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab 3: Monitor Status
───────────────────────────────────────────── */
function MonitorStatusTab({
  organizationId,
  refreshKey,
}: {
  organizationId: string;
  refreshKey: number;
}) {
  const { data, isLoading, isFetching, refetch } = useGetInviteStatusQuery(organizationId);
  const summary = data?.data?.summary;
  const invites: any[] = data?.data?.invites ?? [];

  useEffect(() => {
    if (!refreshKey) return;
    refetch();
    const timer = setTimeout(() => refetch(), 5000);
    return () => clearTimeout(timer);
  }, [refreshKey, refetch]);

  const summaryCards = [
    { label: "Total Employees", value: summary?.total ?? 0, icon: Users, color: "text-gray-700" },
    { label: "Emails Sent", value: summary?.sent ?? 0, icon: Mail, color: "text-blue-600" },
    { label: "Completed", value: summary?.completed ?? 0, icon: CheckCircle, color: "text-green-600" },
    { label: "Pending Send", value: summary?.pendingSend ?? 0, icon: Clock, color: "text-yellow-600" },
    { label: "Not Yet Completed", value: summary?.notCompleted ?? 0, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-700">Invite Summary</h2>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-300 text-gray-600"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex flex-col items-center justify-center py-5 text-center">
              <card.icon className={`mb-2 h-6 w-6 ${card.color}`} />
              <p className={`text-2xl font-bold ${card.color}`}>
                {isLoading ? "…" : card.value}
              </p>
              <p className="mt-1 text-xs text-gray-500">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion bar */}
      {summary && summary.sent > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>Completion rate</span>
              <span className="font-semibold">
                {Math.round((summary.completed / summary.sent) * 100)}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${Math.round((summary.completed / summary.sent) * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              {summary.completed} of {summary.sent} invited employees have completed the survey
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-700">
            Employee Invite Details ({invites.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Loading...
            </div>
          ) : invites.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No employees found. Upload an Excel file first.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Stream</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-center">Email Sent</th>
                  <th className="px-4 py-3 text-center">Completed</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((inv: any, i: number) => (
                  <tr
                    key={inv._id ?? i}
                    className={`border-b transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-orange-50`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{inv.email}</td>
                    <td className="px-4 py-3 text-gray-600">{inv.stream?.replace(/_/g, " ") ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{inv.department?.replace(/_/g, " ") ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {{ headOffice: "Muscat", block60: "B60", msusundam: "Musandam" }[inv.location as string] ?? inv.location ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inv.emailSent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          <CheckCircle className="h-3 w-3" /> Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inv.completed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          <CheckCircle className="h-3 w-3" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">
                          <XCircle className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
