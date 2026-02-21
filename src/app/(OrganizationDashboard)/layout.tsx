import LogoutButton from "@/components/dashboard/LogoutButton";
import OrganizationSidebar from "@/components/layout/OrganizationSidebar";
import ProtectedRoute from "@/components/Wrapper/ProtectedRoute";
import Image from "next/image";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-white">
        <OrganizationSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="border-border bg-card flex h-16 items-center justify-between border-b px-6">
            <Image src="/images/orgLogo.png" alt="logo" width={150} height={150} className="w-32" />
            <LogoutButton />
          </header>

          <main className="flex-1 overflow-y-auto bg-[#f5822010] p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
