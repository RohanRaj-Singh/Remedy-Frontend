"use client";

import type { RootState } from "@/redux/store/store";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.replace(`/login?redirectUrl=${pathname.replace("/", "")}`);
    }
  }, [token, router ,pathname]);

  if (!token) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return <>{children}</>;
}
