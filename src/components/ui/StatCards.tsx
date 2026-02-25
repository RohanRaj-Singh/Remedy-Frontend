import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconBgColor?: string;
}

export default function StatCard({
  title,
  value,
  changeType = "neutral",
  icon: Icon,
  iconBgColor = "bg-primary/10",
}: StatCardProps) {
  return (
    <div className={`bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-md transition-shadow animate-fade-in ${changeType}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>

        </div>
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", iconBgColor)}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
