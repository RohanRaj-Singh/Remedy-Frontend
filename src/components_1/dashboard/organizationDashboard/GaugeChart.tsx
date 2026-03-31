"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { getRiskColor } from "@/utils/colors"
import { Card } from "@/components/ui/card"

interface GaugeChartProps {
  title: string
  value: number
  participantCount: number
}

export function GaugeChart({ title, value, participantCount }: GaugeChartProps) {
  const data = [
    { name: "Score", value: value },
    { name: "Remaining", value: 100 - value },
  ]

  const riskColor = getRiskColor(value)

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="flex items-center justify-center h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              startAngle={180}
              endAngle={0}
              dataKey="value"
            >
              <Cell fill={riskColor} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-4">
        <p className="text-3xl font-bold text-foreground">{Math.round(value)}%</p>
        <p className="text-xs text-muted-foreground mt-2">{participantCount} participants</p>
      </div>
    </Card>
  )
}
