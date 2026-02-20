"use client";
import SubmitButton from "@/components/ui/SubmitButton";
import { useLoginMutation } from "@/redux/api/apis/authenticationApi";
import { setToken } from "@/redux/api/slice/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await login({ username: userName, password });

    const token = res?.data?.data?.token;
    const redirectUrl = searchParams.get("redirectUrl");

    if(token) {
      dispatch(setToken(token));
      router.replace(redirectUrl ? `/${redirectUrl}` : "/organizationDashboard");
    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f1]">
      <div className="w-full max-w-md rounded-md bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Mental Health Dashboard</h2>
        <p className="mb-6 text-xs text-gray-500">Employee Wellbeing & Organizational Health</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#3CCB7F] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#3CCB7F] focus:outline-none"
              required
            />
          </div>

          <SubmitButton text="Login" className="w-full" />
        </form>
      </div>
    </div>
  );
}
