export interface GetAllQuestionsParams {
  status?: string[];
  page?: number;
  limit?: number;
}

export interface QuestionItem {
  _id: string;
  id: string;
  question: string;
  options: string[];
  domain: string;
  weight: number;
  isInverted: boolean;
  isFollowUp: boolean;
  dashboardDomain: string;
  dashboardDomainMaxPossibleScore: number;
  dashboardDomainWeight: number;
  isDeleted: boolean;
}

export interface QuestionData {
  questions: QuestionItem[];
  totalFilteredQuestions: number;
  totalNonFollowUpQuestion: number;
  totalFollowUpQuestion: number;
  totalNonInvertedQuestion: number;
  totalInvertedQuestion: number;
  totalQuestion: number;
}

export interface QuestionMeta {
  page: number;
  limit: number;
  totalFiltered: number;
  totalPages: number;
}

export interface GetAllQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    data: QuestionData;
    meta: QuestionMeta;
  };
}
