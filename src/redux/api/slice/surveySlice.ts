/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  department: string;
  gender: string;
  age: string;
  seniorityLevel: string;
  location: string;
  _id: string;
}

interface Response {
  question: string;
  answerIndex: number;
  score: number;
  _id: string;
}

interface Question {
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

interface Survey {
  user: User;
  responses?: any;
  questions?: any;
  highRiskCount: number;
  status: string;
  followUpQuestions?: any;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SurveyState {
  survey: Survey | null;
  nextQuestion: Question | null;
}

const initialState: SurveyState = {
  survey: null,
  nextQuestion: null,
};


export const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setSurveyData: (state, action: PayloadAction<Survey>) => {
      state.survey = action.payload;
    },
    setNextQuestion: (state, action: PayloadAction<Question>) => {
      state.nextQuestion = action.payload;
    },
    addResponse: (state, action: PayloadAction<Response>) => {
      if (state.survey) {
        state.survey.responses.push(action.payload);
      }
    },
    resetSurvey: (state) => {
      state.survey = null;
      state.nextQuestion = null;
    },
  },
});

export const { setSurveyData, setNextQuestion, addResponse, resetSurvey } = surveySlice.actions;
export default surveySlice.reducer;
