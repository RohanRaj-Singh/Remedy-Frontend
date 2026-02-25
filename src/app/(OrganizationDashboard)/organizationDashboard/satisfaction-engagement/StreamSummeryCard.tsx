// Utility functions for colors
const getRiskColor = (score: number) => {
  if (score >= 80) return "#10b981"; // green
  if (score >= 60) return "#f59e0b"; // amber
  if (score >= 40) return "#f97316"; // orange
  return "#ef4444"; // red
};

const getRiskTextClass = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

type StreamReport = {
  stream: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
};

export default function StreamSummeryCard({ data }: { data: StreamReport }) {
  const riskColor = getRiskColor(data.satisfiedScore);
  const textClass = getRiskTextClass(data.satisfiedScore);
  const riskTextClass = getRiskTextClass(100 - data.riskScore);

  // Format name: replace underscores with spaces and title case
  const formatName = (str: string) => {
    return str
      .split("_")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">{formatName(data.stream)}</h3>

      <div className="mb-4 flex items-center justify-center">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={riskColor}
              strokeWidth="8"
              strokeDasharray={`${(data.satisfiedScore / 100) * 314} 314`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(data.satisfiedScore)}%
            </span>
            <span className="text-xs text-gray-500">Satisfied</span>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Satisfaction:</span>
          <span className={`font-semibold ${textClass}`}>{data.satisfactionStatus}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Risk Score:</span>
          <span className={`font-semibold ${riskTextClass}`}>{data.riskScore.toFixed(2)}%</span>
        </div>
        {/* <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Risk Status:</span>
          <span className="font-semibold text-green-600">{data.satisfactionStatus}</span>
        </div> */}
      </div>

      <div className="border-t border-gray-200 pt-4 text-center">
        <p className={`text-sm font-semibold ${textClass}`}>
          Based on {data.participants} participant{data.participants !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
