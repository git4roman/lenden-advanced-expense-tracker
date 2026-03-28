import { setAuthCredentials } from "@/src/shared/store/slices/auth-slice";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import { setUserInfo, UserInfoState } from "../slices/user-slice";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<UserInfoState, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Slice:", data);
          dispatch(
            setUserInfo({
              givenName: data.givenName,
              familyName: data.familyName,
              username: data.username,
              email: data.email,
              phone: data.phone,
              memberSince: data.memberSince,
            }),
          );
        } catch (error) {
          console.log("Error From Auth Login", error);
        }
      },
    }),
  }),
});

export const { useMeQuery } = userApi;
