import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setUserGroups, setGroupBalance } from "../slices/group-slice";

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
              groups: data.groups ?? data,
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

    getGroupBalance: builder.query({
      query: (groupId: string) => ({
        url: `/groups/${groupId}/balance`,
        method: "GET",
      }),

      async onQueryStarted(groupId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setGroupBalance({
              groupId: groupId,
              transactions: data,
            }),
          );
        } catch (err) {
          console.error(err);
        }
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
    deleteGroupById: builder.mutation({
      query: (groupId: string) => ({
        url: `/groups/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          console.log("deleteGroup request", arg);
          const { data } = await queryFulfilled;
          console.log("deleteGroup success", data);
        } catch (error) {
          console.log("deleteGroup error", JSON.stringify(error, null, 2));
        }
      },
    }),
    leaveGroup: builder.mutation({
      query: (groupId: string) => ({
        url: `/groups/${groupId}/leave`,
        method: "POST",
        body: "",
      }),
      invalidatesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          console.log("leaveGroup request", arg);
          const { data } = await queryFulfilled;
          console.log("leaveGroup success", data);
        } catch (error) {
          console.log("leaveGroup error", JSON.stringify(error, null, 2));
        }
      },
    }),
    updateGroup: builder.mutation({
      query: (payload) => ({
        url: `/groups/${payload.id}`,
        method: "PUT",
        body: {
          name: payload.name,
          imageUrl: payload.imageUrl,
        },
      }),
      invalidatesTags: (result, error, payload) => [
        { type: "Group", id: payload.id },
        { type: "Group", id: "LIST" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          console.log("updateGroup request", arg);
          const { data } = await queryFulfilled;
          console.log("updateGroup success", data);
        } catch (error) {
          console.log("updateGroup error", JSON.stringify(error, null, 2));
        }
      },
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useDeleteGroupMutation,
  useGetGroupQuery,
  useGetGroupBalanceQuery,
  useUpdateGroupMutation,
  useDeleteGroupByIdMutation,
  useLeaveGroupMutation,
} = groupApi;
