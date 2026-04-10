import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setFriends, Friend } from "@/src/shared/store/slices/friends-slice";

const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<Friend[], void>({
      query: () => ({
        url: "/friendship",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((friend) => ({ type: "Friend" as const, id: friend.id })),
              { type: "Friend" as const, id: "LIST" },
            ]
          : [{ type: "Friend" as const, id: "LIST" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setFriends(data ?? []));
        } catch (error) {
          console.log("Error fetching friends", error);
        }
      },
    }),
  }),
});

export const { useGetFriendsQuery } = friendsApi;
