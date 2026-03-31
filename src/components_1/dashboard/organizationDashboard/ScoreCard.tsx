"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { getRiskBgClass, getRiskColor, getRiskLabel, getRiskTextClass } from "@/utils/colors";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  participantCount: number;
  trend?: number;
}

export function ScoreCard({ title, score = 0, icon, participantCount }: ScoreCardProps) {
  const riskLabel = getRiskLabel(score);
  const riskColor = getRiskColor(score);
  const bgClass = getRiskBgClass(score);
  const textClass = getRiskTextClass(score);

  return (
    <Card className={`p-6 ${bgClass}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/20 p-2 dark:bg-white/10">{icon}</div>
          <h3 className="text-foreground font-semibold">{title}</h3>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-foreground text-4xl font-bold">{score}</span>
          <span className="text-foreground/60 text-lg">%</span>
        </div>
        <p className={`text-sm font-semibold ${textClass}`}>{riskLabel}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/20 dark:bg-white/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ backgroundColor: riskColor, width: `${score}%` }}
        />
      </div>

      <div className="text-foreground/70 text-xs">Based on {participantCount} participants</div>
    </Card>
  );
}
