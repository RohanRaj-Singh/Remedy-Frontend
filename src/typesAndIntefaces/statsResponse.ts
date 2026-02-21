export interface MentalHealthMetric {
  domain: string;
  avgRisk: number;
  riskPercent: number;
  surveyCount: number;
  Survey: number;
  nonSurvey: number;
  satisfactionScore: number;
  riskLevel: string;
}

export interface PsychologicalDomain {
  domain: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
}

export interface DepartmentSummary {
  department: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
}

export interface LocationSummary {
  location: string;
  participants: number;
  riskScore: number;
  satisfiedScore: number;
  riskStatus: string;
  satisfactionStatus: string;
}
