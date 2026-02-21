export interface ResponsesType {
  question: string;
  answerIndex: number;
  score: number;
  _id: string;
}

export interface GetAllSurveyResponse {
  success: boolean;
  message: string;
  data: {
    survey: {
      user: {
        stream: string;
        function: string;
        department: string;
        gender: string;
        age: string;
        seniorityLevel: string;
        location: string;
        _id: string;
      };
      responses: ResponsesType[];
      questions: string[];
      highRiskCount: number;
      status: string;
      followUpQuestions: string[];
      _id: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    nextQuestion: {
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
    };
  };
}

export interface SurveyRequestBody {
  stream: string;
  function: string;
  department: string;
  gender: string;
  age: string;
  seniorityLevel: string;
  location: string;
  organizationId: string;
}

export interface SubmitResultRequestBody {
  surveyId: string;
  answer: {
    questionId: string;
    answerIndex: number;
  };
}
