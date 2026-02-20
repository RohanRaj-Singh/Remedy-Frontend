import { baseApi } from "../baseApi";

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrganization: builder.query({
      query: ({ page, limit }) =>
        `/api/organization/get_all_organization?page=${page}&limit=${limit}`,
      providesTags: ["Organizations"],
    }),
    getOrganizationDetail: builder.query({
      query: (id) => `/api/organization/get_single_organization/${id}`,
    }),
    addNewOrganization: builder.mutation({
      query: (name) => ({
        url: `/api/organization/post_organization`,
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: { name, password: "123456" },
      }),
      invalidatesTags: ["Organizations"],
    }),
  }),
});

export const {
  useGetAllOrganizationQuery,
  useGetOrganizationDetailQuery,
  useAddNewOrganizationMutation,
} = organizationApi;
