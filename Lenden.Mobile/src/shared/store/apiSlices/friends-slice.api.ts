import { api } from "@/src/shared/store/apiSlices/apiClient";

const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => ({
        url: "/friendship",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetFriendsQuery } = friendsApi;
