import { api } from "./client";

const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (payload) => ({
        url: "/GroupApi",
        method: "POST",
        payload,
      }),
    }),
    getGroups: builder.query({
      query: (payload) => ({
        url: "/GroupApi",
        method: "GET",
        payload,
      }),
    }),
  }),
});

export const { useGetGroupsQuery, useCreateGroupMutation } = groupApi;
