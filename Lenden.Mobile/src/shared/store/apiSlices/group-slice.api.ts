import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setUserGroups } from "../slices/group-slice";

const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => ({
        url: "/GroupApi",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUserGroups({
              groups: data.groups,
            }),
          );
        } catch (error) {}
      },
    }),
    createGroup: builder.mutation({
      query: (payload) => ({
        url: "/GroupApi",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUserGroups({
              groups: data.groups,
            }),
          );
        } catch (error) {}
      },
    }),

    deleteGroup: builder.mutation({
      query: (payload) => ({
        url: "/GroupApi",
        method: "DELETE",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUserGroups({
              groups: data.groups,
            }),
          );
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useDeleteGroupMutation,
} = groupApi;
