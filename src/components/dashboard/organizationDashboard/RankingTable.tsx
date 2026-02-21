"use client";

import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

interface RankingItem {
  department: string;
  satisfactionScore: number;
  riskScore?: number;
}

interface RankingTableProps {
  title: string;
  items: RankingItem[];
  description?: string;
}

export function RankingTable({ title, items, description }: RankingTableProps) {
  return (
    <Card className="p-6">
      <h3 className="text-foreground mb-2 font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mb-4 text-sm">{description}</p>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={item.department}
            className="bg-muted/30 hover:bg-muted/50 flex flex-col md:flex-row items-center justify-between rounded-lg p-3 transition-colors"
          >
            <div className="flex flex-col md:flex-row flex-1 items-center gap-4">
              <div className="bg-accent text-accent-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                {i === 0 ? <Award className="h-4 w-4" /> : i + 1}
              </div>
              <div>
                <p className="text-foreground font-medium">{item.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-foreground text-lg font-bold">{item.satisfactionScore}%</p>
                {item.riskScore !== undefined && (
                  <p className="text-muted-foreground text-xs">Risk: {item.riskScore}%</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}