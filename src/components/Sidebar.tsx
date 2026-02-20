"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookPlus, ClipboardList, LayoutDashboard, Menu, Shield, Ungroup, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/adminDashboard", icon: LayoutDashboard },
  { name: "Questions", href: "/adminDashboard/questions", icon: BookPlus },
  { name: "Organizations", href: "/adminDashboard/organizations", icon: Ungroup },
  { name: "Completed Surveys", href: "/adminDashboard/surveys", icon: ClipboardList },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={cn(
        "bg-sidebar border-sidebar-border flex flex-col border-r transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20",
      )}
    >
      <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-4">
        {sidebarOpen ? (
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Shield className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-sidebar-foreground text-lg font-bold">Remedy</span>
            </div>
          </Link>
        ) : (
          <div className="bg-primary mx-auto flex h-8 w-8 items-center justify-center rounded-lg">
            <Shield className="text-primary-foreground h-5 w-5" />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-border border-t p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden w-full justify-center md:flex"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
