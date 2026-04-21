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

    // Email-invite token flow
    getScannerSession: builder.query<any, string>({
      query: (token) => ({
        url: `/api/survey/scanner/session?token=${token}`,
        method: "GET",
      }),
    }),

    startSurveyByToken: builder.mutation<GetAllSurveyResponse, { token: string; seniorityLevel: string }>({
      query: (body) => ({
        url: "/api/survey/scanner/start-by-token",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Survey"],
    }),

    markInviteComplete: builder.mutation<any, { token: string; surveyId?: string }>({
      query: (body) => ({
        url: "/api/survey/scanner/mark-complete",
        method: "POST",
        body,
      }),
    }),

    // Admin: Upload employee Excel file
    uploadEmployeeExcel: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/api/survey/admin/upload-excel",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Survey"],
    }),

    // Admin: Send invitation emails
    sendInvitations: builder.mutation<any, { organizationId: string; onlyPending?: boolean; limit?: number }>({
      query: (body) => ({
        url: "/api/survey/admin/send-invitations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Survey"],
    }),

    // Admin: Get invite status report
    getInviteStatus: builder.query<any, string>({
      query: (organizationId) => ({
        url: `/api/survey/admin/invite-status?organizationId=${organizationId}`,
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

  // Email-invite token flow
  useGetScannerSessionQuery,
  useStartSurveyByTokenMutation,
  useMarkInviteCompleteMutation,

  // Admin: Email distribution
  useUploadEmployeeExcelMutation,
  useSendInvitationsMutation,
  useGetInviteStatusQuery,
} = surveyApi;
