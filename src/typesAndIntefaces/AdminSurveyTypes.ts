export interface DashboardDomainAverage {
  averageRiskScore: number;
  averageSatisfactionScore: number;
  averageRiskStatus: string;
  averageSatisfactionStatus: string;
}

export interface MentalHealthMetric {
  domain: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
  highRiskSurveyCount: number;
  nonHighRiskSurveyCount: number;
  dashboardDomainAverage: DashboardDomainAverage;
}

export interface AgeStat {
  ageGroup: string;
  people: number;
  peoplePercent: number;
  riskScore: number;
  satisfactionScore: number;
  surveyCount: number;
  highRiskCount: number;
  nonHighRiskCount: number;
}

export interface GenderStat {
  gender: string;
  people: number;
  peoplePercent: number;
  riskScore: number;
  satisfactionScore: number;
  surveyCount: number;
  highRiskCount: number;
  nonHighRiskCount: number;
}

export interface DepartmentStat {
  department: string;
  totalResponses: number;
  departmentPercent: number;
  avgRisk: number;
  satisfactionScore: number;
  highRiskCount: number;
  nonHighRiskCount: number;
}

export interface LocationStat {
  location: string;
  totalResponses: number;
  locationPercent: number;
  avgRisk: number;
  satisfactionScore: number;
  highRiskCount: number;
  nonHighRiskCount: number;
}

export interface StreamStat {
  stream: string;
  totalResponses: number;
  streamPercent: number;
  avgRisk: number;
  satisfactionScore: number;
  highRiskCount: number;
  nonHighRiskCount: number;
}

export interface FunctionStat {
  function: string;
  totalResponses: number;
  functionPercent: number;
  avgRisk: number;
  satisfactionScore: number;
  highRiskCount: number;
  nonHighRiskCount: number;
}

export interface AgeDistribution {
  ageGroup: string;
  sharePercent: number;
}

// Main Dashboard Data (: This is the actual shape of response.data.data
export interface DashboardData {
  totalParticipants: number;
  totalHighRiskSurveys: number;

  mentalHealthMetrics: MentalHealthMetric[];

  ageStats: AgeStat[];
  genderStats: GenderStat[];
  departmentStats: DepartmentStat[];
  locationStats: LocationStat[];
  streamStats: StreamStat[];
  functionStats: FunctionStat[];

  ageDistribution: AgeDistribution[];

  // Optional fields (not always present, but safe to include)
  unit?: string;
  appliedFilters?: string[];
  removedFilters?: string[];
  rollUp?: boolean;
}
