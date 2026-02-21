import {
  GetAllSurveyResponse,
  SubmitResultRequestBody,
  SurveyRequestBody,
} from "@/typesAndIntefaces/survey/SurveyResponseAndBody";
import { baseApi } from "../baseApi";

export const surveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Start survey (POST)
    getStartSurvey: builder.mutation<GetAllSurveyResponse, SurveyRequestBody>({
      query: (body) => ({
        url: "/api/survey/start",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Survey"],
    }),

    getAllSurveyResult: builder.query({
      query: () => ({
        url: `/api/survey`,
        method: "GET",
      }),
      providesTags: ["Survey"],
    }),

    getAllOrganizationSurveyResult: builder.query({
      query: ({ department, age, gender, location }) => ({
        url: `/api/survey/organization/stats?age=${age}&gender=${gender}&unitDepartment=${department}&location=${location}`,
        method: "GET",
      }),
      providesTags: ["Survey"],
    }),

    // update this api

    getSubdomainStats: builder.mutation({
      query: ({ dashboardDomain, stream, fn, department, age, gender, location }) => ({
        method: "POST",
        url: "/api/survey/subdomain-seats",
        params: { stream, function: fn, department, age, gender, location },
        body: { dashboardDomain },
      }),
    }),

    // Submit survey result (POST)
    submitResult: builder.mutation<GetAllSurveyResponse, SubmitResultRequestBody>({
      query: ({ surveyId, answer }) => ({
        url: `/api/survey/${surveyId}/submit`,
        method: "POST",
        body: answer,
      }),
      invalidatesTags: ["Survey"],
    }),

    // for organization dashboard
    getAllSurveyResultForOrganization: builder.query({
      query: () => ({
        url: `/api/survey/organization/get-single-organization-servays`,
        method: "GET",
      }),
      providesTags: ["Survey"],
    }),

    getAllSurveyStatisticsForOrganization: builder.query({
      query: ({ stream, fn, department, age, gender, location }) => ({
        url: `/api/survey/organization/stats`,
        params: { stream, function: fn, department, age, gender, location },
        method: "GET",
      }),
      providesTags: ["Survey"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetStartSurveyMutation,
  useGetAllOrganizationSurveyResultQuery,
  useGetSubdomainStatsMutation,
  useGetAllSurveyResultQuery,
  useSubmitResultMutation,

  // Organization dashboard
  useGetAllSurveyResultForOrganizationQuery,
  useGetAllSurveyStatisticsForOrganizationQuery,
} = surveyApi;
