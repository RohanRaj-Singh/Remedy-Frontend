import type { RootState } from "@/redux/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getPublicApiBaseUrl } from "@/lib/api-config";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getPublicApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Survey", "Question", "Organizations"],
  endpoints: () => ({}),
});

