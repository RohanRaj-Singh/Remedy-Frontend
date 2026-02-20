import { baseApi } from "../baseApi";

export type Question = {
  status?: string[];
  page?: number;
  limit?: number;
};

import { GetAllQuestionsParams, GetAllQuestionsResponse } from "@/typesAndIntefaces/question";

export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all questions
    getQuestions: builder.query<GetAllQuestionsResponse, GetAllQuestionsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.status) {
          params.status.forEach((s) => queryParams.append("status", s));
        }

        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));

        return {
          url: `/api/question?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Question"],
    }),

    // Get single question
    getQuestion: builder.query<{ success: boolean; data: Question }, string>({
      query: (id) => ({
        url: `/api/question/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Question", id }],
    }),

    // Add new question
    addQuestion: builder.mutation<{ success: boolean; data: Question }, Partial<Question>>({
      query: (body) => ({
        url: "/api/question/add-question",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Question"],
    }),

    updateQuestion: builder.mutation<
      { success: boolean; data: Question },
      { id: string; body: Partial<Question> }
    >({
      query: ({ id, body }) => ({
        url: `/api/question/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Question"],
    }),

    deleteQuestion: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/question/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Question"],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
