import { baseApi } from "../baseApi";

export const authenticationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/api/organization/login",
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: data,
      }),
    })
  }),
});

export const { useLoginMutation } = authenticationApi;
