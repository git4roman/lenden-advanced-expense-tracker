import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setUserGroups } from "../slices/group-slice";

const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => ({
        url: "/groups",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Group APi ", data);
          dispatch(
            setUserGroups({
              groups: data.groups,
            }),
          );
        } catch (error) {
          console.log("Group APi Error", JSON.stringify(error, null, 2));
        }
      },
    }),
    getGroup: builder.query({
      query: (payload) => ({
        url: `/Groups/${payload}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // dispatch(
          //   setUserGroups({
          //     groups: data.groups,
          //   }),
          // );
        } catch (error) {}
      },
    }),
    createGroup: builder.mutation({
      query: (payload) => ({
        url: "/Group",
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
        url: "/Group",
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
  useGetGroupQuery,
} = groupApi;
