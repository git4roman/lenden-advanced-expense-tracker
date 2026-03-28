import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setUserGroups } from "../slices/group-slice";

const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => ({
        url: "/groups",
        method: "GET",
      }),
      providesTags: [{ type: "Group", id: "LIST" }],
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
      providesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
      ],
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
      invalidatesTags: [{ type: "Group", id: "LIST" }],
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
      invalidatesTags: [{ type: "Group", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useDeleteGroupMutation,
  useGetGroupQuery,
} = groupApi;
