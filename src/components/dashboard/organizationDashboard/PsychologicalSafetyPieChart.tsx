"use client";

import { Card } from "@/components/ui/card";
import { getRiskColor } from "@/utils/colors";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface PsychologicalSafetyPieChartProps {
    title: string;
    value: number;
    participantCount: number;
}

export function PsychologicalSafetyPieChart({ title, value, participantCount }: PsychologicalSafetyPieChartProps) {
    const data = [
        { name: "Safety Score", value: value },
        { name: "Remaining", value: 100 - value },
    ];

    const riskColor = getRiskColor(value);

    return (
        <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">{title}</h3>
            <div className="flex items-center justify-center h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            <Cell fill={riskColor} />
                            <Cell fill="#e5e7eb" />
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`${Number(value).toFixed(1)}%`, "Percentage"]}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.5rem",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
                <p className="text-3xl font-bold text-foreground">{Math.round(value)}%</p>
                <p className="text-xs text-muted-foreground mt-2">{participantCount} participants</p>
            </div>
        </Card>
    );
}