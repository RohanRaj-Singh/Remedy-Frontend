"use client";

import { Card } from "@/components/ui/card";
import { useGetSubdomainStatsMutation } from "@/redux/api/apis/surveyApi";
import { getRiskColor } from "@/utils/colors";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DomainSummaryItem {
  domain: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
}

interface SubdomainStatsResponse {
  dashboardDomain: string;
  domainSummary: DomainSummaryItem[];
  departmentSummary: { department: string; participants: number }[];
  locationSummary: { location: string; participants: number }[];
}

interface FearBlameChartProps {
    title: string;
    description?: string;
    data?: { name: string; value: number; isSatisfactionScore?: boolean }[];
    isLoading?: boolean;
    stream?: string;
    fn?: string;
    department?: string;
    age?: string;
    gender?: string;
    location?: string;
}

export function FearBlameChart({ title, description, data, isLoading, stream, fn, department, age, gender, location }: FearBlameChartProps) {
    const [subdomainStats] = useGetSubdomainStatsMutation();
    const [chartData, setChartData] = useState<{ name: string; value: number; isSatisfactionScore?: boolean }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If data is passed directly, use it
        if (data && data.length > 0) {
            setChartData(data);
            return;
        }

        // If no data is passed and we have filter parameters, fetch from API
        if ((stream || fn || department || age || gender || location)) {
            const fetchStats = async () => {
                setLoading(true);
                try {
                    const res = await subdomainStats({
                        dashboardDomain: title,
                        stream: stream || undefined,
                        function: fn || undefined,
                        department: department || undefined,
                        age: age || undefined,
                        gender: gender || undefined,
                        location: location || undefined,
                    }).unwrap();

                    // Build Bar Chart data from domainSummary → riskScore %
                    const formatted = res.data.domainSummary.map((item: DomainSummaryItem) => ({
                        name: item.domain,
                        value: Number(item.satisfiedScore),
                        isSatisfactionScore: true,
                    }));

                    setChartData(formatted);
                } catch (error) {
                    console.error("Error fetching stats:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchStats();
        }
    }, [title, data, stream, fn, department, age, gender, location]);

    // Function to get risk color based on satisfaction score
    const getSatisfactionRiskColor = (satisfactionScore: number): string => {
        if (satisfactionScore >= 85) return "#22c55e"; // Green - No Risk
        if (satisfactionScore >= 70) return "#84cc16"; // Light Green - Low Risk
        if (satisfactionScore >= 50) return "#eab308"; // Yellow/Orange - Medium Risk
        return "#ef4444"; // Red - High Risk
    };

    const isDataLoading = isLoading || loading;

    if (isDataLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center h-80">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </Card>
        );
    }

    const displayData = (data && data.length > 0) ? data : chartData;

    return (
        <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={displayData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                        domain={[0, 100]}
                        label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value) => [`${value}%`, 'Score']}
                        contentStyle={{
                            backgroundColor: "var(--color-background)",
                            border: `1px solid var(--color-border)`,
                        }}
                    />

                    <Bar dataKey="value" fill="var(--color-chart-1)">
                        {displayData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isSatisfactionScore ? getSatisfactionRiskColor(entry.value) : getRiskColor(entry.value)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}