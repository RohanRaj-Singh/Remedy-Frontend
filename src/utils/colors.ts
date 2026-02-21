// Risk level color mapping
export const getRiskColor = (percentage: number): string => {
  if (percentage >= 85) return "#22c55e" // Green - No Risk
  if (percentage >= 70) return "#84cc16" // Light Green - Low Risk
  if (percentage >= 50) return "#eab308" // Yellow/Orange - Medium Risk
  return "#ef4444" // Red - High Risk
}

export const getRiskLabel = (percentage: number): string => {
  if (percentage >= 85) return "No Risk"
  if (percentage >= 70) return "Low Risk"
  if (percentage >= 50) return "Medium Risk"
  return "High Risk"
}

export const getRiskBgClass = (percentage: number): string => {
  if (percentage >= 85) return "bg-green-50 dark:bg-green-950"
  if (percentage >= 70) return "bg-lime-50 dark:bg-lime-950"
  if (percentage >= 50) return "bg-yellow-50 dark:bg-yellow-950"
  return "bg-red-50 dark:bg-red-950"
}

export const getRiskTextClass = (percentage: number): string => {
  if (percentage >= 85) return "text-green-700 dark:text-green-300"
  if (percentage >= 70) return "text-lime-700 dark:text-lime-300"
  if (percentage >= 50) return "text-yellow-700 dark:text-yellow-300"
  return "text-red-700 dark:text-red-300"
}
