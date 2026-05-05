import {
  GroupBalanceResponse,
  GroupDetailedResponse,
  GroupSummaryResponse,
} from "@/src/modules/groups/types/group-slice.type";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setGroupBalance, setUserGroups } from "../slices/group-slice";
// import { Group } from "./Group";

const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<GroupSummaryResponse[], void>({
      query: () => ({
        url: "/groups",
        method: "GET",
      }),
      providesTags: [{ type: "Group", id: "LIST" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log("Fetched Data", JSON.stringify(data, null, 2));
          dispatch(setUserGroups(data));
          console.log("I am fetched");
        } catch (error) {
          console.log("Group APi Error", JSON.stringify(error, null, 2));
        }
      },
    }),
    getGroup: builder.query<GroupDetailedResponse, string>({
      query: (payload) => ({
        url: `/groups/${payload}`,
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
        url: "/groups",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.log("Error aayo creation bata", error);
        }
      },
      invalidatesTags: [{ type: "Group", id: "LIST" }],
    }),

    getGroupBalance: builder.query<GroupBalanceResponse[], string>({
      query: (groupId) => ({
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
  useGetGroupQuery,
  useGetGroupBalanceQuery,
  useUpdateGroupMutation,
  useDeleteGroupByIdMutation,
  useLeaveGroupMutation,
} = groupApi;
