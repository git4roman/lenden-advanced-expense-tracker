import { API_CONFIG } from "@/api.config";
import { mockData as groupsMockData } from "@/data/getGroups";
import { mockData as groupExpensesMockData } from "@/data/groupExpenses";
import { GroupExpense } from "@/src/modules/groups";
import { IGroup } from "@/src/modules/groups/types/group-slice.type";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setGroupExpenses, setUserGroups } from "../slices/group-slice";
// import { Group } from "./Group";

const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<IGroup[], void>({
      ...(API_CONFIG.USE_MOCK
        ? {
            queryFn: async (_, { dispatch }) => {
              dispatch(setUserGroups(groupsMockData));
              return { data: groupsMockData as IGroup[] };
            },
          }
        : {
            query: () => ({ url: "/groups", method: "GET" }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
              try {
                const { data } = await queryFulfilled;
                dispatch(setUserGroups(data as IGroup[]));
              } catch (error) {
                console.log("Group API Error", error);
              }
            },
          }),
      providesTags: [{ type: "Group", id: "LIST" }],
    }),

    getGroupExpenses: builder.query<GroupExpense[], string>({
      ...(API_CONFIG.USE_MOCK
        ? {
            async queryFn(_, { dispatch }) {
              dispatch(
                setGroupExpenses({
                  groupId: "2bb0ceca-81f8-4494-9f50-3b2630550ec7",
                  expenses: groupExpensesMockData,
                }),
              );

              return {
                data: groupExpensesMockData as GroupExpense[],
              };
            },
          }
        : {
            query: (groupId) => ({
              url: `expense/${groupId}`,
              method: "GET",
            }),

            async onQueryStarted(groupId, { dispatch, queryFulfilled }) {
              try {
                const { data } = await queryFulfilled;
                dispatch(
                  setGroupExpenses({
                    groupId: groupId,
                    expenses: data,
                  }),
                );
              } catch (error) {
                console.log("Group API Error", error);
              }
            },
          }),

      providesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
        { type: "Group", id: "LIST" },
      ],
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
  useGetGroupExpensesQuery,
  useUpdateGroupMutation,
  useDeleteGroupByIdMutation,
  useLeaveGroupMutation,
} = groupApi;
